import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import axios from 'axios'

// axios.defaults.baseURL = 'http://crudpractice.test'
// axios.defaults.withCredentials = true

// const token = localStorage.getItem('token')
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
// }

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
