<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isDrawerVisible = ref(false)
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
    </template>
  </AppLayout>
</template>
