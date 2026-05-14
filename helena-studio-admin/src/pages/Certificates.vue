<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Sertifikat</h1>
      <div class="topbar-actions">
        <button class="btn btn-primary" @click="openAddModal">
          + Tambah Sertifikat
        </button>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <div v-else class="grid grid-cols-3 gap-3">
        <div v-for="cert in certificates" :key="cert.id" 
             style="border: 1px solid var(--border); border-radius: 12px; padding: 1rem; background: var(--surface);">
          <div v-if="cert.image_url" style="width: 100%; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; margin-bottom: 1rem;">
            <img :src="cert.image_url" style="width: 100%; height: 100%; object-fit: cover;" :alt="cert.institution_name" />
          </div>
          
          <h3 style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1rem; color: #C24655;">
            {{ cert.institution_name }}
          </h3>
          
          <p style="color: var(--text-light); font-size: 0.875rem; margin-bottom: 0.25rem;">
            {{ cert.location }}
          </p>
          
          <p style="color: var(--text-light); font-size: 0.875rem; margin-bottom: 0.5rem;">
            Certified {{ cert.year }}
          </p>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <span class="badge" :class="cert.is_active ? 'badge-success' : 'badge-error'">
              {{ cert.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-outline btn-sm" @click="editCertificate(cert)">
                <Pencil :size="14" />
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteCertificate(cert)" aria-label="Hapus sertifikat">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="certificates.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);">
          <div style="margin-bottom: 1rem; display: inline-flex; color: #C24655;">
            <Award :size="44" />
          </div>
          <p>Belum ada sertifikat</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editMode ? 'Edit Sertifikat' : 'Tambah Sertifikat' }}</h2>
          <button @click="closeModal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Institusi/Tempat Sertifikat *</label>
            <input v-model="formData.institution_name" type="text" class="form-input" placeholder="Jhonny Andrean Salon Academy" required />
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi *</label>
            <input v-model="formData.location" type="text" class="form-input" placeholder="Jakarta Selatan" required />
          </div>

          <div class="form-group">
            <label class="form-label">Tahun *</label>
            <input v-model="formData.year" type="text" class="form-input" placeholder="2015" maxlength="4" required />
          </div>

          <div class="form-group">
            <label class="form-label">Gambar Sertifikat *</label>
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
            <label class="form-label">Urutan Tampil</label>
            <input v-model.number="formData.display_order" type="number" class="form-input" min="0" />
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
          <button type="button" class="btn btn-primary" @click="saveCertificate" :disabled="saving || uploading">
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
import { Award, Pencil, Trash2 } from 'lucide-vue-next'

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const formError = ref('')
const certificates = ref([])

const formData = ref({
  institution_name: '',
  location: '',
  year: '',
  image_url: '',
  display_order: 0,
  is_active: true
})

const loadCertificates = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    certificates.value = data || []
  } catch (error) {
    console.error('Error loading certificates:', error)
    alert('Gagal memuat data sertifikat')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    const result = await cloudinaryService.uploadImage(file, 'helena-studio/certificates')
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
    institution_name: '',
    location: '',
    year: '',
    image_url: '',
    display_order: 0,
    is_active: true
  }
  showModal.value = true
}

const editCertificate = (cert) => {
  editMode.value = true
  formData.value = { ...cert }
  showModal.value = true
}

const saveCertificate = async () => {
  try {
    formError.value = ''
    saving.value = true

    if (!formData.value.institution_name || !formData.value.location || !formData.value.year || !formData.value.image_url) {
      formError.value = 'Mohon lengkapi semua field yang wajib (*)'
      return
    }

    const certData = { ...formData.value }
    delete certData.id
    delete certData.created_at
    delete certData.updated_at

    if (editMode.value && formData.value.id) {
      const { error } = await supabase
        .from('certificates')
        .update(certData)
        .eq('id', formData.value.id)
      
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('certificates')
        .insert([certData])
      
      if (error) throw error
    }

    closeModal()
    loadCertificates()
  } catch (error) {
    console.error('Error saving certificate:', error)
    formError.value = 'Gagal menyimpan sertifikat: ' + error.message
  } finally {
    saving.value = false
  }
}

const deleteCertificate = async (cert) => {
  if (!confirm(`Yakin ingin menghapus sertifikat "${cert.title}"?`)) return
  
  try {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', cert.id)
    
    if (error) throw error
    loadCertificates()
  } catch (error) {
    console.error('Error deleting certificate:', error)
    alert('Gagal menghapus sertifikat: ' + error.message)
  }
}

const closeModal = () => {
  showModal.value = false
  formError.value = ''
}

onMounted(() => {
  loadCertificates()
})
</script>
