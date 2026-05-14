<template>
  <section class="bg-white py-12 md:py-16 lg:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <!-- Treatment Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div 
          v-for="treatment in treatmentsData"
          :key="treatment.id"
          class="bg-white rounded-2xl overflow-hidden shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-shadow"
        >
          <!-- Image -->
          <div class="h-[227.55px] overflow-hidden">
            <img 
              :src="treatment.image" 
              :alt="treatment.title" 
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Content -->
          <div class="p-6 space-y-3">
            <!-- Title -->
            <h3 
              class="font-normal leading-8 text-[24px] text-neutral-950"
              style="font-family: 'Playfair Display', serif"
            >
              {{ treatment.title }}
            </h3>

            <!-- Description -->
            <p 
              class="leading-6 text-[#4a5565] text-[16px] min-h-[78px]"
              style="font-family: 'Poppins', sans-serif"
            >
              {{ treatment.description }}
            </p>

            <!-- Price and Button -->
            <div class="flex items-center justify-between pt-3">
              <p 
                class="font-normal leading-8 text-[#544771] text-[24px]"
                style="font-family: 'Playfair Display', serif"
              >
                {{ treatment.price }}
              </p>
              
              <router-link 
                :to="treatment.link"
                class="bg-white min-w-[118px] h-9 rounded-lg px-[16.8px] py-[8.8px] flex items-center justify-center text-[#544771] border-[0.8px] border-[#544771] border-solid hover:bg-[#544771] hover:text-white transition-colors"
              >
                <span 
                  class="font-medium leading-5 text-[14px] whitespace-nowrap"
                  style="font-family: 'Poppins', sans-serif"
                >
                  View Details
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" style="display: flex; justify-content: center; margin-top: 1rem; color: #6b7280;">
        Memuat treatment...
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { treatmentContentService } from '@/composables/treatmentContentService'

const loading = ref(false)
const treatmentsData = ref([])

const loadTreatments = async () => {
  loading.value = true
  try {
    const rows = await treatmentContentService.getTreatments()
    treatmentsData.value = rows.map((item) => ({
      id: item.slug,
      title: item.title,
      description: item.short_description,
      price: item.starting_price_label || '-',
      image: item.banner_image_url,
      link: `/treatments/${item.slug}`
    }))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTreatments()
})
</script>
