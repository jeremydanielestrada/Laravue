<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/utils/service'

//Load variables
const formData = ref({
  password: '',
  password_confirmation: '',
})

//Pinia Store
const authStore = useAuthStore()
const id = authStore.user.id
const isFormSubmitted = ref(null)

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const isLoading = ref(false)
const refVForm = ref()

console.log(id)

const onSubmit = async () => {
  isLoading.value = true
  const response = await api.post(`/user/password/${id}?_method=PUT`, {
    password: formData.value.password,
    password_confirmation: formData.value.password_confirmation,
  })

  if (response.error) {
    console.log('Error updating password', response.error)
  } else {
    console.log('password succesfully updated')
  }
  refVForm.value?.reset()
  if (response.data) {
    isFormSubmitted.value = true
  } else if (response.error) {
    isFormSubmitted.value = false
  }
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
    isFormSubmitted.value = true
    isLoading.value = false
  })
}
</script>

<template>
  <!-- <v-alert
    v-if="isFormSubmitted"
    type="success"
    class="mt-6 success-animation"
    prominent
    border="start"
    color="success"
  >
    <v-alert-title>Password updated Successful!</v-alert-title>
    <div>Your account has been created successfully. Welcome aboard!</div>
  </v-alert> -->

  <!-- <v-alert
    v-else-if=""
    type="success"
    class="mt-6 success-animation"
    prominent
    border="start"
    color="error"
  >
    <v-alert-title>Failed</v-alert-title>
    <div>Failed to update password!</div>
  </v-alert> -->
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock-outline"
          label="New Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Password Confirmation"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn
      class="mt-2"
      type="submit"
      color="blue-darken-4"
      prepend-icon="mdi-key"
      :disabled="isLoading"
      :loading="isLoading"
    >
      Change Password
    </v-btn>
  </v-form>
</template>

<style scoped>
.success-animation {
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%,
  20%,
  60%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}
</style>
