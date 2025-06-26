<script setup>
import { ref, watchEffect, watch, isRef, toRaw } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { useAuthStore } from '@/stores/authStore'
import { fileExtract } from '@/utils/helpers'
import { useDisplay } from 'vuetify'

//The root of the problem cause before modification its passing object number
const props = defineProps({
  modelValue: Boolean,
  itemData: {
    type: [Object, Number],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
const { mdAndDown } = useDisplay()

// Stores
const itemStore = useItemStore()
const authStore = useAuthStore()

const selectedFile = ref(null)
const isLoading = ref(false)
const refVForm = ref()
const isUpdate = ref(false)
const imgPreview = ref('/images/item-image.png')

// Default form values
const formDataDefault = {
  item_name: '',
  image_path: '',
  price: '',
  description: '',
  user_id: null,
  id: null,
  quantity: '',
}

const formData = ref({ ...formDataDefault })

// When props.itemData changes -- supports both Object and Number
watch(
  () => props.itemData,
  async (newValue) => {
    isUpdate.value = !!newValue

    if (typeof newValue === 'number') {
      // If it's just an ID, fetch the full item from store or API
      const item = itemStore.items.find((i) => i.item_id === newValue)

      if (item) {
        formData.value = { ...item }
        if (item.image_path) {
          imgPreview.value = `/storage/${item.image_path}`
        }
      } else {
        console.warn('Item not found in store')
      }
    } else if (typeof newValue === 'object' && newValue !== null) {
      formData.value = { ...toRaw(newValue) }
      if (newValue.image_path) {
        imgPreview.value = `/storage/${newValue.image_path}`
      }
    } else {
      formData.value = { ...formDataDefault }
      imgPreview.value = '/images/item-image.png'
    }
  },
  { immediate: true },
)

// Get user ID
watchEffect(() => {
  if (authStore.userData?.id) {
    formData.value.user_id = authStore.userData.id
  }
})

// Sync image file with form
watchEffect(() => {
  formData.value.image_path = selectedFile.value
})

// Preview
const onPreview = async (event) => {
  const { fileObject, fileUrl } = await fileExtract(event)
  formData.value.image_path = fileObject
  imgPreview.value = fileUrl
}

const onPreviewReset = () => {
  imgPreview.value = '/images/item-image.png'
  selectedFile.value = null
}

// Submit
const onSubmit = async () => {
  isLoading.value = true

  const form = new FormData()

  for (const key in formData.value) {
    const value = formData.value[key]
    form.append(key, value)
  }

  console.log('⬇ Submitting FormData:')
  for (let [k, v] of form.entries()) {
    console.log(`${k}:`, v)
  }

  //Update or Add item
  const { data, error } = isUpdate.value
    ? await itemStore.updateItem(form)
    : await itemStore.addItem(form)

  if (data) {
    await itemStore.getItems()
    onFormReset()
  } else if (error) {
    alert(error.message || 'Something went wrong')
  }

  isLoading.value = false
}

// Trigger validation
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Reset
function onFormReset() {
  refVForm.value?.reset()
  formData.value = { ...formDataDefault, user_id: authStore.userData?.id }
  selectedFile.value = null

  setTimeout(() => {
    emit('update:modelValue', false) // close dialog
  }, 100)
}
</script>

<template>
  <v-dialog
    :width="mdAndDown ? 500 : 800"
    :model-value="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    persistent
  >
    <v-card class="pa-3">
      <v-card-title>{{ isUpdate ? 'Update Item' : 'Add Item' }}</v-card-title>

      <v-form ref="refVForm" fast-fail @submit.prevent="onFormSubmit">
        <v-text-field label="Name" v-model="formData.item_name" />
        <div class="d-flex ga-5">
          <v-text-field type="number" label="Price" v-model="formData.price" />
          <v-text-field type="number" label="Quantity" v-model="formData.quantity" />
        </div>
        <v-textarea label="Description" v-model="formData.description" clearable />

        <v-btn block color="blue-darken-3" type="submit" :loading="isLoading">
          {{ isUpdate ? 'Update' : 'Add' }}
        </v-btn>

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
