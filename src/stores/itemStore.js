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
    return { data: response.data, error: null }
  }

  //Update an Item
  async function updateItem(formData) {
    try {
      const id = formData.get('id')
      if (!id) throw new Error('Missing item ID for update')

      const response = await api.post(`/item/${id}?_method=PUT`, formData)

      return {
        data: response.data,
        error: null,
      }
    } catch (error) {
      return {
        data: null,
        error: error.response?.data || { message: 'Update failed' },
      }
    }
  }

  //Delete an Item
  async function deleteItem(id) {
    try {
      const response = await api.delete(`/item/${id}`)
      await getItems() // refresh the list if needed
      return response.data
    } catch (error) {
      console.error('Delete failed:', error)
      throw error
    }
  }
  return {
    items,
    isLoading,
    getItems,
    addItem,
    updateItem,
    deleteItem,
  }
})
