<template>
  <section class="bg-white py-12 md:py-16 lg:py-20 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 md:mb-16">
        <h2 
          class="font-normal mb-4"
          style="font-family: 'Playfair Display', serif; color: #544771; font-size: clamp(32px, 5vw, 48px); line-height: 1.2"
        >
          Certifications & Training
        </h2>
        <p 
          class="text-[#4a5565] max-w-[912px] mx-auto"
          style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px); line-height: 1.625"
        >
          Pembelajaran berkelanjutan dan pengembangan profesional menjadi kunci bagi kami untuk selalu memberikan layanan terbaik kepada setiap klien. Berikut beberapa sertifikasi dan pelatihan yang menjadi bukti keahlian tim Helena Studio dalam menghadirkan hasil terbaik di bidang kecantikan dan tata rambut.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#544771]"></div>
        <p class="mt-4 text-[#4a5565]">Memuat sertifikat...</p>
      </div>

      <!-- Certifications Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        <div 
          v-for="(cert, index) in certificates"
          :key="cert.id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 150 } }"
          class="bg-white rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.15),0px_10px_10px_-5px_rgba(0,0,0,0.04)] p-4 md:p-6 lg:p-8 space-y-4 transition-shadow duration-300 cursor-pointer"
        >
          <!-- Certificate Image -->
          <div class="h-[200px] md:h-[260px] lg:h-[321px] overflow-hidden rounded-2xl">
            <img 
              :src="cert.image_url" 
              :alt="cert.institution_name" 
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Certificate Info -->
          <div class="flex gap-3 md:gap-4 items-start">
            <!-- Icon -->
            <div class="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[#fff5f7] rounded-full flex items-center justify-center">
              <Award :size="28" class="text-[#544771]" />
            </div>

            <!-- Text Info -->
            <div class="space-y-1 md:space-y-2">
              <h3 
                class="font-normal text-[#544771]"
                style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 1.8vw, 20px); line-height: 1.4"
              >
                {{ cert.institution_name }}
              </h3>
              <p 
                class="text-[#4a5565]"
                style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.3vw, 16px); line-height: 1.5"
              >
                {{ cert.location }}
              </p>
              <p 
                class="text-[#6a7282]"
                style="font-family: 'Poppins', sans-serif; font-size: clamp(13px, 1.2vw, 14px); line-height: 1.4"
              >
                Certified {{ cert.year }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && certificates.length === 0" class="col-span-full text-center py-12">
          <p class="text-[#4a5565]">Belum ada sertifikat yang ditampilkan</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Award } from 'lucide-vue-next'
import { dataService } from '@/composables/dataService'

const loading = ref(true)
const certificates = ref([])

onMounted(async () => {
  try {
    const data = await dataService.getCertificates()
    certificates.value = data
  } catch (error) {
    console.error('Error loading certificates:', error)
  } finally {
    loading.value = false
  }
})
</script>