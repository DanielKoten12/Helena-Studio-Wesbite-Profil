<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Konten Treatment</h1>
      <div class="topbar-actions">
        <button class="btn btn-primary" @click="createTreatment" :disabled="saving">
          + Tambah Treatment
        </button>
      </div>
    </div>

    <div class="treatment-shell">
      <aside class="treatment-sidebar card">
        <p class="sidebar-label">TREATMENT</p>

        <div v-if="loading" class="center-loading">
          <div class="spinner"></div>
        </div>

        <button
          v-for="item in treatments"
          v-else
          :key="item.id"
          class="sidebar-item"
          :class="{ active: selectedTreatmentId === item.id }"
          @click="selectTreatment(item.id)"
        >
          <div class="sidebar-dot"></div>
          <div class="sidebar-copy">
            <strong>{{ item.title || 'Untitled Treatment' }}</strong>
            <small>{{ (item.price_variants || []).length }} paket • {{ (item.benefits || []).length }} manfaat</small>
          </div>
          <ChevronRight :size="16" />
        </button>
      </aside>

      <section class="treatment-main">
        <div class="stats-grid">
          <article class="stat-card card">
            <div class="stat-icon bg-soft"><ListChecks :size="16" /></div>
            <div>
              <strong>{{ currentBenefitsCount }}</strong>
              <span>Manfaat</span>
            </div>
          </article>
          <article class="stat-card card">
            <div class="stat-icon bg-soft"><DollarSign :size="16" /></div>
            <div>
              <strong>{{ currentVariantsCount }}</strong>
              <span>Paket</span>
            </div>
          </article>
          <article class="stat-card card">
            <div class="stat-icon bg-soft"><Star :size="16" /></div>
            <div>
              <strong>{{ currentPopularCount }}</strong>
              <span>Terpopuler</span>
            </div>
          </article>
          <article class="stat-card card">
            <div class="stat-icon bg-soft"><ImageIcon :size="16" /></div>
            <div>
              <strong>{{ currentImagesCount }}</strong>
              <span>Foto Paket</span>
            </div>
          </article>
        </div>

        <div v-if="!draft" class="card empty-editor">
          Pilih treatment di sisi kiri atau klik "Tambah Treatment".
        </div>

        <div v-else class="card editor-card">
          <div class="tabs">
            <button class="tab-btn" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">
              <FileText :size="14" />
              Info Utama
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'benefits' }" @click="activeTab = 'benefits'">
              <ListChecks :size="14" />
              Manfaat
              <span class="count-pill">{{ currentBenefitsCount }}</span>
            </button>
            <button class="tab-btn" :class="{ active: activeTab === 'pricing' }" @click="activeTab = 'pricing'">
              <DollarSign :size="14" />
              Daftar Harga
              <span class="count-pill">{{ currentVariantsCount }}</span>
            </button>
          </div>

          <div class="editor-body">
            <div v-if="activeTab === 'info'" class="stack-lg">
              <div class="grid grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label">Judul Treatment *</label>
                  <input v-model="draft.title" type="text" class="form-input" placeholder="Contoh: Haircut" />
                </div>
                <div class="form-group">
                  <label class="form-label">Slug URL *</label>
                  <input v-model="draft.slug" type="text" class="form-input" placeholder="contoh: haircut" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Deskripsi Singkat (kartu list treatment)</label>
                <textarea v-model="draft.short_description" class="form-textarea" rows="3" placeholder="Ringkasan yang tampil di halaman daftar treatment"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Deskripsi Lengkap (halaman detail)</label>
                <textarea v-model="draft.description" class="form-textarea" rows="4" placeholder="Penjelasan lengkap treatment"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label">Durasi Label</label>
                  <input v-model="draft.duration_label" type="text" class="form-input" placeholder="Contoh: 30-60 menit" />
                </div>
                <div class="form-group">
                  <label class="form-label">Harga Mulai Label</label>
                  <input v-model="draft.starting_price_label" type="text" class="form-input" placeholder="Contoh: Mulai Rp 65.000" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Foto Banner</label>
                <input v-model="draft.banner_image_url" type="text" class="form-input" placeholder="https://..." />
                <div class="upload-row">
                  <input type="file" accept="image/*" @change="uploadBanner" :disabled="uploadingBanner" />
                  <span v-if="uploadingBanner" class="hint">Mengupload banner...</span>
                </div>
                <img v-if="draft.banner_image_url" :src="draft.banner_image_url" alt="Banner" class="banner-preview" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label">Urutan Tampil</label>
                  <input v-model.number="draft.sort_order" type="number" class="form-input" min="0" />
                </div>
                <div class="form-group toggle-wrap">
                  <label class="toggle-label">
                    <input v-model="draft.is_active" type="checkbox" />
                    Aktifkan treatment ini
                  </label>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'benefits'" class="stack-lg">
              <div class="inline-head">
                <p>{{ currentBenefitsCount }} manfaat terdaftar</p>
                <button class="btn btn-outline btn-sm" @click="addBenefit">+ Tambah Manfaat</button>
              </div>

              <div v-for="(benefit, index) in draft.benefits" :key="`benefit-${index}`" class="benefit-row">
                <span class="idx-chip">{{ index + 1 }}</span>
                <input
                  v-model="draft.benefits[index]"
                  type="text"
                  class="form-input"
                  placeholder="Tulis manfaat treatment"
                />
                <button class="icon-btn" @click="removeBenefit(index)">×</button>
              </div>
            </div>

            <div v-if="activeTab === 'pricing'" class="stack-lg">
              <div class="inline-head">
                <div>
                  <h3 style="font-size: 1rem;">Daftar Paket Harga</h3>
                  <p class="hint">Setiap paket dapat berisi foto, harga, durasi, dan deskripsi.</p>
                </div>
                <button class="btn btn-outline btn-sm" @click="addVariant">+ Tambah Paket</button>
              </div>

              <article
                v-for="(variant, index) in draft.price_variants"
                :key="variant.id || index"
                class="variant-card"
              >
                <header class="variant-head">
                  <strong>{{ variant.name || `Paket ${index + 1}` }}</strong>
                  <button class="icon-btn danger" @click="removeVariant(index)">🗑</button>
                </header>

                <div class="grid grid-cols-2 gap-3 variant-body">
                  <div class="form-group span-2">
                    <label class="form-label">Nama Paket</label>
                    <input v-model="variant.name" type="text" class="form-input" placeholder="Contoh: Trim & Poni" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Harga</label>
                    <input v-model="variant.price" type="text" class="form-input" placeholder="Rp 65.000" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Durasi</label>
                    <input v-model="variant.duration" type="text" class="form-input" placeholder="20 menit" />
                  </div>

                  <div class="form-group span-2">
                    <label class="form-label">Deskripsi Paket</label>
                    <textarea v-model="variant.description" class="form-textarea" rows="2" placeholder="Deskripsi singkat paket"></textarea>
                  </div>

                  <div class="form-group span-2">
                    <label class="form-label">Foto Paket</label>
                    <input v-model="variant.image_url" type="text" class="form-input" placeholder="https://..." />
                    <div class="upload-row">
                      <input type="file" accept="image/*" @change="uploadVariantImage($event, index)" :disabled="uploadingVariantIndex === index" />
                      <span v-if="uploadingVariantIndex === index" class="hint">Mengupload foto paket...</span>
                    </div>
                    <img v-if="variant.image_url" :src="variant.image_url" class="variant-preview" alt="Preview paket" />
                  </div>

                  <div class="form-group span-2">
                    <label class="toggle-label">
                      <input v-model="variant.is_popular" type="checkbox" />
                      Tandai sebagai Terpopuler
                    </label>
                  </div>
                </div>
              </article>

              <div v-if="draft.price_variants.length > 0" class="preview-wrap">
                <h4>Preview Kartu Paket</h4>
                <div class="preview-grid">
                  <article
                    v-for="(variant, index) in draft.price_variants"
                    :key="`preview-${index}`"
                    class="preview-card"
                    :class="{ popular: variant.is_popular }"
                  >
                    <div class="preview-image">
                      <img v-if="variant.image_url" :src="variant.image_url" alt="Preview" />
                      <ImageOff v-else :size="22" />
                      <span v-if="variant.is_popular" class="popular-tag">TERPOPULER</span>
                    </div>
                    <div class="preview-copy">
                      <strong>{{ variant.name || `Paket ${index + 1}` }}</strong>
                      <small>{{ variant.duration || '-' }}</small>
                      <p>{{ variant.price || '-' }}</p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div v-if="formError" class="form-error-box">{{ formError }}</div>

          <div class="editor-actions">
            <button class="btn btn-outline" @click="resetDraft" :disabled="saving">Batalkan</button>
            <button class="btn btn-primary" @click="saveTreatment" :disabled="saving">
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ChevronRight, DollarSign, FileText, ImageIcon, ImageOff, ListChecks, Star } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import { cloudinaryService } from '@/lib/cloudinary'

const loading = ref(true)
const saving = ref(false)
const formError = ref('')
const activeTab = ref('info')
const treatments = ref([])
const selectedTreatmentId = ref('')
const draft = ref(null)
const uploadingBanner = ref(false)
const uploadingVariantIndex = ref(-1)

const createBlankTreatment = () => ({
  id: null,
  slug: '',
  title: '',
  short_description: '',
  description: '',
  duration_label: '',
  starting_price_label: '',
  banner_image_url: '',
  benefits: [],
  price_variants: [],
  sort_order: 0,
  is_active: true
})

const normalizeVariant = (variant, index = 0) => ({
  id: variant?.id || `var-${Date.now()}-${index}`,
  name: variant?.name || '',
  price: variant?.price || '',
  duration: variant?.duration || '',
  description: variant?.description || '',
  image_url: variant?.image_url || '',
  is_popular: Boolean(variant?.is_popular)
})

const normalizeTreatment = (item) => ({
  ...createBlankTreatment(),
  ...item,
  benefits: Array.isArray(item?.benefits) ? item.benefits : [],
  price_variants: Array.isArray(item?.price_variants)
    ? item.price_variants.map((variant, index) => normalizeVariant(variant, index))
    : []
})

const currentBenefitsCount = computed(() => draft.value?.benefits?.filter((it) => String(it || '').trim()).length || 0)
const currentVariantsCount = computed(() => draft.value?.price_variants?.length || 0)
const currentPopularCount = computed(() => draft.value?.price_variants?.filter((it) => it.is_popular).length || 0)
const currentImagesCount = computed(() => draft.value?.price_variants?.filter((it) => Boolean(it.image_url)).length || 0)

const findTreatment = (id) => treatments.value.find((item) => item.id === id)

const loadTreatments = async (preferredTreatmentId = '') => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('website_treatments')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error
    treatments.value = (data || []).map((item) => normalizeTreatment(item))

    if (treatments.value.length > 0) {
      const candidateId = preferredTreatmentId || selectedTreatmentId.value
      const selected = treatments.value.find((item) => item.id === candidateId) || treatments.value[0]
      selectedTreatmentId.value = selected.id
      draft.value = normalizeTreatment(selected)
    } else {
      draft.value = null
      selectedTreatmentId.value = ''
    }
  } catch (error) {
    console.error('Error loading website treatments:', error)
    formError.value = `Gagal memuat data: ${error.message}`
  } finally {
    loading.value = false
  }
}

const selectTreatment = (id) => {
  const found = findTreatment(id)
  if (!found) return
  selectedTreatmentId.value = id
  draft.value = normalizeTreatment(found)
  formError.value = ''
}

const createTreatment = () => {
  const blank = normalizeTreatment(createBlankTreatment())
  blank.slug = `treatment-${Date.now()}`
  blank.title = 'Treatment Baru'
  draft.value = blank
  selectedTreatmentId.value = ''
  activeTab.value = 'info'
  formError.value = ''
}

const addBenefit = () => {
  if (!draft.value) return
  draft.value.benefits.push('')
}

const removeBenefit = (index) => {
  if (!draft.value) return
  draft.value.benefits.splice(index, 1)
}

const addVariant = () => {
  if (!draft.value) return
  draft.value.price_variants.push(normalizeVariant({}, draft.value.price_variants.length))
}

const removeVariant = (index) => {
  if (!draft.value) return
  draft.value.price_variants.splice(index, 1)
}

const sanitizeDraft = () => {
  const payload = normalizeTreatment(draft.value)
  payload.slug = String(payload.slug || '').trim().toLowerCase().replace(/\s+/g, '-')
  payload.title = String(payload.title || '').trim()
  payload.short_description = String(payload.short_description || '').trim()
  payload.description = String(payload.description || '').trim()
  payload.duration_label = String(payload.duration_label || '').trim()
  payload.starting_price_label = String(payload.starting_price_label || '').trim()
  payload.banner_image_url = String(payload.banner_image_url || '').trim()
  payload.sort_order = Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 0
  payload.is_active = Boolean(payload.is_active)
  payload.benefits = payload.benefits.map((item) => String(item || '').trim()).filter(Boolean)
  payload.price_variants = payload.price_variants
    .map((item, index) => normalizeVariant(item, index))
    .map((item) => ({
      ...item,
      name: String(item.name || '').trim(),
      price: String(item.price || '').trim(),
      duration: String(item.duration || '').trim(),
      description: String(item.description || '').trim(),
      image_url: String(item.image_url || '').trim()
    }))
    .filter((item) => item.name)
  return payload
}

const saveTreatment = async () => {
  if (!draft.value) return
  try {
    saving.value = true
    formError.value = ''

    const payload = sanitizeDraft()
    if (!payload.slug || !payload.title) {
      formError.value = 'Judul dan slug wajib diisi.'
      return
    }

    const dbPayload = {
      slug: payload.slug,
      title: payload.title,
      short_description: payload.short_description,
      description: payload.description,
      duration_label: payload.duration_label,
      starting_price_label: payload.starting_price_label,
      banner_image_url: payload.banner_image_url,
      benefits: payload.benefits,
      price_variants: payload.price_variants,
      sort_order: payload.sort_order,
      is_active: payload.is_active
    }

    let nextSelectedId = payload.id

    if (payload.id) {
      const { error } = await supabase
        .from('website_treatments')
        .update(dbPayload)
        .eq('id', payload.id)

      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('website_treatments')
        .insert([dbPayload])
        .select('id')
        .single()

      if (error) throw error
      nextSelectedId = data.id
      selectedTreatmentId.value = data.id
    }

    await loadTreatments(nextSelectedId)
  } catch (error) {
    console.error('Error saving website treatment:', error)
    formError.value = `Gagal menyimpan: ${error.message}`
  } finally {
    saving.value = false
  }
}

const resetDraft = () => {
  formError.value = ''
  if (!selectedTreatmentId.value) {
    createTreatment()
    return
  }
  const found = findTreatment(selectedTreatmentId.value)
  if (found) {
    draft.value = normalizeTreatment(found)
  }
}

const uploadBanner = async (event) => {
  const file = event.target.files?.[0]
  if (!file || !draft.value) return
  try {
    uploadingBanner.value = true
    const result = await cloudinaryService.uploadImage(file, 'helena-studio/treatments/banner')
    draft.value.banner_image_url = result.url
  } catch (error) {
    formError.value = `Gagal upload banner: ${error.message}`
  } finally {
    uploadingBanner.value = false
    event.target.value = ''
  }
}

const uploadVariantImage = async (event, index) => {
  const file = event.target.files?.[0]
  if (!file || !draft.value || !draft.value.price_variants[index]) return
  try {
    uploadingVariantIndex.value = index
    const result = await cloudinaryService.uploadImage(file, 'helena-studio/treatments/packages')
    draft.value.price_variants[index].image_url = result.url
  } catch (error) {
    formError.value = `Gagal upload foto paket: ${error.message}`
  } finally {
    uploadingVariantIndex.value = -1
    event.target.value = ''
  }
}

onMounted(() => {
  loadTreatments()
})
</script>

<style scoped>
.treatment-shell {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1rem;
}

.treatment-sidebar {
  align-self: start;
  padding: 1rem;
}

.sidebar-label {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.sidebar-item {
  width: 100%;
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 12px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  border-color: #8a7da3;
}

.sidebar-item.active {
  border-color: var(--rose);
  background: var(--rose-soft);
  color: var(--rose-dark);
}

.sidebar-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--rose);
  opacity: 0.45;
}

.sidebar-copy {
  flex: 1;
  text-align: left;
}

.sidebar-copy strong {
  display: block;
  font-size: 0.95rem;
  line-height: 1.2;
}

.sidebar-copy small {
  color: var(--text-faint);
  font-size: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
}

.stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: var(--rose);
}

.bg-soft {
  background: var(--rose-soft);
}

.stat-card strong {
  display: block;
  color: var(--rose-dark);
  line-height: 1;
}

.stat-card span {
  font-size: 0.83rem;
  color: var(--text-light);
}

.empty-editor {
  text-align: center;
  color: var(--text-light);
  padding: 2.5rem 1rem;
}

.editor-card {
  padding: 0;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e6e2ef;
  padding: 0.35rem 0.8rem 0;
  gap: 0.25rem;
  background: linear-gradient(180deg, #f6f4fa 0%, #faf9fc 100%);
}

.tab-btn {
  background: transparent;
  border: 1px solid transparent;
  border-bottom: 2px solid transparent;
  color: #6f7380;
  padding: 0.78rem 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: var(--rose);
  border-color: #ddd8eb;
  border-bottom-color: var(--rose);
  background: #fff;
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(84, 71, 113, 0.08);
}

.tab-btn:active {
  transform: translateY(1px);
}

.count-pill {
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--rose);
  color: #fff;
  font-size: 0.72rem;
  display: grid;
  place-items: center;
}

.editor-body {
  padding: 1rem;
}

.stack-lg {
  display: grid;
  gap: 1rem;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-3 {
  gap: 0.75rem;
}

.span-2 {
  grid-column: span 2;
}

.upload-row {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.banner-preview {
  margin-top: 0.65rem;
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.inline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.benefit-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.idx-chip {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--rose);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  color: var(--text-light);
}

.icon-btn.danger {
  color: #dc2626;
}

.variant-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.variant-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.9rem;
  background: #faf9fd;
  border-bottom: 1px solid var(--border);
}

.variant-body {
  padding: 0.8rem;
}

.variant-preview {
  margin-top: 0.5rem;
  width: min(100%, 220px);
  aspect-ratio: 4 / 5;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--border);
}

.toggle-wrap {
  display: flex;
  align-items: end;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  color: var(--text);
}

.hint {
  color: var(--text-light);
  font-size: 0.78rem;
}

.preview-wrap {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.9rem;
}

.preview-wrap h4 {
  color: var(--rose-dark);
  margin-bottom: 0.8rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.preview-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.preview-card.popular {
  border-color: var(--rose);
}

.preview-image {
  aspect-ratio: 4 / 5;
  background: #f5f4f8;
  display: grid;
  place-items: center;
  color: var(--text-faint);
  position: relative;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popular-tag {
  position: absolute;
  right: 0.45rem;
  top: 0.45rem;
  border-radius: 999px;
  background: var(--rose);
  color: #fff;
  font-size: 0.64rem;
  padding: 0.18rem 0.45rem;
  font-weight: 700;
}

.preview-copy {
  padding: 0.7rem;
}

.preview-copy strong {
  display: block;
  color: #111827;
}

.preview-copy small {
  color: var(--text-light);
}

.preview-copy p {
  color: var(--rose-dark);
  font-weight: 700;
  margin-top: 0.35rem;
}

.form-error-box {
  margin: 0 1rem;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 10px;
  padding: 0.7rem 0.8rem;
}

.editor-actions {
  border-top: 1px solid var(--border);
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.center-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

@media (max-width: 1180px) {
  .treatment-shell {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: span 1;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
    padding-bottom: 0.2rem;
  }
}
</style>
