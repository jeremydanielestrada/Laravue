<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import ProfileNavigation from './ProfileNavigation.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'

//load variables
const { mobile } = useDisplay()
const drawer = ref(true)
const authStore = useAuthStore()
const isLoggedIn = ref(false)
const router = useRoute()

//Get logged Status
const getLoggedStatus = async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => getLoggedStatus())

onMounted(() => {
  if (mobile.value) {
    drawer.value = false
  } else {
    drawer.value = true
  }
})

watch(
  () => router.fullPath,
  () => {
    if (mobile.value) drawer.value = false
  },
)
</script>
<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar app color="blue">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer> </v-spacer>
        <ProfileNavigation v-if="isLoggedIn"></ProfileNavigation>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" app temporary>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
