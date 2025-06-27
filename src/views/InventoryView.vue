<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { getMoneyText } from '@/utils/helpers'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

//Load Variables
const authStore = useAuthStore()
const invStore = useInventoryStore()
const isDrawerVisible = ref(false)
const isDialogVisible = ref(false)

const onDelete = async (id) => {
  await invStore.deleteInvItem(id)
  isDialogVisible.value = true
}

onMounted(() => {
  if (invStore.invItems.length == 0) invStore.getInvItems()
})

const onPageChange = (page) => {
  invStore.getInvItems(page)
}
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>
    <template #content>
      <v-row>
        <v-col cols="auto" class="d-flex align-center">
          <v-img
            :src="authStore.userData?.image || '/images/defaultProfile.jpg'"
            rounded
            width="100"
            aspect-ratio="4/3"
          >
          </v-img>
          <div class="d-flex flex-column">
            <h1>
              {{ authStore.userData?.first_name + ' ' + authStore.userData?.last_name }}
            </h1>
            <span class="text-success">Admin</span>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" md="12">
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Item name</th>
                <th class="text-left font-weight-bold">Owner</th>
                <th class="text-left font-weight-bold">Price</th>
                <th class="text-left font-weight-bold">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in invStore.invItems" :key="item.id">
                <td>{{ item.item.item_name }}</td>
                <td>{{ item.user.first_name + ' ' + item.user.last_name }}</td>
                <td>{{ getMoneyText(item.item.price) }}</td>
                <td>{{ item.quantity }}</td>
                <v-btn
                  icon
                  size="xm"
                  variant="plain"
                  density="comfortable"
                  color="error"
                  @click="isDialogVisible = true"
                >
                  <v-icon>mdi-trash-can</v-icon>
                  <v-tooltip activator="parent" location="top">Delete Item</v-tooltip>
                </v-btn>
                <ConfirmDialog
                  v-model:isDialogVisible="isDialogVisible"
                  title="Delete  Item"
                  text="Are you sure deleting this item?"
                  @confirm="onDelete(item.id)"
                ></ConfirmDialog>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-footer app padless class="bg-white">
        <v-container class="d-flex justify-center py-2">
          <v-pagination
            v-if="invStore.pagination.lastPage > 1"
            v-model="invStore.pagination.currentPage"
            :length="invStore.pagination.lastPage"
            @input="onPageChange"
          >
          </v-pagination>
        </v-container>
      </v-footer>
    </template>
  </AppLayout>
</template>
<style scoped></style>
