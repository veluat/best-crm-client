<template>
  <div class="deals-view">
    <div class="funnel-selector" v-if="funnels.length > 0">
      <label>Воронка:</label>
      <select v-model="currentFunnelId" @change="changeFunnel">
        <option
          v-for="funnel in funnels"
          :value="funnel.funnel_id"
          :key="funnel.funnel_id"
        >
          {{ funnel.funnel_name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div v-if="!currentFunnelId" class="no-funnel">
        Пожалуйста, выберите воронку из списка
      </div>
      <div v-else-if="deals.length === 0" class="no-deals">
        Нет доступных сделок в выбранной воронке
      </div>

      <KanbanBoard
        v-else
        :deals="deals"
        :statuses="statuses"
        @status-change="changeDealStatus"
      />
    </template>
  </div>
</template>

<script>
  import { computed, onMounted } from 'vue'
  import { useDealsStore } from '../stores/deals'
  import KanbanBoard from '../components/KanbanBoard.vue'

  export default {
    components: { KanbanBoard },
    setup() {
      const dealsStore = useDealsStore()

      const loadInitialData = async () => {
        try {
          await dealsStore.fetchFunnels()
          if (dealsStore.currentFunnelId) {
            await dealsStore.fetchInitialData()
          }
        } catch (error) {
          console.error('Ошибка загрузки данных:', error)
        }
      }

      onMounted(() => {
        loadInitialData()
      })

      const changeFunnel = async (funnelId) => {
        await dealsStore.setCurrentFunnel(funnelId)
      }

      const changeDealStatus = async ({ dealId, newStatusId }) => {
        try {
          await dealsStore.changeDealStatus(dealId, newStatusId)
        } catch (error) {
          console.error('Ошибка изменения статуса:', error)
        }
      }

      onMounted(() => {
        loadInitialData()
      })

      return {
        loading: computed(() => dealsStore.loading),
        error: computed(() => dealsStore.error),
        deals: computed(() => dealsStore.deals),
        statuses: computed(() => dealsStore.statuses),
        funnels: computed(() => dealsStore.funnels),
        currentFunnelId: computed({
          get: () => dealsStore.currentFunnelId,
          set: (value) => dealsStore.setCurrentFunnel(value)
        }),
        changeFunnel,
        changeDealStatus
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/scss/all';

  .funnel-selector {
    margin-bottom: $base-padding;
    padding: $small-padding;
    background-color: $light-gray;
    border-radius: $border-radius;
  }

  .funnel-selector label {
    margin-right: $small-padding;
  }

  .funnel-selector select {
    min-width: 200px;
  }

  .no-funnel,
  .no-deals {
    padding: $base-padding;
    background-color: $warning-color;
    border-radius: $border-radius;
    margin: $base-padding 0;
    color: $warning-text-color;
  }

  .deals-view {
    height: 100%;
    padding: $base-padding;
  }
</style>
