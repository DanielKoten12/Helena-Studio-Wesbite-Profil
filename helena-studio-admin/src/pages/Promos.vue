<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Promo Homepage</h1>
      <div class="topbar-actions">
        <button class="btn btn-primary" @click="openAddModal">+ Tambah Promo</button>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Promo</th>
              <th>Harga</th>
              <th>Berlaku Hingga</th>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="promo in promos" :key="promo.id">
              <td>
                <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                  <div
                    v-if="promo.image_url"
                    style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #f3f4f6;"
                  >
                    <img
                      :src="promo.image_url"
                      :alt="promo.title"
                      style="width: 100%; height: 100%; object-fit: cover;"
                    />
                  </div>
                  <div>
                    <strong>{{ promo.title }}</strong>
                    <p style="font-size: 0.8125rem; color: var(--text-light); margin-top: 0.25rem;">
                      {{ promo.description }}
                    </p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                      <span class="badge badge-info">{{ promo.tag || 'PROMO' }}</span>
                      <span class="badge badge-warning">{{ promo.badge || '-' }}</span>
                      <span v-if="promo.is_featured" class="badge badge-success">Unggulan</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div style="font-size: 0.8125rem; color: var(--text-light); text-decoration: line-through;">
                    {{ formatCurrency(promo.original_price) }}
                  </div>
                  <div style="font-weight: 700; color: var(--primary-dark);">
                    {{ formatCurrency(promo.discounted_price) }}
                  </div>
                </div>
              </td>
              <td>
                <span>{{ formatDate(promo.valid_until) }}</span>
              </td>
              <td>
                <span>{{ promo.display_order }}</span>
              </td>
              <td>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                  <span class="badge" :class="promo.is_active ? 'badge-success' : 'badge-error'">
                    {{ promo.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                  <span class="badge" :class="isExpired(promo.valid_until) ? 'badge-error' : 'badge-info'">
                    {{ isExpired(promo.valid_until) ? 'Expired' : 'Valid' }}
                  </span>
                </div>
              </td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-outline btn-sm" @click="editPromo(promo)">
                    <Pencil :size="14" />
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deletePromo(promo)" aria-label="Hapus promo">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="promos.length === 0">
              <td colspan="6" style="text-align: center; color: var(--text-light); padding: 2rem;">
                Belum ada data promo.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal" style="max-width: 700px;">
        <div class="modal-header">
          <h2 class="modal-title">{{ editMode ? 'Edit Promo' : 'Tambah Promo' }}</h2>
          <button
            @click="closeModal"
            style="background: none; border: none; font-size: 1.5rem; cursor: pointer;"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          <div class="grid grid-cols-2 gap-3">
            <div class="form-group">
              <label class="form-label">Tag Promo *</label>
              <input v-model="formData.tag" type="text" class="form-input" placeholder="PROMO UNGGULAN" />
            </div>
            <div class="form-group">
              <label class="form-label">Badge Diskon *</label>
              <input v-model="formData.badge" type="text" class="form-input" placeholder="-30%" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Judul Promo *</label>
            <input v-model="formData.title" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Keterangan Promo *</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-group">
              <label class="form-label">Harga Normal (Rp) *</label>
              <input
                v-model.number="formData.original_price"
                type="number"
                min="0"
                step="1000"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Harga Promo (Rp) *</label>
              <input
                v-model.number="formData.discounted_price"
                type="number"
                min="0"
                step="1000"
                class="form-input"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-group">
              <label class="form-label">Berlaku Hingga *</label>
              <input v-model="formData.valid_until" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Urutan Tampil</label>
              <input v-model.number="formData.display_order" type="number" min="0" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Gambar Promo *</label>
            <div v-if="formData.image_url" style="margin-bottom: 1rem;">
              <div
                style="width: 100%; max-width: 280px; height: 170px; border-radius: 10px; overflow: hidden; background: #f3f4f6;"
              >
                <img
                  :src="formData.image_url"
                  alt="Preview"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </div>
              <button
                type="button"
                class="btn btn-outline btn-sm"
                style="margin-top: 0.5rem;"
                @click="formData.image_url = ''"
              >
                Hapus Gambar
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              class="form-input"
              :disabled="uploading"
              @change="handleImageUpload"
            />
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
              Rasio rekomendasi 3:2 agar tampilan hero promo rapi.
            </p>
            <p v-if="uploading" style="font-size: 0.875rem; color: var(--primary); margin-top: 0.5rem;">
              Mengupload gambar...
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input v-model="formData.is_featured" type="checkbox" />
                <span class="form-label" style="margin: 0;">Jadikan Promo Unggulan</span>
              </label>
            </div>

            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input v-model="formData.is_active" type="checkbox" />
                <span class="form-label" style="margin: 0;">Tampilkan di Website</span>
              </label>
            </div>
          </div>

          <div v-if="formError" class="form-error" style="background: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 8px; margin-top: 1rem;">
            {{ formError }}
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeModal">Batal</button>
          <button type="button" class="btn btn-primary" :disabled="saving || uploading" @click="savePromo">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { cloudinaryService } from '@/lib/cloudinary'
import { Pencil, Trash2 } from 'lucide-vue-next'

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const formError = ref('')
const promos = ref([])

const formData = ref({
  tag: 'PROMO UNGGULAN',
  badge: '-10%',
  title: '',
  description: '',
  original_price: 0,
  discounted_price: 0,
  valid_until: '',
  image_url: '',
  is_featured: false,
  display_order: 0,
  is_active: true
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(amount || 0))
}

const formatDate = (dateValue) => {
  if (!dateValue) return '-'
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return dateValue

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(parsed)
}

const isExpired = (dateValue) => {
  if (!dateValue) return false
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  parsed.setHours(0, 0, 0, 0)
  return parsed < today
}

const loadPromos = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    promos.value = data || []
  } catch (error) {
    console.error('Error loading promos:', error)
    alert('Gagal memuat data promo')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    const result = await cloudinaryService.uploadImage(file, 'helena-studio/promos')
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
    tag: 'PROMO UNGGULAN',
    badge: '-10%',
    title: '',
    description: '',
    original_price: 0,
    discounted_price: 0,
    valid_until: '',
    image_url: '',
    is_featured: false,
    display_order: promos.value.length,
    is_active: true
  }
  showModal.value = true
}

const editPromo = (promo) => {
  editMode.value = true
  formData.value = {
    ...promo,
    valid_until: promo.valid_until ? String(promo.valid_until).slice(0, 10) : ''
  }
  showModal.value = true
}

const savePromo = async () => {
  try {
    formError.value = ''
    saving.value = true

    if (
      !formData.value.tag ||
      !formData.value.badge ||
      !formData.value.title ||
      !formData.value.description ||
      !formData.value.valid_until ||
      !formData.value.image_url
    ) {
      formError.value = 'Mohon lengkapi semua field yang wajib diisi.'
      return
    }

    if (Number(formData.value.discounted_price) <= 0 || Number(formData.value.original_price) <= 0) {
      formError.value = 'Harga harus lebih dari 0.'
      return
    }

    if (Number(formData.value.discounted_price) > Number(formData.value.original_price)) {
      formError.value = 'Harga promo tidak boleh lebih tinggi dari harga normal.'
      return
    }

    const payload = {
      ...formData.value,
      original_price: Number(formData.value.original_price),
      discounted_price: Number(formData.value.discounted_price),
      display_order: Number(formData.value.display_order || 0)
    }

    delete payload.id
    delete payload.created_at
    delete payload.updated_at

    let savedId = formData.value.id || null

    if (editMode.value && formData.value.id) {
      const { data, error } = await supabase
        .from('promos')
        .update(payload)
        .eq('id', formData.value.id)
        .select('id')
        .single()

      if (error) throw error
      savedId = data?.id || formData.value.id
    } else {
      const { data, error } = await supabase
        .from('promos')
        .insert([payload])
        .select('id')
        .single()

      if (error) throw error
      savedId = data?.id || null
    }

    if (payload.is_featured && savedId) {
      // Ensure only one featured promo.
      await supabase
        .from('promos')
        .update({ is_featured: false })
        .neq('id', savedId)
        .eq('is_featured', true)
    }

    closeModal()
    await loadPromos()
  } catch (error) {
    console.error('Error saving promo:', error)
    formError.value = 'Gagal menyimpan promo: ' + error.message
  } finally {
    saving.value = false
  }
}

const deletePromo = async (promo) => {
  if (!confirm(`Yakin ingin menghapus promo "${promo.title}"?`)) return

  try {
    const { error } = await supabase.from('promos').delete().eq('id', promo.id)
    if (error) throw error
    await loadPromos()
  } catch (error) {
    console.error('Error deleting promo:', error)
    alert('Gagal menghapus promo: ' + error.message)
  }
}

const closeModal = () => {
  showModal.value = false
  formError.value = ''
}

onMounted(() => {
  loadPromos()
})
</script>
