<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { getAvatarText } from '@/utils/helpers'
import api from '@/utils/service'

const router = useRouter()
const authStore = useAuthStore()

const loader = ref(false)

const onLogout = async () => {
  loader.value = true
  try {
    const response = await api.post('/logout')
    console.log(response.data?.message)
    // Reset State
    setTimeout(() => {
      authStore.$reset()

      //remove tokens from localStorage
      localStorage.removeItem('token', response.data.token)
      localStorage.removeItem('user', response.data.user)
    }, 2500)

    // Redirect to homepage
    router.replace('/')
  } catch (error) {
    console.error(error, 'Erro Logging Out')
    loader.value = false
  }
}
</script>

<template>
  <v-menu min-width="200px" rounded>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          v-if="authStore.userData.image_url"
          :image="authStore.userData.image_url"
          color="orange-darken-3"
          size="large"
        >
        </v-avatar>

        <v-avatar v-else color="light-green-lighten-5" size="large">
          <span class="text-h5">
            {{ getAvatarText(authStore.userData.name) }}
          </span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="mt-1">
      <v-card-text>
        <v-list>
          <v-list-item :subtitle="authStore.userData.email" :title="authStore.userData.name">
            <template #prepend>
              <v-avatar
                v-if="authStore.userData.image_path"
                :image="authStore.userData.image_path"
                color="blue-darken-3"
                size="large"
              >
              </v-avatar>

              <v-avatar v-else color="blue-lighten-5" size="large">
                <span class="text-h5">
                  {{ getAvatarText(authStore.userData.name) }}
                </span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3"></v-divider>

        <v-btn prepend-icon="mdi-wrench" variant="plain" to="/account/settings">
          Account Settings
        </v-btn>

        <v-divider class="my-3"></v-divider>

        <v-btn prepend-icon="mdi-logout" variant="plain" @click="onLogout" :loading="loader">
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
