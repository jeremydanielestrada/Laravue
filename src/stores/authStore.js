import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/service'

export const useAuthStore = defineStore('authStore', () => {
  const userData = ref(null)
  const isLoading = ref(false)

  //Getters
  const user = computed(() => userData.value)
  const isLoggedIn = computed(() => !!userData.value)

  function $reset() {
    userData.value = null
  }

  async function getUserInformation() {
    if (isLoading.value) return false // Prevent multiple call

    isLoading.value = true

    try {
      const response = await api.get('/user')
      userData.value = response.data
      return true
    } catch (error) {
      userData.value = null
      console.error('Failed to fetch user:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function isAuthenticated() {
    if (isLoading.value) return false
    isLoading.value = true
    try {
      const response = await api.get('/profile')
      userData.value = response.data
      return true
    } catch (error) {
      userData.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    //States
    userData,
    isLoading,

    //Getters
    user,
    isLoggedIn,

    //Actions
    $reset,
    isAuthenticated,
    getUserInformation,
  }
})
