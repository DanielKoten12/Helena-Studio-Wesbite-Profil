<template>
  <section id="treatments" class="py-12 md:py-16 lg:py-20 bg-white">
    <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <h2 
        class="text-center mb-12 lg:mb-16 leading-12"
        style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(32px, 4vw, 48px)"
      >
        Our Treatments
      </h2>

      <!-- Treatment Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Haircut Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 0 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="haircutImage" 
              alt="Haircut" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #B76E79"
            >
              Haircut
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              Potongan rambut profesional yang disesuaikan dengan bentuk wajah dan gaya pribadi Anda.
            </p>
            <p 
              class="text-2xl font-semibold"
              style="color: #B76E79; font-family: 'Poppins', sans-serif"
            >
              Rp80.000
            </p>
          </div>
        </div>

        <!-- Hair Coloring Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="coloringImage" 
              alt="Hair Coloring" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #B76E79"
            >
              Hair Coloring
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              Ubah tampilan Anda dengan teknik pewarnaan modern dan hasil yang lembut dan alami.
            </p>
            <p 
              class="text-2xl font-semibold"
              style="color: #B76E79; font-family: 'Poppins', sans-serif"
            >
              Rp150.000
            </p>
          </div>
        </div>

        <!-- Hair Keratin Treatment Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="keratinImage" 
              alt="Hair Keratin Treatment" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #B76E79"
            >
              Hair Keratin Treatment
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              Perawatan untuk mengembalikan kilau rambut agar tetap sehat, halus, dan mudah diatur.
            </p>
            <p 
              class="text-2xl font-semibold"
              style="color: #B76E79; font-family: 'Poppins', sans-serif"
            >
              Rp120.000
            </p>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-12">
        <button 
          @click="handleViewAll"
          class="bg-[#b76e79] h-10 rounded-full px-10 text-white hover:opacity-90 transition-opacity"
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
import haircutImage from '@/assets/HaircutTreatment.png'
import coloringImage from '@/assets/ColoringTreatment.png'
import keratinImage from '@/assets/KeratinTreament.png'

const router = useRouter()

defineProps({
  onViewAllTreatments: Function
})

const handleViewAll = () => {
  router.push('/treatments')
}
</script>
