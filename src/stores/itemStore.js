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

  async function searchItems(search) {
    const response = await api.get('/item', {
      params: { q: search },
    })
    items.value = response.data
    return { data: response.data, error: null }
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
    await getItems()
    try {
      const id = formData.get('id') || formData.get('item_id')
      if (!id) throw new Error('Item ID is missing for update')
      return await api.post(`/item/${id}?_method=PUT`, formData) // ✅ ID in URL
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
    searchItems,
  }
})
