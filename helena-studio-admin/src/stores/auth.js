import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/lib/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  function checkAuth() {
    const session = authService.getSession()
    if (session) {
      user.value = { id: session.adminId, username: session.username }
      return true
    }
    user.value = null
    return false
  }

  async function login(username, password) {
    loading.value = true
    error.value = null
    try {
      const result = await authService.login(username, password)
      user.value = result.admin
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
  }

  function refreshSession() {
    authService.refreshSession()
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    login,
    logout,
    refreshSession
  }
})
