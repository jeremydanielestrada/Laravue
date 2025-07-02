<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import PasswordForm from '@/components/account-settings/PasswordForm.vue'
import ProfileForm from '@/components/account-settings/ProfileForm.vue'
import PictureForm from '@/components/account-settings/PictureForm.vue'

import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'

// Load variables
const isDrawerVisible = ref(false)
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.user) {
    await authStore.isAuthenticated()
  }
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
    <template #content>
      <v-container>
        <v-card class="mb-5">
          <template #title>
            <span class="text-h6 font-weight-bold">
              <v-breadcrumbs :items="['Account', 'Settings']">
                <template #prepend>
                  <v-icon icon="mdi-wrench" size="small" class="me-1"></v-icon>
                </template>
              </v-breadcrumbs>
            </span>
          </template>

          <template #subtitle>
            <p class="ms-4 text-wrap">
              Edit profile information, update profile picture and change password.
            </p>
          </template>
        </v-card>
        <div v-if="authStore.isLoading" class="text-center pa-4">
          <v-progress-circular indeterminate color="blue-darken-4"></v-progress-circular>
          <p>Loading user data...</p>
        </div>
        <v-row v-if="authStore.isLoggedIn && authStore.user">
          <v-col cols="12" lg="4">
            <v-card>
              <v-card-text>
                <v-img
                  width="50%"
                  class="mx-auto rounded-circle"
                  color="blue-darken-4"
                  aspect-ratio="1"
                  :src="
                    authStore.user.image
                      ? `/storage/${authStore.user.image}`
                      : '/images/defaultProfile.jpg'
                  "
                  alt="Profile Picture"
                  cover
                >
                </v-img>

                <h3 class="d-flex align-center justify-center mt-5">
                  <v-icon class="me-2" icon="mdi-account-badge"> </v-icon>
                  {{ authStore.user.role }}
                </h3>

                <v-divider class="my-5"></v-divider>

                <div class="text-center">
                  <h4 class="my-2">
                    <b>Fullname:</b>
                    {{ authStore.user.first_name + ' ' + authStore.user.last_name }}
                  </h4>
                  <h4 class="my-2"><b>Email:</b> {{ authStore.user.email }}</h4>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="8">
            <v-card class="mb-5" title="Profile Picture">
              <v-card-text>
                <PictureForm></PictureForm>
              </v-card-text>
            </v-card>

            <v-card class="mb-5" title="Profile Information">
              <v-card-text>
                <ProfileForm></ProfileForm>
              </v-card-text>
            </v-card>

            <v-card class="mb-5" title="Change Password">
              <v-card-text>
                <PasswordForm></PasswordForm>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
