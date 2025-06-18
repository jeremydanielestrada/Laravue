<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AddItemsDialog from '@/components/common/AddItemsDialog.vue'
import { ref, onMounted } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { getMoneyText } from '@/utils/helpers'

const isAddItem = ref(false)
const itemStore = useItemStore()

onMounted(() => {
  itemStore.getItems()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="12" lg="4">
          <div class="d-flex align-center justify-center">
            <v-text-field
              label="Search"
              variant="outlined"
              density="compact"
              clearable=""
            ></v-text-field>
            <v-btn icon variant="plain" size="50" class="mb-5">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon variant="plain" size="50" class="mb-5" @click="isAddItem = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-divider></v-divider>
      </v-row>

      <!-- Display items from database -->

      <v-row>
        <v-col cols="12" sm="4" v-for="item in itemStore.items" :key="item.id">
          <v-card :title="item.item_name" height="250">
            <v-img
              v-if="item.image_path"
              :src="`/storage/${item.image_path}`"
              height="100"
              cover
            ></v-img>

            <v-card-text>
              <p class="mb-2">{{ item.description }}</p>

              <h2>{{ getMoneyText(item.price) }}</h2>
            </v-card-text>

            <v-card-actions>
              <!-- <v-btn variant="elevated" density="comfortable" @click="onUpdate(item)" icon>
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn> -->

              <!-- <v-btn variant="elevated" density="comfortable" @click="onDelete(item.id)" icon>
                <v-icon color="error" icon="mdi-trash-can"></v-icon>
              </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <AddItemsDialog v-model="isAddItem"></AddItemsDialog>
    </template>
  </AppLayout>
</template>
