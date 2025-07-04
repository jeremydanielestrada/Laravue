<script setup>
import { onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const props = defineProps(['isDrawerVisible'])

// Utilize pre-defined vue functions
const { mobile } = useDisplay()

//Load variables
const isDrawerVisible = ref(props.isDrawerVisible)
const role = ref('')

// Watch props if it changes
watch(
  () => props.isDrawerVisible,
  () => {
    isDrawerVisible.value = props.isDrawerVisible
  },
)

onMounted(() => {
  const userLogged = authStore.isAuthenticated()
  if (userLogged) role.value = authStore.user?.role
})

console.log(role)
</script>

<template>
  <v-navigation-drawer
    v-model="isDrawerVisible"
    :persistent="mobile"
    :temporary="mobile"
    :permanent="!mobile"
    width="325"
  >
    <!-- Add navigation item inside the list -->
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Home" to="/home"> </v-list-item>
      <v-list-item prepend-icon="mdi-nas" title="Inventory" to="/inventory" v-if="role === 'Admin'">
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
