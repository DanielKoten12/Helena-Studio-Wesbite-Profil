<template>
  <section v-if="variants && variants.length > 0" class="price-section">
    <div class="container">
      <div class="head">
        <div class="chip">
          <Sparkles :size="14" />
          <span>PILIHAN PAKET</span>
        </div>
        <h2>Daftar Harga {{ treatmentTitle }}</h2>
        <p>Pilih paket yang sesuai kebutuhan Anda. Semua harga sudah termasuk konsultasi awal.</p>
      </div>

      <div class="cards">
        <article
          v-for="(variant, index) in normalizedVariants"
          :key="variant.id || index"
          class="card"
          :class="{ popular: variant.is_popular }"
        >
          <div class="image-wrap">
            <img :src="variant.image_url" :alt="variant.name" />
            <span v-if="variant.is_popular" class="popular-tag">TERPOPULER</span>
          </div>

          <div class="body">
            <h3>{{ variant.name }}</h3>
            <p class="desc">{{ variant.description }}</p>

            <div class="meta">
              <Clock3 :size="14" />
              <span>{{ variant.duration || '-' }}</span>
            </div>

            <div class="price-wrap">
              <small>Harga</small>
              <strong>{{ variant.price || '-' }}</strong>
            </div>

            <button class="cta" @click="emit('book-now')">Pesan Paket Ini</button>
          </div>
        </article>
      </div>

      <p class="note">* Harga dapat berubah sewaktu-waktu. Hubungi kami untuk promo terbaru.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Clock3, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  variants: {
    type: Array,
    default: () => []
  },
  treatmentTitle: {
    type: String,
    default: ''
  },
  defaultImage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['book-now'])

const normalizedVariants = computed(() =>
  (props.variants || []).map((item) => ({
    ...item,
    image_url: item.image_url || props.defaultImage || 'https://via.placeholder.com/800x1000?text=Helena+Studio'
  }))
)
</script>

<style scoped>
.price-section {
  background: linear-gradient(135deg, #f4f1fa 0%, #f8f7fb 60%, #f2edf9 100%);
  padding: 3.6rem 1rem;
}

.container {
  max-width: 1152px;
  margin: 0 auto;
}

.head {
  text-align: center;
  margin-bottom: 2rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(84, 71, 113, 0.12);
  color: #544771;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.36rem 0.8rem;
}

.head h2 {
  margin-top: 1rem;
  color: #1f1831;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.5vw, 3.2rem);
}

.head p {
  max-width: 640px;
  margin: 0.65rem auto 0;
  color: #5b6170;
  font-size: 1.04rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.card {
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1.4px solid #ede9f5;
  box-shadow: 0 14px 30px rgba(61, 49, 90, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 36px rgba(61, 49, 90, 0.16);
  border-color: #c4b9db;
}

.card.popular {
  border-color: #756298;
}

.image-wrap {
  position: relative;
  aspect-ratio: 4 / 5;
  background: #efeaf8;
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popular-tag {
  position: absolute;
  right: 0.8rem;
  top: 0.8rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: #544771;
  border-radius: 999px;
  padding: 0.3rem 0.6rem;
}

.body {
  padding: 1rem 1rem 1.1rem;
}

.body h3 {
  font-family: 'Playfair Display', serif;
  color: #241a3a;
  font-size: 1.75rem;
  line-height: 1.15;
}

.desc {
  color: #646d7b;
  margin-top: 0.5rem;
  min-height: 48px;
}

.meta {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #7a7f8b;
}

.price-wrap {
  margin-top: 0.7rem;
  border-top: 1px solid #eee8f7;
  padding-top: 0.6rem;
}

.price-wrap small {
  color: #8b8698;
}

.price-wrap strong {
  display: block;
  color: #2b1f45;
  font-family: 'Playfair Display', serif;
  font-size: 1.95rem;
}

.cta {
  margin-top: 0.9rem;
  border: 1px solid #79669b;
  background: #fff;
  color: #544771;
  width: 100%;
  height: 42px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cta:hover {
  background: #544771;
  color: #fff;
}

.card.popular .cta {
  background: #544771;
  color: #fff;
}

.card.popular .cta:hover {
  background: #3f3556;
}

.note {
  text-align: center;
  margin-top: 1rem;
  color: #8f95a1;
  font-size: 0.78rem;
}
</style>
