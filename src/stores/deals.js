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
      this.$reset()
      this.sid = null
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

    async fetchData(entity, method, params = {}) {
      try {
        const response = await this.makeRequest([{
          class: entity,
          method,
          param: params
        }])
        return response[0]?.response || []
      } catch (error) {
        console.error(`Error in ${entity}.${method}:`, error)
        throw error
      }
    },

    async fetchFunnels() {
      this.loading = true
      try {
        this.funnels = await this.fetchData('funnel', 'get_list')
        if (this.funnels.length > 0 && !this.currentFunnelId) {
          this.currentFunnelId = this.funnels[0].funnel_id
        }
        return this.funnels
      } catch (error) {
        this.error = 'Ошибка загрузки воронок'
        return []
      } finally {
        this.loading = false
      }
    },

    async setCurrentFunnel(funnelId) {
      if (!this.funnels.some(f => f.funnel_id === funnelId)) {
        throw new Error('Invalid funnel ID')
      }
      this.currentFunnelId = funnelId
      await this.fetchInitialData()
    },

    async fetchInitialData() {
      if (!this.currentFunnelId) return

      this.loading = true
      try {
        const [statuses, deals] = await Promise.all([
          this.fetchData('order_status', 'get_list', {
            funnel_id: this.currentFunnelId
          }),
          this.fetchData('order', 'get_list', {
            funnel_id: this.currentFunnelId,
            deleted: null,
            field_filter_ids: []
          })
        ])

        this.statuses = statuses
        this.deals = deals
      } catch (error) {
        this.error = 'Ошибка загрузки данных'
      } finally {
        this.loading = false
      }
    },

    async changeDealStatus(orderId, statusId) {
      try {
        await this.fetchData('order', 'set_status', {
          order_id: orderId,
          order_status_id: statusId
        })

        const deal = this.deals.find(d => d.order_id === orderId)
        if (deal) deal.order_status_id = statusId

        return true
      } catch (error) {
        this.error = 'Ошибка изменения статуса'
        return false
      }
    }
  }
})
