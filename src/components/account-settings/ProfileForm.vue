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

const id = authStore.user.id
const isLoading = ref(false)
const refVForm = ref()

onMounted(async () => {
  await authStore.isAuthenticated()
  formData.value = {
    first_name: authStore.user.first_name || '',
    last_name: authStore.user.last_name || '',
    email: authStore.user.email || '',
  }
})

const onSubmit = async () => {
  isLoading.value = true

  console.log('formData', formData)

  const form = new FormData()
  form.append('first_name', formData.value.first_name)
  form.append('last_name', formData.value.last_name)
  form.append('_method', 'PUT') ///method spoofing

  const response = await api.post(`/user/${id}`, form)
  if (response.error) throw Error('Error updating name')

  // Create a new FormData for the second request
  const emailForm = new FormData()
  emailForm.append('email', formData.value.email)
  emailForm.append('_method', 'PUT')

  const { data, error } = await api.post(`/user/email/${id}`, emailForm)
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
          v-model="formData.email"
          label="Email"
          type="email"
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
