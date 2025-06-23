<script setup>
import { ref } from 'vue'
import api from '@/utils/service'
import { useRouter } from 'vue-router'

//Load variables
const router = useRouter()

const isLoading = ref(false)

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'User',
})

const errorSubmit = ref(null)

// VForm reference
const refVForm = ref()

// Handle form submission
const onFormSubmit = async () => {
  isLoading.value = true
  const { valid } = await refVForm.value.validate()
  if (!valid) return

  try {
    // Use the imported module
    const response = await api.post('/user', formData.value)

    // Save token to localStorage or cookies
    localStorage.setItem('token', response.data.token)
    // Optionally save user

    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Redirect to dashboard or another page
    router.push('/home')

    refVForm.value?.reset()

    console.log(response.data)
  } catch (error) {
    console.error('Register error:', error)
    errorSubmit.value = error.response?.data?.message || 'Register failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-card class="mx-auto" width="500">
    <p class="ma-4 text-center text-red-accent-4" v-if="errorSubmit">{{ errorSubmit }}</p>
    <v-card-text>
      <v-form fast-fail ref="refVForm" @submit.prevent="onFormSubmit">
        <v-text-field
          v-model="formData.first_name"
          label="First Name"
          type="text"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.last_name"
          label="Last Name"
          type="text"
          required
        ></v-text-field>

        <v-text-field v-model="formData.email" label="Email" type="email" required></v-text-field>

        <v-text-field
          v-model="formData.password"
          label="Password"
          type="password"
          required
        ></v-text-field>

        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          type="password"
          required
        ></v-text-field>

        <v-btn class="mt-2" type="submit" block color="blue-grey-darken-4" :loading="isLoading"
          >Submit</v-btn
        >
      </v-form>
      <v-btn to="/" class="pa-5" variant="plain"
        >already have an account?<span class="text-blue">Login</span></v-btn
      >
    </v-card-text>
  </v-card>
</template>
