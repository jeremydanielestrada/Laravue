<script setup>
import { useAuthStore } from '@/stores/authStore'
import api from '@/utils/service'
import { ref, onMounted } from 'vue'

//Pinia Store
const authStore = useAuthStore()

//Load Variables
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
})

const id = ref(null)
const isLoading = ref(false)
const refVForm = ref()

onMounted(async () => {
  await authStore.isAuthenticated()
  formData.value = {
    first_name: authStore.userData?.first_name || '',
    last_name: authStore.userData?.last_name || '',
    email: authStore.userData?.email || '',
  }
  id.value = authStore.userData?.id || null
})

const onSubmit = async () => {
  isLoading.value = true
  const response = await api.put(`/user/${id}`, {
    first_name: formData.value.first_name,
    last_name: formData.value.last_name,
  })
  if (response.error) throw Error('Error updating name')

  const { data, error } = await api.put(`/user/email/${id}`, {
    email: formData.value.email,
  })
  if (error) {
    console.log('Error updating email')
  } else if (data) {
    isLoading.value = false
  }
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-text-field v-model="formData.first_name" label="Firstname"></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field v-model="formData.last_name" label="Lastname"></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          readonly
          disabled
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn
      class="mt-2"
      type="submit"
      color="blue-darken-4"
      prepend-icon="mdi-account-box-edit-outline"
      :disabled="isLoading"
      :loading="isLoading"
    >
      Update Information
    </v-btn>
  </v-form>
</template>
