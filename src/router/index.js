import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import InventoryView from '@/views/InventoryView.vue'
import AccountSettingsView from '@/views/AccountSettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
    },
    {
      path: '/account/settings',
      name: 'account-settings',
      component: AccountSettingsView,
    },
  ],
})

export default router
