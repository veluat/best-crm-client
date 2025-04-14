<template>
  <div class="kanban-container">
    <div class="kanban-board">
      <div
        v-for="status in statuses"
        :key="status.order_status_id"
        class="status-column"
        :class="{ 'drag-over': dragOverColumn === status.order_status_id }"
        @dragover.prevent="handleDragOver"
        @dragenter.prevent="handleDragEnter(status)"
        @dragleave="handleDragLeave"
        @drop="handleDrop(status)"
      >
        <div class="status-header">
          <span class="status-title">{{ status.order_status_name }}</span>
          <span class="deal-count">{{ getDealsByStatus(status.order_status_id).length }}</span>
        </div>

        <div class="deals-list">
          <div
            v-for="deal in getDealsByStatus(status.order_status_id)"
            :key="deal.order_id"
            class="deal-card"
            draggable="true"
            @dragstart="handleDragStart(deal)"
            @dragend="handleDragEnd"
          >
            <h3>{{ deal.order_name }}</h3>
            <p>Сумма: {{ deal.order_sum }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      deals: Array,
      statuses: Array
    },
    data() {
      return {
        draggedDeal: null,
        dragOverColumn: null
      }
    },
    methods: {
      getDealsByStatus(statusId) {
        return this.deals.filter(deal => deal.order_status_id === statusId)
      },
      handleDragStart(deal) {
        this.draggedDeal = deal
      },
      handleDragEnd() {
        this.draggedDeal = null
      },
      handleDragOver(event) {
        if (this.draggedDeal) {
          event.dataTransfer.dropEffect = 'move'
        }
      },
      handleDragEnter(status) {
        if (this.draggedDeal) {
          this.dragOverColumn = status.order_status_id
        }
      },
      handleDragLeave() {
        this.dragOverColumn = null
      },
      handleDrop(targetStatus) {
        if (!this.draggedDeal ||
          this.draggedDeal.order_status_id === targetStatus.order_status_id) {
          this.dragOverColumn = null
          return
        }

        this.$emit('status-change', {
          dealId: this.draggedDeal.order_id,
          newStatusId: targetStatus.order_status_id
        })

        this.dragOverColumn = null
        this.draggedDeal = null
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/scss/all';

  .kanban-container {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .kanban-board {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    height: 100%;
    width: 100%;
    align-items: start;
  }

  .status-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: $light-gray;
    border-radius: $status-header-border-radius;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .status-header {
    padding: 12px 16px;
    background: $primary-color;
    color: $white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .status-title {
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .deal-count {
    background: $secondary-color;
    color: $white;
    border-radius: 12px;
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
  }

  .deals-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    align-content: start;
  }

  .deal-card {
    @extend .card;
    cursor: grab;
    border-left: 4px solid $secondary-color;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 6px 0;
      font-size: 14px;
      font-weight: 600;
      color: $text-color;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      margin: 0;
      color: $muted-text-color;
      font-size: 13px;
    }
  }

  .drag-over {
    background-color: #f0fdf4;
    box-shadow: inset 0 0 0 2px $secondary-color;
  }

  @media (max-width: 1024px) {
    .kanban-board {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .kanban-board {
      grid-template-columns: 1fr 1fr;
    }

    .kanban-container {
      padding: 12px;
    }
  }

  @media (max-width: 576px) {
    .kanban-board {
      grid-template-columns: 1fr;
    }

    .status-column {
      min-height: 200px;
    }
  }

  @media (max-width: 374px) {
    .kanban-container {
      padding: 1px;
      min-width: 375px;
    }

    .status-header {
      padding: 10px 12px;
    }

    .deal-card {
      padding: 12px;
    }
  }

  @-moz-document url-prefix() {
    .status-column {
      min-height: 0;
    }
  }
</style>
