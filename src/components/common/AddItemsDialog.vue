<script setup>
import { ref, watchEffect } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { useAuthStore } from '@/stores/authStore'
import { fileExtract } from '@/utils/helpers'

const props = defineProps({
  modelValue: Boolean,
})

const itemStore = useItemStore()
const authStore = useAuthStore()

const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)

const selectedFile = ref(null)
const isLoading = ref(false)

const refVForm = ref()
const isUpdate = ref(false)
const imgPreview = ref('/images/item-image.png')

const formDataDefault = {
  item_name: '',
  image_path: '',
  price: '',
  description: '',
  user_id: null,
}

const formData = ref({
  ...formDataDefault,
})

// Watch for changes in authStore to populate user_id
watchEffect(() => {
  if (authStore.userData?.id) {
    formData.value.user_id = authStore.userData.id
  }
})

// Sync selected image to formData
watchEffect(() => {
  formData.value.image_path = selectedFile.value
})

// Function to handle file change and show image preview
const onPreview = async (event) => {
  const { fileObject, fileUrl } = await fileExtract(event)
  // Update formData
  formData.value.image = fileObject
  // Update imgPreview state
  imgPreview.value = fileUrl
}

// Function to reset preview if file-input clear is clicked
const onPreviewReset = () => {
  imgPreview.value = formData.value.image_path ?? '/images/item-image.png'
}

//Define functions
const addItem = async () => {
  isLoading.value = true

  const form = new FormData()

  for (const key in formData.value) {
    form.append(key, formData.value[key])
  }

  const { data, error } = await itemStore.addItem(form)

  if (error) {
    alert(error.message)
  } else if (data) {
    await itemStore.getItems()
  }
  resetForm()
}
function resetForm() {
  formData.value = { ...formDataDefault, user_id: authStore.userData?.id }
  selectedFile.value = null
  refVForm.value?.reset()
  close()
}
</script>

<template>
  <v-dialog
    width="500px"
    :model-value="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    persistent
  >
    <v-card class="pa-3">
      <v-card-title>Add Item</v-card-title>
      <v-form ref="refVForm" fast-fail @submit.prevent="addItem">
        <v-text-field label="Name" v-model="formData.item_name" />
        <v-text-field type="number" label="Price" v-model="formData.price" />
        <v-textarea label="Description" v-model="formData.description" clearable />
        <v-btn block color="blue-darken-3" type="submit" :loading="isLoading"> Add </v-btn>
        <v-img
          width="55%"
          class="mx-auto rounded-circle mt-5"
          color="blue-darken-4"
          aspect-ratio="1"
          :src="imgPreview"
          alt="Item Picture Preview"
          cover
        ></v-img>
        <v-file-input
          class="mt-5"
          accept="image/png, image/jpeg"
          label="Browse Item Picture"
          placeholder="Browse Item Picture"
          prepend-icon="mdi-camera"
          show-size
          chips
          v-model="selectedFile"
          @change="onPreview"
          @click:clear="onPreviewReset"
        ></v-file-input>
      </v-form>
      <v-card-actions>
        <v-btn @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
