<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content container">
        <h1 class="app-title">Best CRM</h1>
        <div v-if="isAuthenticated" class="header-actions">
          <span class="user-email">{{ userEmail }}</span>
          <button @click="handleLogout" class="logout-button">
            <span class="logout-text">Выйти</span>
            <span class="logout-icon">→</span>
          </button>
        </div>
      </div>
    </header>

    <main class="app-main container">
      <router-view v-if="isAuthenticated" />
      <LoginForm v-else />
    </main>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import { useDealsStore } from './stores/deals'
  import LoginForm from './components/LoginForm.vue'
  import { useRouter } from 'vue-router'

  export default {
    components: { LoginForm },
    setup() {
      const dealsStore = useDealsStore()
      const index = useRouter()

      const isAuthenticated = computed(() => !!dealsStore.sid)
      const userEmail = computed(() => {
        return 'admin@testbestcompany.com'
      })

      const handleLogout = async () => {
        await dealsStore.logout()
        await router.push('/login')
      }

      return {
        isAuthenticated,
        userEmail,
        handleLogout
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/scss/all';

  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background-color: $primary-color;
    color: $white;
    padding: 0 $base-padding;
    box-shadow: 0 2px 8px $shadow-color;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-height;
  }

  .app-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .user-email {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .logout-button {
    background-color: $danger-color;
    color: $white;
    border: none;
    border-radius: $border-radius;
    padding: 0.4rem 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background-color: $danger-hover-color;
      transform: translateX(2px);
    }
  }

  .logout-icon {
    font-weight: bold;
  }

  .app-main {
    flex: 1;
    padding: $base-padding;
  }

  @media (max-width: 768px) {
    .app-title {
      font-size: 1.1rem;
    }

    .header-actions {
      gap: 1rem;
    }

    .user-email {
      display: none;
    }

    .logout-button {
      padding: 0.4rem;
    }

    .logout-text {
      display: none;
    }

    .app-main {
      padding: $small-padding;
    }
  }
</style>
