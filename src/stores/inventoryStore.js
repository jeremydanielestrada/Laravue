import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/service'

export const useInventoryStore = defineStore('inventoryStore', () => {
  const invItems = ref([])

  //Get inventory Items from data base
  async function getInvItems() {
    const response = await api.get('/inventory')
    invItems.value = response.data
  }

  //Add items to inventory
  async function addInvItems(id, formdata) {
    const response = await api.post(`/inventory${id}`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    await getInvItems()
    return { data: response.data, error: null }
  }

  //Delete an Item to the inventory
  async function deleteInvItem(id) {
    const response = await api.delete(`/inventory${id}`)
    await getInvItems()
    return response.data
  }
  return {
    invItems,
    getInvItems,
    addInvItems,
    deleteInvItem,
  }
})
