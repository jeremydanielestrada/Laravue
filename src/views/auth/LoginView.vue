<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/service.js'

// Router for navigation after login
const router = useRouter()

// Form data
const formData = ref({
  email: '',
  password: '',
})

// VForm reference
const refVForm = ref()

// Handle form submission
const onFormSubmit = async () => {
  const { valid } = await refVForm.value.validate()
  if (!valid) return

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
    alert(error.response?.data?.message || 'Login failed')
  }
}
</script>

<template>
  <v-sheet class="mx-auto" width="300">
    <v-form fast-fail ref="refVForm" @submit.prevent="onFormSubmit">
      <v-text-field v-model="formData.email" label="Email" type="email" required></v-text-field>

      <v-text-field
        v-model="formData.password"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn class="mt-2" type="submit" block>Login</v-btn>
    </v-form>
  </v-sheet>
</template>
