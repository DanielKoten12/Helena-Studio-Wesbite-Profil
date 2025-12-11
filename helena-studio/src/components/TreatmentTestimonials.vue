<template>
  <section 
    class="py-12 md:py-16 lg:py-20"
    style="background-color: rgba(183, 110, 121, 0.44)"
  >
    <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <h2 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        class="text-center mb-12 lg:mb-16 leading-12"
        style="font-family: 'Playfair Display', serif; color: #4a5565; font-size: clamp(32px, 4vw, 48px)"
      >
        Customer Testimonials
      </h2>

      <!-- Carousel Container -->
      <div class="relative max-w-[1440px] mx-auto">
        <div class="overflow-hidden mx-auto" :style="{ maxWidth: containerMaxWidth }">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ 
              transform: `translateX(${translateValue}px)`,
              gap: '24px',
              paddingLeft: centerPadding,
              paddingRight: centerPadding
            }"
          >
            <div
              v-for="(testimonial, index) in displayTestimonials"
              :key="`${testimonial.id}-${index}`"
              class="bg-white rounded-2xl p-6 md:p-8 shadow-lg shrink-0 flex flex-col"
              :style="{ 
                width: cardWidth + 'px',
                minHeight: '520px'
              }"
            >
              <div class="space-y-4 flex flex-col h-full">
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
              <div class="rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style="min-height: 250px">
                <img
                  :src="testimonial.image"
                  :alt="testimonial.name"
                  class="w-full h-full object-contain"
                />
              </div>

                <!-- Testimonial Text -->
                <p class="text-[#4a5565] text-sm md:text-base leading-6 text-center">
                  "{{ testimonial.text }}"
                </p>
              </div>
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
              v-for="(testimonial, index) in testimonials"
              :key="index"
              @click="currentIndex = index"
              class="rounded-full transition-all"
              :class="[
                index === currentIndex 
                  ? 'bg-[#b76e79] w-8 h-2' 
                  : 'bg-[#b76e79] opacity-30 hover:opacity-60 w-2 h-2'
              ]"
              :aria-label="`Go to slide ${index + 1}`"
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
const isTransitioning = ref(false)

// Triple testimonials for seamless infinite loop
const displayTestimonials = computed(() => {
  const items = props.testimonials
  return [...items, ...items, ...items]
})

// Fixed card widths - larger for mobile and tablet
const cardWidth = computed(() => {
  if (cardsPerView.value === 1) {
    // Mobile: larger card, more breathing room
    return window.innerWidth < 400 ? 280 : 340
  }
  if (cardsPerView.value === 2) {
    // Tablet: fill available space with 2 cards
    return Math.min(380, (window.innerWidth - 120) / 2 - 12)
  }
  return 300 // Desktop: 4 cards
})

// Container max width to prevent extra cards from showing
const containerMaxWidth = computed(() => {
  const gap = 24
  if (cardsPerView.value === 1) return `${cardWidth.value}px`
  if (cardsPerView.value === 2) return `${(cardWidth.value * 2) + gap}px`
  return `${(cardWidth.value * 4) + (gap * 3)}px`
})

// Center padding to center the carousel
const centerPadding = computed(() => {
  return '0px'
})

// Calculate translate value for smooth sliding
const translateValue = computed(() => {
  // Start from middle set to enable infinite loop
  const offsetIndex = props.testimonials.length + currentIndex.value
  const gap = 24
  
  // Calculate pixels to translate
  return -(offsetIndex * (cardWidth.value + gap))
})

const updateCardsPerView = () => {
  if (window.innerWidth < 768) {
    cardsPerView.value = 1
  } else if (window.innerWidth < 1280) {
    cardsPerView.value = 2
  } else {
    cardsPerView.value = 4
  }
}

const handlePrev = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  currentIndex.value--
  
  // Seamless loop backward
  if (currentIndex.value < 0) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = props.testimonials.length - 1
    }, 500)
  } else {
    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
  }
}

const handleNext = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  currentIndex.value++
  
  // Seamless loop forward
  if (currentIndex.value >= props.testimonials.length) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = 0
    }, 500)
  } else {
    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
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
