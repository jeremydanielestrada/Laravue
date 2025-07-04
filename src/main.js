import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { useAuthStore } from './stores/authStore'

import App from './App.vue'
import router from './router'
const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.InitializeAuth()

//Navigation guard
router.beforeEach(async (to) => {
  console.log('Navigation guard triggered for:', to.name)
  console.log('Current auth state:', {
    hasToken: !!authStore.token,
    hasUserData: !!authStore.userData,
    isLoggedIn: authStore.isLoggedIn,
  })

  // If we have a token but no user data, try to fetch user data
  if (authStore.token && !authStore.userData) {
    console.log('Have token but no user data, fetching user info...')
    await authStore.getUserInformation()
  }

  // If not logged in and trying to access protected route
  if (!authStore.isLoggedIn && to.meta.requiresAuth) {
    console.log('Redirecting to login - not authenticated')
    return { name: 'login' }
  }

  // If logged in and trying to access login/register
  if (authStore.isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    console.log('Redirecting to home - already authenticated')
    return { name: 'home' }
  }

  // Check admin permissions
  if (to.meta.requiresAdmin) {
    const role = authStore.userData?.role
    const isAdmin = role === 'Admin'

    if (!isAdmin) {
      console.log('Redirecting to forbidden - not admin')
      return { name: 'forbidden' }
    }
  }

  console.log('Navigation allowed')
  // Everything is okay
  return true
})
app.use(vuetify)

app.mount('#app')
