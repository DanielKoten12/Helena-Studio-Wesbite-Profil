<template>
  <section id="treatments" class="py-12 md:py-16 lg:py-20 bg-white">
    <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <h2 
        class="text-center mb-12 lg:mb-16 leading-12"
        style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(32px, 4vw, 48px)"
      >
        Pengalaman Saya
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 0 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="JaringanImage" 
              alt="Haircut" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #B76E79"
            >
              Jaringan
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              Mengkonfigurasi Router, Membuat Jaringan Lan 
            </p>
          </div>
        </div>

        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="PSImage" 
              alt="Hair Coloring" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #B76E79"
            >
              Public Speaking
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              Menjadi MC, Moderator, dan Pemateri
            </p>

          </div>
        </div>


        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="overflow-hidden h-64">
            <img 
              :src="WebImage" 
              alt="Hair Keratin Treatment" 
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h3 
              class="text-2xl mb-3"
              style="font-family: 'Playfair Display', serif; color: #B76E79"
            >
              Website Development
            </h3>
            <p class="text-gray-600 mb-4 text-sm">
              Membuat Website untuk kebutuhan komersil
            </p>
    
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import JaringanImage from '@/assets/Jaringan.png'
import PSImage from '@/assets/PublikSpeaking.png'
import WebImage from '@/assets/WebProto.png'

const router = useRouter()

defineProps({
  onViewAllTreatments: Function
})

const handleViewAll = () => {
  router.push('/treatments')
}
</script>
