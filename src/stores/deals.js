import { defineStore } from 'pinia'
import axios from 'axios'

export const useDealsStore = defineStore('deals', {
  state: () => ({
    deals: [],
    statuses: [],
    funnels: [],
    currentFunnelId: null,
    loading: false,
    error: null,
    sid: localStorage.getItem('laxo_sid') || null,
    domain: 'testbestcompany'
  }),

  actions: {
    async login(email, password) {
      this.loading = true
      try {
        const response = await axios.post('/api', [{
          class: "user_session",
          method: "auth",
          param: { login: email, pass: password },
          domain: this.domain,
          sid: null
        }])

        this.sid = response.data[1].response.sid
        localStorage.setItem('laxo_sid', this.sid)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Ошибка входа'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      localStorage.removeItem('laxo_sid')
      this.sid = null
      this.funnels = []
      this.currentFunnelId = null
    },

    async makeRequest(requestData) {
      try {
        const response = await axios.post('/api',
          requestData.map(request => ({
            ...request,
            domain: this.domain,
            sid: this.sid
          })),
          { headers: { 'Content-Type': 'application/json' } }
        )
        return response.data
      } catch (error) {
        if (error.response?.data?.code === 401) await this.logout()
        throw error
      }
    },

    async fetchFunnels() {
      this.loading = true
      try {
        const response = await this.makeRequest([{
          class: "funnel",
          method: "get_list",
          param: {}
        }])

        this.funnels = response[0]?.response || []
        if (this.funnels.length > 0 && !this.currentFunnelId) {
          this.currentFunnelId = this.funnels[0].funnel_id
        }
        return this.funnels
      } catch (error) {
        this.error = 'Ошибка загрузки воронок'
        console.error(error)
        return []
      } finally {
        this.loading = false
      }
    },

    async setCurrentFunnel(funnelId) {
      if (this.funnels.some(f => f.funnel_id === funnelId)) {
        this.currentFunnelId = funnelId
        await this.fetchInitialData()
      }
    },

    async fetchInitialData() {
      this.loading = true
      try {
        if (!this.currentFunnelId) return

        const [statusesRes] = await Promise.all([
          this.makeRequest([{
            class: "order_status",
            method: "get_list",
            param: { funnel_id: this.currentFunnelId }
          }])
        ])

        this.statuses = statusesRes[0]?.response || []
        await this.fetchDeals()
      } catch (error) {
        this.error = 'Ошибка загрузки данных'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchDeals() {
      this.loading = true
      try {
        if (!this.currentFunnelId) return

        const response = await this.makeRequest([{
          class: "order",
          method: "get_list",
          param: {
            funnel_id: this.currentFunnelId,
            deleted: null,
            field_filter_ids: []
          }
        }])

        this.deals = response[0]?.response || []
      } catch (error) {
        this.error = 'Ошибка загрузки сделок'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async changeDealStatus(orderId, statusId) {
      try {
        await this.makeRequest([{
          class: "order",
          method: "set_status",
          param: { order_id: orderId, order_status_id: statusId }
        }])

        const deal = this.deals.find(d => d.order_id === orderId)
        if (deal) deal.order_status_id = statusId
        return true
      } catch (error) {
        this.error = 'Ошибка изменения статуса'
        console.error(error)
        return false
      }
    }
  }
})
