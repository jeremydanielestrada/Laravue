<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AddItemsDialog from '@/components/common/AddItemsDialog.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { ref, onMounted, watch } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { getMoneyText } from '@/utils/helpers'
import { useDisplay } from 'vuetify'

const isDialogVisible = ref(false)
const itemStore = useItemStore()
const itemData = ref(null)
const isDrawerVisible = ref(false)
const isDeleteVisible = ref(false)
const tableFilters = ref({
  search: '',
})

const { mobile } = useDisplay()
const loadingItems = ref(true)

// const showConfirm = () => {
//   isDeleteVisible.value = true
// }

// Add Item
const onAdd = () => {
  itemData.value = null
  isDialogVisible.value = true
}

const onUpdate = (id) => {
  itemData.value = id
  isDialogVisible.value = true
}

const onDelete = async (id) => {
  await itemStore.deleteItem(id)
  isDeleteVisible.value = false
}

const onSearch = async () => {
  const search = tableFilters.value.search

  if (search?.length >= 3 || search?.length === 0 || search === null) {
    await itemStore.searchItems(search) //  Pass just the string
  }
}

onMounted(() => {
  itemStore.getItems()
})
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>

    <!-- Load the items -->
    <template #content>
      <v-row>
        <v-col cols="12" sm="6" md="12" lg="4">
          <div class="d-flex align-center justify-center">
            <v-text-field
              v-model="tableFilters.search"
              label="Search Item"
              variant="outlined"
              density="compact"
              append-inner-icon="mdi-magnify"
              clearable
              @click:clear="onSearch"
              @input="onSearch"
            ></v-text-field>
            <v-btn icon variant="plain" size="50" class="mb-5" @click="onAdd">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-divider></v-divider>
      </v-row>

      <!-- Display items from database -->

      <v-row>
        <!-- <v-col cols="12" sm="4" md="6" lg="12">
          <div :loading="loadingItems"></div>
        </v-col> -->
        <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="item in itemStore.items" :key="item.id">
          <v-card :title="item.item_name" height="100%" class="d-flex flex-column">
            <v-card-text>
              <v-img
                v-if="item.image_path"
                :src="`/storage/${item.image_path}`"
                height="200"
                cover
              ></v-img>

              <p class="mb-2">{{ item.description }}</p>

              <h2>{{ getMoneyText(item.price) }}</h2>
            </v-card-text>

            <v-card-actions>
              <v-btn variant="elevated" density="comfortable" @click="onUpdate(item.item_id)" icon>
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>

              <v-btn variant="elevated" density="comfortable" @click="isDeleteVisible = true" icon>
                <v-icon color="error" icon="mdi-trash-can"></v-icon>
              </v-btn>
              <ConfirmDialog
                v-model:isDialogVisible="isDeleteVisible"
                title="Delete Item"
                text="Are you sure you want to delete this?"
                @confirm="onDelete(item.item_id)"
              ></ConfirmDialog>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <AddItemsDialog v-model="isDialogVisible" :item-data="itemData"></AddItemsDialog>
    </template>
  </AppLayout>
</template>
