import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Pages
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Bookings from '@/pages/Bookings.vue'
import Treatments from '@/pages/Treatments.vue'
import Promos from '@/pages/Promos.vue'
import Testimonials from '@/pages/Testimonials.vue'
import Certificates from '@/pages/Certificates.vue'
import Images from '@/pages/Images.vue'
import Settings from '@/pages/Settings.vue'

const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      }
    ]
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'bookings',
        name: 'Bookings',
        component: Bookings
      },
      {
        path: 'treatments',
        name: 'Treatments',
        component: Treatments
      },
      {
        path: 'promos',
        name: 'Promos',
        component: Promos
      },
      {
        path: 'testimonials',
        name: 'Testimonials',
        component: Testimonials
      },
      {
        path: 'certificates',
        name: 'Certificates',
        component: Certificates
      },
      {
        path: 'images',
        name: 'Images',
        component: Images
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Refresh session on navigation
  if (authStore.checkAuth()) {
    authStore.refreshSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
