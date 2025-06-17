<script setup>
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import ProfileNavigation from './ProfileNavigation.vue'
import { useAuthStore } from '@/stores/authStore'

//load variables
const { mobile } = useDisplay()
const drawer = ref(true)
const authStore = useAuthStore()
const isLoggedIn = ref(false)

//Get logged Status
const getLoggedStatus = async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => getLoggedStatus())
</script>
<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar app color="blue">
        <v-app-bar-nav-icon v-if="mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer> </v-spacer>
        <ProfileNavigation v-if="isLoggedIn"></ProfileNavigation>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
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
