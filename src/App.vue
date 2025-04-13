<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
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

    <main class="app-main">
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
      const router = useRouter()

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

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background-color: #2c3e50;
    color: white;
    padding: 0 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
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
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .logout-button:hover {
    background-color: #c0392b;
    transform: translateX(2px);
  }

  .logout-icon {
    font-weight: bold;
  }

  .app-main {
    flex: 1;
    padding: 1.5rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 0 1rem;
    }

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
      padding: 1rem;
    }
  }
</style>
