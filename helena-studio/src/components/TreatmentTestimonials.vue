<template>
  <section 
    class="py-12 md:py-16 lg:py-20"
    style="background-color: rgba(183, 110, 121, 0.44)"
  >
    <div class="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
      <h2 
        class="text-center mb-12 lg:mb-16 leading-12"
        style="font-family: 'Playfair Display', serif; color: #4a5565; font-size: clamp(32px, 4vw, 48px)"
      >
        Customer Testimonials
      </h2>

      <!-- Carousel Container -->
      <div class="relative">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-out gap-6 lg:gap-8"
            :style="{ 
              transform: `translateX(calc(-${currentIndex * (100 / cardsPerView)}% - ${currentIndex * (cardsPerView === 1 ? 0 : cardsPerView === 2 ? 24 : 32)}px))`
            }"
          >
            <div
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              class="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-4 shrink-0"
              :style="{ 
                width: cardsPerView === 1 
                  ? '100%' 
                  : cardsPerView === 2 
                    ? 'calc(50% - 12px)' 
                    : 'calc(33.333% - 21.33px)'
              }"
            >
              <!-- Name and Rating -->
              <div class="flex items-center justify-between">
                <p
                  class="leading-6 text-lg font-semibold"
                  style="font-family: 'Playfair Display', serif; color: #4a5565"
                >
                  {{ testimonial.name }}
                </p>
                <div class="flex gap-1">
                  <svg 
                    v-for="i in Math.floor(testimonial.rating)" 
                    :key="'full-' + i"
                    class="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 16 16"
                  >
                    <path 
                      d="M8 1.33301L10.06 5.50634L14.6667 6.17967L11.3333 9.42634L12.12 14.013L8 11.8463L3.88 14.013L4.66667 9.42634L1.33333 6.17967L5.94 5.50634L8 1.33301Z" 
                      fill="#B76E79" 
                      stroke="#B76E79" 
                      stroke-width="1.33333" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                    />
                  </svg>
                  <svg 
                    v-if="testimonial.rating % 1 !== 0"
                    class="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 16 16"
                  >
                    <path 
                      d="M8 1.33301L10.06 5.50634L14.6667 6.17967L11.3333 9.42634L12.12 14.013L8 11.8463L3.88 14.013L4.66667 9.42634L1.33333 6.17967L5.94 5.50634L8 1.33301Z" 
                      fill="#B76E79" 
                      stroke="#B76E79" 
                      stroke-width="1.33333" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      opacity="0.5" 
                    />
                  </svg>
                </div>
              </div>

              <!-- Image -->
              <div class="rounded-lg overflow-hidden">
                <img
                  :src="testimonial.image"
                  :alt="testimonial.name"
                  class="w-full h-auto object-cover"
                />
              </div>

              <!-- Testimonial Text -->
              <p class="text-[#4a5565] text-sm md:text-base leading-6 text-center">
                "{{ testimonial.text }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <!-- Previous Button -->
          <button
            @click="handlePrev"
            class="bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-[#b76e79] hover:text-white transition-all"
            aria-label="Previous testimonials"
          >
            <ChevronLeft class="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <!-- Pagination Dots -->
          <div class="flex justify-center gap-2">
            <button
              v-for="index in maxIndex + 1"
              :key="index"
              @click="currentIndex = index - 1"
              class="rounded-full transition-all"
              :class="[
                index - 1 === currentIndex 
                  ? 'bg-[#b76e79] w-8 h-2' 
                  : 'bg-[#b76e79] opacity-30 hover:opacity-60 w-2 h-2'
              ]"
              :aria-label="`Go to slide ${index}`"
            />
          </div>

          <!-- Next Button -->
          <button
            @click="handleNext"
            class="bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-[#b76e79] hover:text-white transition-all"
            aria-label="Next testimonials"
          >
            <ChevronRight class="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  testimonials: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)
const cardsPerView = ref(3)

// Maximum index (bergeser 1 per 1)
const maxIndex = computed(() => Math.max(0, props.testimonials.length - cardsPerView.value))

const updateCardsPerView = () => {
  if (window.innerWidth < 768) {
    cardsPerView.value = 1
  } else if (window.innerWidth < 1024) {
    cardsPerView.value = 2
  } else {
    cardsPerView.value = 3
  }
  // Reset index jika melebihi max setelah resize
  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value
  }
}

const handlePrev = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = maxIndex.value
  } else {
    currentIndex.value--
  }
}

const handleNext = () => {
  if (currentIndex.value >= maxIndex.value) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
}

onMounted(() => {
  updateCardsPerView()
  window.addEventListener('resize', updateCardsPerView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCardsPerView)
})
</script>
