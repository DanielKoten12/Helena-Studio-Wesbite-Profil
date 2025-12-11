File yang di buat 
CV.vue
CVAtas.vue
CVBawah.vue

Route (Index.js)
{
      path: '/CV',
      name: 'CV',
      component: () => import('../components/CV.vue')
}