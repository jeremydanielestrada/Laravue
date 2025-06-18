import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'
import api from '@/utils/service'

export const useItemStore = defineStore('itemStore', () => {
  const items = ref([])
  const isLoading = ref(false)

  //Get all items from database
  async function getItems() {
    isLoading.value = true
    const response = await api.get('/item')
    items.value = response.data
  }

  //Add item to database

  async function addItem(formData) {
    isLoading.value = true
    const response = await api.post('/item', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    await getItems()
    return response.data
  }

  return {
    items,
    isLoading,
    getItems,
    addItem,
  }
})
