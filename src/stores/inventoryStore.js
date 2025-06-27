import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/service'

export const useInventoryStore = defineStore('inventoryStore', () => {
  const invItems = ref([])
  const pagination = ref({
    total: 0,
    currentPage: 1,
    lastPage: 1,
  })

  //Get inventory Items from data base
  async function getInvItems(page = 1, perPage = 10) {
    const response = await api.get('/inventory', {
      params: { page, per_page: perPage },
    })
    invItems.value = response.data.data
    pagination.value = {
      total: response.data.total,
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
    }
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
    const response = await api.delete(`/inventory/${id}`)
    await getInvItems()
    console.log('Deleting inventory with ID:', id)
    return { data: response.data, error: response.error }
  }
  return {
    invItems,
    pagination,
    getInvItems,
    addInvItems,
    deleteInvItem,
  }
})
