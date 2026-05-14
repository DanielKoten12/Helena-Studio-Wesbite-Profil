<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Pengaturan</h1>
    </div>

    <!-- Change Password -->
    <div class="card">
      <h2 class="card-title mb-3">Ganti Password</h2>
      
      <form @submit.prevent="changePassword" style="max-width: 500px;">
        <div class="form-group">
          <label class="form-label">Password Lama *</label>
          <input v-model="passwordForm.currentPassword" type="password" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Password Baru *</label>
          <input v-model="passwordForm.newPassword" type="password" class="form-input" required minlength="6" />
          <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;">
            Minimal 6 karakter
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Konfirmasi Password Baru *</label>
          <input v-model="passwordForm.confirmPassword" type="password" class="form-input" required />
        </div>

        <div v-if="passwordError" class="form-error" style="background: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
          {{ passwordError }}
        </div>

        <div v-if="passwordSuccess" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
          Password berhasil diubah!
        </div>

        <button type="submit" class="btn btn-primary" :disabled="changingPassword">
          {{ changingPassword ? 'Menyimpan...' : 'Ganti Password' }}
        </button>
      </form>
    </div>

    <!-- General Settings -->
    <div class="card">
      <h2 class="card-title mb-3">Pengaturan Umum</h2>
      
      <div v-if="loadingSettings" style="text-align: center; padding: 2rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <form v-else @submit.prevent="saveSettings" style="max-width: 600px;">
        <div class="grid grid-cols-2 gap-3">
          <div class="form-group">
            <label class="form-label">Jam Buka</label>
            <input v-model="settings.salon_open_time" type="time" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Jam Tutup</label>
            <input v-model="settings.salon_close_time" type="time" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Maksimal Booking (hari ke depan)</label>
          <input v-model.number="settings.booking_max_days_ahead" type="number" class="form-input" min="1" max="30" />
        </div>

        <div class="form-group">
          <label class="form-label">Interval Slot Waktu (menit)</label>
          <input v-model.number="settings.slot_interval_minutes" type="number" class="form-input" min="15" step="15" />
        </div>

        <div class="form-group">
          <label class="form-label">Nomor Telepon</label>
          <input v-model="settings.contact_phone" type="tel" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="settings.contact_email" type="email" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Alamat</label>
          <textarea v-model="settings.contact_address" class="form-textarea" rows="2"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Nomor WhatsApp</label>
          <input v-model="settings.whatsapp_number" type="text" class="form-input" placeholder="6281234567890" />
          <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;">
            Format: 62xxx (tanpa tanda +)
          </p>
        </div>

        <div v-if="settingsError" class="form-error" style="background: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
          {{ settingsError }}
        </div>

        <div v-if="settingsSuccess" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
          Pengaturan berhasil disimpan!
        </div>

        <button type="submit" class="btn btn-primary" :disabled="savingSettings">
          {{ savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// Password change
const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Settings
const loadingSettings = ref(true)
const savingSettings = ref(false)
const settingsError = ref('')
const settingsSuccess = ref(false)
const settings = ref({
  salon_open_time: '10:00',
  salon_close_time: '21:00',
  booking_max_days_ahead: '7',
  slot_interval_minutes: '30',
  contact_phone: '',
  contact_email: '',
  contact_address: '',
  whatsapp_number: ''
})

const changePassword = async () => {
  try {
    passwordError.value = ''
    passwordSuccess.value = false
    changingPassword.value = true

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = 'Password baru dan konfirmasi tidak cocok'
      return
    }

    if (passwordForm.value.newPassword.length < 6) {
      passwordError.value = 'Password baru minimal 6 karakter'
      return
    }

    await authService.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    passwordSuccess.value = true
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    setTimeout(() => {
      passwordSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Change password error:', error)
    passwordError.value = error.message
  } finally {
    changingPassword.value = false
  }
}

const loadSettings = async () => {
  try {
    loadingSettings.value = true
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
    
    if (error) throw error

    // Convert array to object
    data.forEach(item => {
      settings.value[item.key] = item.value
    })
  } catch (error) {
    console.error('Error loading settings:', error)
    settingsError.value = 'Gagal memuat pengaturan'
  } finally {
    loadingSettings.value = false
  }
}

const saveSettings = async () => {
  try {
    settingsError.value = ''
    settingsSuccess.value = false
    savingSettings.value = true

    // Update each setting
    const updates = Object.entries(settings.value).map(([key, value]) => ({
      key,
      value: String(value)
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('settings')
        .update({ value: update.value })
        .eq('key', update.key)
      
      if (error) throw error
    }

    settingsSuccess.value = true
    setTimeout(() => {
      settingsSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Error saving settings:', error)
    settingsError.value = 'Gagal menyimpan pengaturan: ' + error.message
  } finally {
    savingSettings.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
