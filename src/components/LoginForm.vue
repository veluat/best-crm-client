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

<style scoped lang="scss">
  @import '@/assets/scss/all';

  .login-form {
    @extend .card;
    max-width: 400px;
    margin: 2rem auto;
    box-shadow: 0 2px 10px $shadow-color;
  }

  .login-form h2 {
    margin-top: 0;
    padding-bottom: 1.5rem;
    text-align: center;
    color: $secondary-color;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }
  }

  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: $secondary-color;
    color: $white;
    border: none;
    border-radius: $border-radius;
    font-size: 1rem;

    &:hover {
      background-color: darken($secondary-color, 10%);
    }

    &:disabled {
      background-color: lighten($secondary-color, 20%);
      cursor: not-allowed;
    }
  }

  .error-message {
    margin-top: $base-padding;
    color: $error-color;
    text-align: center;
  }

  .domain-info {
    margin-top: 1.5rem;
    padding-top: $base-padding;
    border-top: 1px solid $border-color;
    text-align: center;
    color: $muted-text-color;
  }
</style>
