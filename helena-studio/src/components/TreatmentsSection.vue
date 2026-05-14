<template>
  <section id="treatments" class="py-12 md:py-16 lg:py-20 bg-white">
    <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <h2 
        class="text-center mb-12 lg:mb-16 leading-12"
        style="font-family: 'Playfair Display', serif; color: #544771; font-size: clamp(32px, 4vw, 48px)"
      >
        Our Treatments
      </h2>

      <!-- Treatment Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(item, index) in cards"
          :key="item.slug"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 120 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="item.image" 
              :alt="item.title" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #544771"
            >
              {{ item.title }}
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              {{ item.description }}
            </p>
            <p 
              class="text-2xl font-semibold"
              style="color: #544771; font-family: 'Poppins', sans-serif"
            >
              {{ item.price }}
            </p>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-12">
        <button 
          @click="handleViewAll"
          class="bg-[#544771] h-10 rounded-full px-10 text-white hover:opacity-90 transition-opacity"
          style="font-family: 'Poppins', sans-serif; font-weight: 500"
        >
          Lihat Semua Treatment
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { treatmentContentService } from '@/composables/treatmentContentService'

const router = useRouter()
const cards = ref([])

defineProps({
  onViewAllTreatments: Function
})

const loadCards = async () => {
  const rows = await treatmentContentService.getTreatments()
  cards.value = rows.slice(0, 3).map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.short_description,
    price: item.starting_price_label || '-',
    image: item.banner_image_url
  }))
}

const handleViewAll = () => {
  router.push('/treatments')
}

onMounted(() => {
  loadCards()
})
</script>
