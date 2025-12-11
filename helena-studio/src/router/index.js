import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

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
      component: () => import('../pages/Treatments.vue')
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
      component: () => import('../pages/About.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../pages/Contact.vue')
    },
    {
      path: '/hairstyle-ai',
      name: 'hairstyle-ai',
      component: () => import('../components/HairstyleAI.vue')
    },

    {
      path: '/CV',
      name: 'CV',
      component: () => import('../components/CV.vue')
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
