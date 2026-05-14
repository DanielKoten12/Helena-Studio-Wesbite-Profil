<template>
  <div class="login-shell">
    <div class="login-decoration" />
    <div class="login-decoration bottom" />

    <div class="login-card">
      <div class="login-logo-wrap">
        <div class="login-logo">
          <img src="@/assets/login-logo.png" alt="Helena Studio Logo" class="login-logo-image" />
        </div>
        <h1>Helena Studio</h1>
        <p>Admin Panel</p>
      </div>

      <div class="login-copy">
        <h2>Selamat Datang</h2>
        <p>Masuk untuk mengelola Helena Studio</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Username</label>
          <div class="input-wrap">
            <span class="input-icon">
              <AtSign :size="14" />
            </span>
            <input
              v-model="username"
              type="text"
              class="form-input"
              placeholder="Masukkan username"
              required
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <span class="input-icon">
              <Hash :size="14" />
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Masukkan password"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-password"
              :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="14" />
              <Eye v-else :size="14" />
            </button>
          </div>
        </div>

        <div v-if="authStore.error" class="form-error login-error">
          {{ authStore.error }}
        </div>

        <button type="submit" class="btn btn-primary login-submit" :disabled="authStore.loading">
          <span v-if="authStore.loading">Memproses...</span>
          <span v-else>Masuk ke Panel Admin</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AtSign, Eye, EyeOff, Hash } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
