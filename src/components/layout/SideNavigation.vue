<script setup>
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps(['isDrawerVisible'])

// Utilize pre-defined vue functions
const { mobile } = useDisplay()

const isDrawerVisible = ref(props.isDrawerVisible)

// Watch props if it changes
watch(
  () => props.isDrawerVisible,
  () => {
    isDrawerVisible.value = props.isDrawerVisible
  },
)
</script>

<template>
  <v-navigation-drawer
    v-model="isDrawerVisible"
    :persistent="mobile"
    :temporary="mobile"
    :permanent="!mobile"
    width="325"
  >
    <v-list>
      <v-list-item title="Navigation drawer"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
