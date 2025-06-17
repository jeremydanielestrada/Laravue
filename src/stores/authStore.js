import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/service'

export const useAuthStore = defineStore('authStore', () => {
  const userData = ref(null)

  function $reset() {
    userData.value = null
  }

  async function isAuthenticated() {
    try {
      const response = await api.get('/profile') // or '/api/user' if that's your route
      userData.value = response.data
      return true
    } catch (error) {
      console.error('Authentication check failed:', error)
      userData.value = null
      return false
    }
  }

  return {
    userData,
    $reset,
    isAuthenticated,
  }
})
