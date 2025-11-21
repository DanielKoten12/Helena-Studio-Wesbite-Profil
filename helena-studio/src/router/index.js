import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/treatments',
      name: 'treatments',
      component: () => import('../components/Treatments.vue')
    },
    {
      path: '/treatments/haircut',
      name: 'haircut',
      component: () => import('../components/HaircutTreatment.vue')
    },
    {
      path: '/treatments/hair-coloring',
      name: 'hair-coloring',
      component: () => import('../components/HairColoringTreatment.vue')
    },
    {
      path: '/treatments/hair-keratin',
      name: 'hair-keratin',
      component: () => import('../components/HairKeratinTreatment.vue')
    },
    {
      path: '/treatments/hairdo',
      name: 'hairdo',
      component: () => import('../components/HairdoTreatment.vue')
    },
    {
      path: '/treatments/makeup',
      name: 'makeup',
      component: () => import('../components/MakeupTreatment.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../components/About.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../components/Contact.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
