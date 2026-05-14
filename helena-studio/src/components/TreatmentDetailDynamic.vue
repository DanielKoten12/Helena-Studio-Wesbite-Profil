<template>
  <div v-if="loading" class="loading-wrap">
    <div class="spinner"></div>
  </div>

  <div v-else-if="!treatment" class="loading-wrap">
    <p>Data treatment tidak ditemukan.</p>
  </div>

  <div v-else class="bg-white">
    <section class="hero-wrap">
      <div class="hero-container">
        <div class="hero-grid">
          <div
            v-motion
            :initial="{ opacity: 0, x: -40 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 550 } }"
            class="image-box"
          >
            <img :src="treatment.banner_image_url" :alt="treatment.title" class="hero-image" />
          </div>

          <div
            v-motion
            :initial="{ opacity: 0, x: 40 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 550, delay: 140 } }"
            class="hero-copy"
          >
            <h1>{{ treatment.title }}</h1>
            <p>{{ treatment.description || treatment.short_description }}</p>

            <div class="meta-row">
              <div class="meta-chip">
                <Clock3 :size="18" />
                <span>{{ treatment.duration_label || '-' }}</span>
              </div>
              <div class="meta-divider"></div>
              <p class="price-label">{{ treatment.starting_price_label || '-' }}</p>
            </div>

            <button class="book-btn" @click="showBookingModal = true">Pesan Sekarang</button>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits-wrap">
      <div class="benefits-container">
        <h2
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          Manfaat Treatment
        </h2>

        <div class="benefits-grid">
          <div
            v-for="(benefit, index) in treatment.benefits"
            :key="`benefit-${index}`"
            v-motion
            :initial="{ opacity: 0, y: 18 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 350, delay: 90 * index } }"
            class="benefit-item"
          >
            <div class="idx">{{ index + 1 }}</div>
            <p>{{ benefit }}</p>
          </div>
        </div>
      </div>
    </section>

    <PriceVariantsBox
      :variants="treatment.price_variants"
      :treatment-title="treatment.title"
      :default-image="treatment.banner_image_url"
      @book-now="showBookingModal = true"
    />

    <TreatmentTestimonials :testimonials="testimonials" />
    <PesanSekarang v-model:open="showBookingModal" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Clock3 } from 'lucide-vue-next'
import PesanSekarang from './PesanSekarang.vue'
import PriceVariantsBox from './PriceVariantsBox.vue'
import TreatmentTestimonials from './TreatmentTestimonials.vue'
import { dataService } from '@/composables/dataService'
import { treatmentContentService } from '@/composables/treatmentContentService'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const treatment = ref(null)
const testimonials = ref([])
const showBookingModal = ref(false)

const testimonialNameMap = {
  haircut: 'Haircut',
  'hair-coloring': 'Hair Coloring',
  'hair-keratin': 'Keratin',
  hairdo: 'Hairdo',
  makeup: 'Makeup'
}

const loadTreatmentDetail = async () => {
  loading.value = true
  try {
    const data = await treatmentContentService.getTreatmentBySlug(props.slug)
    treatment.value = data

    const treatmentName = testimonialNameMap[props.slug]
    if (treatmentName) {
      const rows = await dataService.getTestimonialsByTreatment(treatmentName)
      testimonials.value = rows.map((item) => ({
        id: item.id,
        name: item.customer_name,
        rating: item.rating,
        image: item.image_url || 'https://via.placeholder.com/400x300?text=Customer',
        text: item.comment || item.content || ''
      }))
    } else {
      testimonials.value = []
    }
  } catch (error) {
    console.error('Error loading treatment detail:', error)
    treatment.value = null
    testimonials.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTreatmentDetail()
})
</script>

<style scoped>
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: #697182;
}

.hero-wrap {
  background: #f7f7f7;
  padding: 3rem 1rem;
}

.hero-container,
.benefits-container {
  max-width: 1152px;
  margin: 0 auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 2.4rem;
  align-items: center;
}

.image-box {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 44px rgba(31, 24, 49, 0.22);
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.hero-copy h1 {
  font-family: 'Playfair Display', serif;
  color: #544771;
  font-size: clamp(2.2rem, 4.6vw, 3.8rem);
  line-height: 1.08;
}

.hero-copy p {
  color: #4a5565;
  font-size: clamp(1rem, 1.2vw, 1.16rem);
  line-height: 1.7;
  margin-top: 1rem;
}

.meta-row {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #544771;
}

.meta-divider {
  width: 1px;
  height: 26px;
  background: rgba(84, 71, 113, 0.28);
}

.price-label {
  color: #544771;
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
}

.book-btn {
  margin-top: 1rem;
  background: #544771;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.book-btn:hover {
  background: #3f3556;
}

.benefits-wrap {
  background: #fff;
  padding: 3.2rem 1rem;
}

.benefits-wrap h2 {
  text-align: center;
  color: #544771;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
}

.benefits-grid {
  margin: 1.4rem auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  max-width: 930px;
}

.benefit-item {
  background: #f6f4fa;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
}

.idx {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #544771;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.benefit-item p {
  color: #4a5565;
  line-height: 1.55;
}

@media (max-width: 960px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
