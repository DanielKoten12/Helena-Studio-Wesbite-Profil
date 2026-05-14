<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Gambar Website</h1>
      <div class="topbar-actions">
        <button class="btn btn-primary" @click="openAddModal">
          + Tambah Gambar
        </button>
      </div>
    </div>

    <div class="card">
      <p style="color: var(--text-light); margin-bottom: 1.5rem;">
        Kelola gambar-gambar yang ditampilkan di website utama. Setiap gambar memiliki section dan key unik.
      </p>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Section</th>
              <th>Image Key</th>
              <th>Alt Text</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="image in images" :key="image.id">
              <td>
                <div style="width: 80px; height: 60px; border-radius: 8px; overflow: hidden;">
                  <img :src="image.image_url" style="width: 100%; height: 100%; object-fit: cover;" :alt="image.alt_text" />
                </div>
              </td>
              <td><span class="badge badge-info">{{ image.section }}</span></td>
              <td><code style="font-size: 0.875rem;">{{ image.image_key }}</code></td>
              <td>{{ image.alt_text || '-' }}</td>
              <td>
                <span class="badge" :class="image.is_active ? 'badge-success' : 'badge-error'">
                  {{ image.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-outline btn-sm" @click="editImage(image)">
                    ✏️
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deleteImage(image)">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editMode ? 'Edit Gambar' : 'Tambah Gambar' }}</h2>
          <button @click="closeModal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Section *</label>
            <input v-model="formData.section" type="text" class="form-input" required placeholder="Contoh: hero, about, gallery" />
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;">
              Bagian website tempat gambar ini ditampilkan
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Image Key *</label>
            <input v-model="formData.image_key" type="text" class="form-input" required placeholder="Contoh: hero-main, about-team" />
            <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;">
              Identifier unik untuk gambar ini
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Alt Text</label>
            <input v-model="formData.alt_text" type="text" class="form-input" placeholder="Deskripsi gambar untuk SEO" />
          </div>

          <div class="form-group">
            <label class="form-label">Upload Gambar *</label>
            <div v-if="formData.image_url" style="margin-bottom: 1rem;">
              <img :src="formData.image_url" style="max-width: 100%; border-radius: 8px;" alt="Preview" />
              <button type="button" class="btn btn-outline btn-sm" @click="formData.image_url = ''" style="margin-top: 0.5rem;">
                Hapus Gambar
              </button>
            </div>
            <input type="file" @change="handleImageUpload" accept="image/*" class="form-input" :disabled="uploading" />
            <p v-if="uploading" style="font-size: 0.875rem; color: var(--primary); margin-top: 0.5rem;">
              Mengupload gambar...
            </p>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input v-model="formData.is_active" type="checkbox" />
              <span class="form-label" style="margin: 0;">Aktif</span>
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
          <button type="button" class="btn btn-primary" @click="saveImage" :disabled="saving || uploading">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { cloudinaryService } from '@/lib/cloudinary'

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const formError = ref('')
const images = ref([])

const formData = ref({
  section: '',
  image_key: '',
  image_url: '',
  alt_text: '',
  is_active: true
})

const loadImages = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .order('section', { ascending: true })
    
    if (error) throw error
    images.value = data || []
  } catch (error) {
    console.error('Error loading images:', error)
    alert('Gagal memuat data gambar')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    const result = await cloudinaryService.uploadImage(file, 'helena-studio/website')
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
    section: '',
    image_key: '',
    image_url: '',
    alt_text: '',
    is_active: true
  }
  showModal.value = true
}

const editImage = (image) => {
  editMode.value = true
  formData.value = { ...image }
  showModal.value = true
}

const saveImage = async () => {
  try {
    formError.value = ''
    saving.value = true

    if (!formData.value.section || !formData.value.image_key || !formData.value.image_url) {
      formError.value = 'Mohon lengkapi semua field yang wajib diisi'
      return
    }

    const imageData = { ...formData.value }
    delete imageData.id
    delete imageData.created_at
    delete imageData.updated_at

    if (editMode.value && formData.value.id) {
      const { error } = await supabase
        .from('website_images')
        .update(imageData)
        .eq('id', formData.value.id)
      
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('website_images')
        .insert([imageData])
      
      if (error) throw error
    }

    closeModal()
    loadImages()
  } catch (error) {
    console.error('Error saving image:', error)
    formError.value = 'Gagal menyimpan gambar: ' + error.message
  } finally {
    saving.value = false
  }
}

const deleteImage = async (image) => {
  if (!confirm(`Yakin ingin menghapus gambar "${image.image_key}"?`)) return
  
  try {
    const { error } = await supabase
      .from('website_images')
      .delete()
      .eq('id', image.id)
    
    if (error) throw error
    loadImages()
  } catch (error) {
    console.error('Error deleting image:', error)
    alert('Gagal menghapus gambar: ' + error.message)
  }
}

const closeModal = () => {
  showModal.value = false
  formError.value = ''
}

onMounted(() => {
  loadImages()
})
</script>
