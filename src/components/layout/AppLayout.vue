<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import ProfileNavigation from './ProfileNavigation.vue'
import { useAuthStore } from '@/stores/authStore'

//load variables
const { mobile } = useDisplay()
const drawer = ref(true)
const authStore = useAuthStore()

const props = defineProps(['isWithAppBarNavIcon'])

const emit = defineEmits(['isDrawerVisible'])

onMounted(() => {
  if (mobile.value) {
    drawer.value = false
  } else {
    drawer.value = true
  }
})

//Store user role in local storage
</script>
<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar app color="blue" border>
        <v-app-bar-nav-icon
          v-if="props.isWithAppBarNavIcon"
          icon="mdi-menu"
          @click="emit('isDrawerVisible')"
        ></v-app-bar-nav-icon>
        <v-spacer> </v-spacer>
        <ProfileNavigation v-if="authStore.isLoggedIn"></ProfileNavigation>
      </v-app-bar>

      <slot name="navigation"></slot>

      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
