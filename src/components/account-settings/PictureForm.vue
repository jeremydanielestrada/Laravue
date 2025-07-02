<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { fileExtract } from '@/utils/helpers'
import api from '@/utils/service'

//Pinia Store
const authStore = useAuthStore()

//Load Variables
const formData = ref({
  image: null,
})

const imagePreview = ref('/images/defaultProfile.jpg')
const refVForm = ref()
const isLoading = ref(false)

watch(
  () => authStore.user?.image,
  (newImage) => {
    if (newImage) {
      imagePreview.value = `/storage/${newImage}`
    } else {
      imagePreview.value = `/images/defaultProfile.jpg`
    }
  },
  { immediate: true },
)

//Load user data on mount

const onPreview = async (event) => {
  try {
    // AWAIT the promise from fileExtract
    const { fileObject, fileUrl } = await fileExtract(event)

    if (fileObject && fileUrl) {
      // Revoke previous URL if it exists
      if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview.value)
      }

      formData.value.image = fileObject
      imagePreview.value = fileUrl
    }
  } catch (error) {
    console.error('Error extracting file:', error)
    onPreviewReset()
  }
}

const onPreviewReset = () => {
  // Safe access with optional chaining
  imagePreview.value = authStore.user?.image
    ? `/storage/${authStore.user.image}`
    : '/images/defaultProfile.jpg'
}

const onSubmit = async () => {
  if (!formData.value.image) {
    console.error('No image selected')
    return
  }

  isLoading.value = true

  const form = new FormData()
  form.append('image', formData.value.image)
  form.append('_method', 'PUT') ///method spoofing

  try {
    const { data } = await api.post('/profile/image', form)

    console.log('Uploaded:', data)

    // Update the user data in store after successful upload
    if (data.user) {
      authStore.userData = data.user
    }

    // Reset form
    formData.value.image = null
  } catch (error) {
    console.error('Error uploading photo:', error.response?.data || error.message)
  } finally {
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
  <!-- Show loading state while auth is being checked -->

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col cols="12" md="5" sm="6">
        <v-img
          width="55%"
          class="mx-auto rounded-circle"
          aspect-ratio="1"
          color="blue-darken-4"
          :src="imagePreview"
          alt="Profile Picture Preview"
          cover
        >
        </v-img>
      </v-col>

      <v-col cols="12" md="6" sm="7">
        <v-file-input
          class="mt-5"
          accept="image/png, image/jpeg, image/bmp"
          label="Browse Profile Picture"
          placeholder="Browse Profile Picture"
          prepend-icon="mdi-camera"
          show-size
          chips
          @change="onPreview"
          @click:clear="onPreviewReset"
        >
        </v-file-input>

        <v-btn
          class="mt-2"
          type="submit"
          color="blue-darken-4"
          prepend-icon="mdi-image-edit"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Update Picture
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
