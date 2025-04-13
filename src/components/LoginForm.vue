<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <h2>Авторизация в Best CRM</h2>

    <div class="form-group">
      <label>Email</label>
      <input v-model="email" type="email" required>
    </div>

    <div class="form-group">
      <label>Пароль</label>
      <input v-model="password" type="password" required>
    </div>

    <button type="submit" :disabled="loading" class="login-button">
      {{ loading ? 'Вход...' : 'Войти' }}
    </button>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="domain-info">
      Домен аккаунта: <strong>testbestcompany</strong>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useDealsStore } from '../stores/deals'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref(null)

    const dealsStore = useDealsStore()
    const router = useRouter()

    const handleLogin = async () => {
      loading.value = true
      error.value = null

      try {
        const success = await dealsStore.login(email.value, password.value)
        if (success) {
          await router.push('/')
        }
      } catch (err) {
        error.value = err.message || 'Ошибка авторизации'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.login-form h2 {
  margin-top: 0;
  text-align: center;
  color: #42b983;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #369f6d;
}

.login-button:disabled {
  background-color: #a0d9bb;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  color: #ff4444;
  text-align: center;
}

.domain-info {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}
</style>
