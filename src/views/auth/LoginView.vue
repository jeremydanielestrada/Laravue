<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/service.js'

// Router for navigation after login
const router = useRouter()

const loader = ref(false)
// Form data
const formData = ref({
  email: '',
  password: '',
})

// VForm reference
const refVForm = ref()

const errorSubmit = ref(null)

// Handle form submission
const onFormSubmit = async () => {
  const { valid } = await refVForm.value.validate()
  if (!valid) return
  loader.value = true
  try {
    // Use the imported module
    const response = await api.post('/login', formData.value)

    // Save token to localStorage or cookies
    localStorage.setItem('token', response.data.token)

    // Optionally save user
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Redirect to dashboard or another page
    router.push('/home')

    refVForm.value?.reset()

    console.log(response.data)
  } catch (error) {
    console.error('Login error:', error)
    errorSubmit.value = error.response?.data?.message
    loader.value = false
  }
}
</script>

<template>
  <v-card class="mx-auto" width="500">
    <p class="ma-4 text-center text-red-accent-4" v-if="errorSubmit">{{ errorSubmit }}</p>
    <v-card-text>
      <v-form fast-fail ref="refVForm" @submit.prevent="onFormSubmit">
        <v-text-field v-model="formData.email" label="Email" type="email" required></v-text-field>

        <v-text-field
          v-model="formData.password"
          label="Password"
          type="password"
          required
        ></v-text-field>

        <v-btn
          class="mt-2"
          type="submit"
          block
          color="blue-grey-darken-4"
          :loading="loader"
          :disable="loader"
          >Login</v-btn
        >
      </v-form>

      <v-btn to="/register" class="pa-5" variant="plain"
        >dont have an account? <span class="text-blue">Register</span></v-btn
      >
    </v-card-text>
  </v-card>
</template>
