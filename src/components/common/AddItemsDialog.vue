<script setup>
import { ref, watchEffect, watch } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { useAuthStore } from '@/stores/authStore'
import { fileExtract } from '@/utils/helpers'
import { useDisplay } from 'vuetify'

const props = defineProps({
  modelValue: Boolean,
  itemData: Number,
})

const emit = defineEmits(['update:modelValue'])

// Utilize pre-defined vue functions
const { mdAndDown } = useDisplay()

//Use pinia store
const itemStore = useItemStore()
const authStore = useAuthStore()

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

// Monitor itemData if it has data
watch(
  () => props.itemData,
  () => {
    isUpdate.value = props.itemData ? true : false
    formData.value = props.itemData
      ? { ...props.itemData, id: props.itemData.id || props.itemData.item_id }
      : { ...formDataDefault }

    // If updating, show the saved image from backend
    if (isUpdate.value && props.itemData?.image_path) {
      imgPreview.value = `/storage/${props.itemData.image_path}`
    } else {
      imgPreview.value = '/images/item-image.png'
    }
  },
)

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
  formData.value.image_path = fileObject
  // Update imgPreview state
  imgPreview.value = fileUrl
}

// Function to reset preview if file-input clear is clicked
const onPreviewReset = () => {
  imgPreview.value = formData.value.image_path ?? '/images/item-image.png'
}

//Define functions
const onSubmit = async () => {
  isLoading.value = true

  const form = new FormData()

  // ✅ Append fields from formData
  for (const key in formData.value) {
    const value = formData.value[key]
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      form.append(key, value)
    }
  }

  // ✅ Make sure item_id is included before the request
  if (isUpdate.value && formData.value.item_id) {
    form.append('id', formData.value.id)
    console.log('Appending ID:', formData.value.id)
  }

  console.log('Updating item with ID:', formData.value.id)

  // ✅ Log again to verify
  for (let pair of form.entries()) {
    console.log(pair[0], pair[1])
  }

  for (let [key, val] of form.entries()) {
    console.log(`${key}:`, val)
  }

  // ✅ Now call the API
  const { data, error } = isUpdate.value
    ? await itemStore.isUpdate(form)
    : await itemStore.addItem(form)

  if (data) {
    await itemStore.getItems()
    onFormReset()
  } else if (error) {
    alert(error.message)
  }

  isLoading.value = false
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// function resetForm() {
//   formData.value = { ...formDataDefault, user_id: authStore.userData?.id }
//   selectedFile.value = null
//   refVForm.value?.reset()
// }

// Form Reset
function onFormReset() {
  refVForm.value?.reset()
  formData.value = { ...formDataDefault, user_id: authStore.userData?.id }
  selectedFile.value = null

  //  Add this slight delay to allow reset to complete
  setTimeout(() => {
    emit('update:modelValue', false)
  }, 100)
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
      <v-form ref="refVForm" fast-fail @submit.prevent="onFormSubmit">
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
        <v-btn @click="onFormReset">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
