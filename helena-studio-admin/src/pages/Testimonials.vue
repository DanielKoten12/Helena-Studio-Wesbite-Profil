<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Testimoni</h1>
      <div class="topbar-actions">
        <button class="btn btn-primary" @click="openAddModal">
          + Tambah Testimoni
        </button>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
        <div style="min-width: 280px;">
          <label class="form-label" style="margin-bottom: 0.375rem;">Filter Treatment</label>
          <select v-model="selectedTreatmentFilter" class="form-select">
            <option value="all">Semua Treatment</option>
            <option value="none">Tanpa Treatment (Home saja)</option>
            <option
              v-for="treatment in treatments"
              :key="`filter-${treatment.id}`"
              :value="treatment.id"
            >
              {{ treatment.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <div v-else class="grid grid-cols-3 gap-3">
        <div v-for="testimonial in filteredTestimonials" :key="testimonial.id" 
             style="border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; background: var(--surface);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <div>
              <div style="color: #f59e0b; margin-bottom: 0.5rem;">
                <Star
                  v-for="starIndex in 5"
                  :key="`${testimonial.id}-${starIndex}`"
                  :size="15"
                  :fill="starIndex <= testimonial.rating ? '#f59e0b' : 'none'"
                  :stroke="starIndex <= testimonial.rating ? '#f59e0b' : '#d1d5db'"
                  style="margin-right: 2px;"
                />
              </div>
              <h3 style="font-weight: 600; margin-bottom: 0.25rem;">{{ testimonial.customer_name }}</h3>
              <p style="font-size: 0.8125rem; color: var(--text-light); margin-bottom: 0.5rem;">
                {{ getTreatmentLabel(testimonial.treatment_id) }}
              </p>
              <span class="badge" :class="testimonial.is_active ? 'badge-success' : 'badge-error'">
                {{ testimonial.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <div v-if="testimonial.image_url" style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden;">
              <img :src="testimonial.image_url" style="width: 100%; height: 100%; object-fit: cover;" :alt="testimonial.customer_name" />
            </div>
          </div>
          
          <p style="color: var(--text-light); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem;">
            "{{ testimonial.comment }}"
          </p>

          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" @click="editTestimonial(testimonial)">
              <Pencil :size="14" />
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteTestimonial(testimonial)" aria-label="Hapus testimoni">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <div v-if="filteredTestimonials.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);">
          <div style="margin-bottom: 1rem; display: inline-flex; color: #f59e0b;">
            <MessageSquareQuote :size="44" />
          </div>
          <p>Tidak ada testimoni untuk filter ini</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editMode ? 'Edit Testimoni' : 'Tambah Testimoni' }}</h2>
          <button @click="closeModal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Customer *</label>
            <input v-model="formData.customer_name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Rating *</label>
            <select v-model.number="formData.rating" class="form-select" required>
              <option :value="5">5 bintang</option>
              <option :value="4">4 bintang</option>
              <option :value="3">3 bintang</option>
              <option :value="2">2 bintang</option>
              <option :value="1">1 bintang</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Treatment</label>
            <select v-model="formData.treatment_id" class="form-select">
              <option value="">Semua Treatment (Home)</option>
              <option
                v-for="treatment in treatments"
                :key="treatment.id"
                :value="treatment.id"
              >
                {{ treatment.name }}
              </option>
            </select>
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;">
              Jika dipilih, testimoni akan tampil di halaman treatment tersebut dan juga Home.
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Komentar *</label>
            <textarea v-model="formData.comment" class="form-textarea" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Foto Customer</label>
            <div v-if="formData.image_url" style="margin-bottom: 1rem;">
              <div style="width: 200px; height: 200px; border-radius: 8px; overflow: hidden; background: #f3f4f6;">
                <img :src="formData.image_url" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview" />
              </div>
              <button type="button" class="btn btn-outline btn-sm" @click="formData.image_url = ''" style="margin-top: 0.5rem;">
                Hapus Gambar
              </button>
            </div>
            <input type="file" @change="handleImageUpload" accept="image/*" class="form-input" :disabled="uploading" />
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
              Gambar akan otomatis ditampilkan dalam frame kotak di website.
            </p>
            <p v-if="uploading" style="font-size: 0.875rem; color: var(--primary); margin-top: 0.5rem;">
              Mengupload gambar...
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Urutan Tampil</label>
            <input v-model.number="formData.display_order" type="number" class="form-input" min="0" />
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;">
              Testimoni dengan urutan lebih kecil akan tampil lebih dulu
            </p>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input v-model="formData.is_active" type="checkbox" />
              <span class="form-label" style="margin: 0;">Tampilkan di Website</span>
            </label>
          </div>

          <div v-if="formError" class="form-error" style="background: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 8px; margin-top: 1rem;">
            {{ formError }}
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeModal">
            Batal
          </button>
          <button type="button" class="btn btn-primary" @click="saveTestimonial" :disabled="saving || uploading">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { cloudinaryService } from '@/lib/cloudinary'
import { MessageSquareQuote, Pencil, Star, Trash2 } from 'lucide-vue-next'

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const formError = ref('')
const testimonials = ref([])
const treatments = ref([])
const selectedTreatmentFilter = ref('all')

const formData = ref({
  customer_name: '',
  rating: 5,
  treatment_id: '',
  comment: '',
  image_url: '',
  display_order: 0,
  is_active: true
})

const getTreatmentLabel = (treatmentId) => {
  if (!treatmentId) return 'Semua Treatment (Home)'
  const found = treatments.value.find(t => t.id === treatmentId)
  return found ? found.name : 'Treatment tidak ditemukan'
}

const filteredTestimonials = computed(() => {
  if (selectedTreatmentFilter.value === 'all') {
    return testimonials.value
  }

  if (selectedTreatmentFilter.value === 'none') {
    return testimonials.value.filter((item) => !item.treatment_id)
  }

  return testimonials.value.filter((item) => item.treatment_id === selectedTreatmentFilter.value)
})

const loadTestimonials = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    testimonials.value = data || []
  } catch (error) {
    console.error('Error loading testimonials:', error)
    alert('Gagal memuat data testimoni')
  } finally {
    loading.value = false
  }
}

const loadTreatments = async () => {
  try {
    const { data, error } = await supabase
      .from('treatments')
      .select('id, name, category, is_active')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error
    treatments.value = data || []
  } catch (error) {
    console.error('Error loading treatments:', error)
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    const result = await cloudinaryService.uploadImage(file, 'helena-studio/testimonials')
    formData.value.image_url = result.url
  } catch (error) {
    console.error('Upload error:', error)
    alert('Gagal upload gambar: ' + error.message)
  } finally {
    uploading.value = false
  }
}

const openAddModal = () => {
  editMode.value = false
  formData.value = {
    customer_name: '',
    rating: 5,
    treatment_id: '',
    comment: '',
    image_url: '',
    display_order: 0,
    is_active: true
  }
  showModal.value = true
}

const editTestimonial = (testimonial) => {
  editMode.value = true
  formData.value = {
    ...testimonial,
    treatment_id: testimonial.treatment_id || ''
  }
  showModal.value = true
}

const saveTestimonial = async () => {
  try {
    formError.value = ''
    saving.value = true

    if (!formData.value.customer_name || !formData.value.comment) {
      formError.value = 'Mohon lengkapi semua field yang wajib diisi'
      return
    }

    const testimonialData = { ...formData.value }
    testimonialData.treatment_id = testimonialData.treatment_id || null
    delete testimonialData.id
    delete testimonialData.created_at
    delete testimonialData.updated_at

    if (editMode.value && formData.value.id) {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', formData.value.id)
      
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
      
      if (error) throw error
    }

    closeModal()
    loadTestimonials()
  } catch (error) {
    console.error('Error saving testimonial:', error)
    formError.value = 'Gagal menyimpan testimoni: ' + error.message
  } finally {
    saving.value = false
  }
}

const deleteTestimonial = async (testimonial) => {
  if (!confirm(`Yakin ingin menghapus testimoni dari ${testimonial.customer_name}?`)) return
  
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonial.id)
    
    if (error) throw error
    loadTestimonials()
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    alert('Gagal menghapus testimoni: ' + error.message)
  }
}

const closeModal = () => {
  showModal.value = false
  formError.value = ''
}

onMounted(() => {
  Promise.all([loadTestimonials(), loadTreatments()])
})
</script>
