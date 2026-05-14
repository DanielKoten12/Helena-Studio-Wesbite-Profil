<template>
  <div>
    <div class="grid grid-cols-4 gap-3 mb-4">
      <button
        class="card"
        v-for="item in statusSummary"
        :key="item.key"
        @click="filterStatus = item.key"
        :style="{
          cursor: 'pointer',
          borderColor: filterStatus === item.key ? '#c3b2d7' : '#f0f0f0',
          boxShadow: filterStatus === item.key ? '0 0 0 2px rgba(195, 178, 215, 0.25)' : 'none'
        }"
      >
        <p style="font-size: 0.86rem; color: var(--text-light);">{{ item.label }}</p>
        <p style="font-size: 2rem; line-height: 1; margin-top: 0.5rem;" :style="{ color: item.color }">{{ item.count }}</p>
      </button>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
      <div class="card-header" style="padding: 1.1rem 1.2rem; border-bottom: 1px solid #f0f0f0; margin-bottom: 0;">
        <h2 class="card-title">Daftar Reservasi</h2>
        <div class="topbar-actions" style="gap: 0.6rem;">
          <div style="position: relative; max-width: 260px; width: 100%;">
            <Search :size="14" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af;" />
            <input
              v-model="search"
              type="text"
              class="form-input"
              placeholder="Cari nama, ID, layanan..."
              style="padding-left: 2rem;"
            />
          </div>

          <div style="position: relative; max-width: 180px; width: 100%;">
            <Filter :size="14" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af;" />
            <select v-model="filterStatus" class="form-select" style="padding-left: 2rem;">
              <option value="all">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" style="text-align: center; padding: 2.5rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <div v-else-if="filteredBookings.length === 0" style="text-align: center; padding: 3rem; color: var(--text-light);">
        Tidak ada reservasi ditemukan.
      </div>

      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID Reservasi</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Jadwal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in filteredBookings" :key="booking.id">
              <td>
                <span style="color: var(--rose); font-weight: 600; font-family: monospace; font-size: 0.75rem;">{{ booking.id }}</span>
              </td>
              <td>
                <div style="display: flex; gap: 0.6rem; align-items: center;">
                  <div
                    style="width: 32px; height: 32px; border-radius: 999px; background: rgba(195, 178, 215, 0.2); color: var(--rose); display: grid; place-items: center; font-weight: 600; font-size: 0.78rem;"
                  >
                    {{ (booking.customer_name || '?').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p style="font-weight: 600; margin-bottom: 0.1rem;">{{ booking.customer_name }}</p>
                    <p style="font-size: 0.8rem; color: var(--text-light);">{{ booking.customer_phone }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span style="background: #f7f7f7; border-radius: 10px; padding: 0.25rem 0.55rem; font-size: 0.82rem; color: #374151;">
                  {{ booking.treatment_name }}
                </span>
              </td>
              <td>
                <p style="font-weight: 600;">{{ formatDate(booking.booking_date) }}</p>
                <p style="font-size: 0.8rem; color: var(--text-light);">{{ formatTime(booking.start_time) }} WIB</p>
              </td>
              <td>
                <span class="badge" :style="statusStyle(normalizeStatus(booking.status))">
                  {{ statusLabel[normalizeStatus(booking.status)] }}
                </span>
              </td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-outline btn-sm" @click="selectedBooking = booking" title="Lihat detail">
                    <Eye :size="14" />
                  </button>
                  <button
                    v-if="normalizeStatus(booking.status) === 'pending'"
                    class="btn btn-outline btn-sm"
                    @click="quickUpdateStatus(booking, 'confirmed')"
                    title="Konfirmasi"
                  >
                    <Check :size="14" />
                  </button>
                  <button
                    v-if="normalizeStatus(booking.status) === 'pending' || normalizeStatus(booking.status) === 'confirmed'"
                    class="btn btn-outline btn-sm"
                    @click="quickUpdateStatus(booking, 'cancelled')"
                    title="Batalkan"
                  >
                    <X :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedBooking" class="modal-overlay" @click.self="selectedBooking = null">
      <div class="modal" style="max-width: 560px;">
        <div class="modal-header" style="border-bottom: none; padding-bottom: 0.35rem;">
          <h2 class="modal-title" style="font-size: 2rem; line-height: 1;">Detail Reservasi</h2>
          <button
            @click="selectedBooking = null"
            style="width: 36px; height: 36px; border-radius: 12px; border: none; background: #f3f4f6; color: #6b7280; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;"
            aria-label="Tutup"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="modal-body" style="display: grid; gap: 0.75rem; padding-top: 0.6rem;">
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">ID Reservasi</span>
            <span style="font-weight: 600; font-family: monospace;">{{ selectedBooking.id }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Nama Pelanggan</span>
            <span style="font-weight: 600;">{{ selectedBooking.customer_name }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Telepon</span>
            <span style="font-weight: 600;">{{ selectedBooking.customer_phone }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Email</span>
            <span style="font-weight: 600;">{{ selectedBooking.customer_email || '-' }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Layanan</span>
            <span style="font-weight: 600;">{{ selectedBooking.treatment_name }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Tanggal</span>
            <span style="font-weight: 600;">{{ formatDate(selectedBooking.booking_date) }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Jam</span>
            <span style="font-weight: 600;">{{ formatTime(selectedBooking.start_time) }} - {{ formatTime(selectedBooking.end_time) }} WIB</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Catatan</span>
            <span style="font-weight: 600;">{{ selectedBooking.notes || '-' }}</span>
          </div>
          <div style="display: grid; grid-template-columns: 170px 1fr; gap: 0.5rem; align-items: center;">
            <span style="color: #9ca3af;">Status</span>
            <span class="badge" :style="statusStyle(normalizeStatus(selectedBooking.status))">
              {{ statusLabel[normalizeStatus(selectedBooking.status)] }}
            </span>
          </div>
        </div>

        <div class="modal-footer" style="border-top: none; padding-top: 0.7rem; justify-content: space-between;">
          <button
            v-if="normalizeStatus(selectedBooking.status) === 'pending'"
            class="btn btn-primary"
            style="min-width: 150px;"
            @click="quickUpdateStatus(selectedBooking, 'confirmed')"
          >
            Konfirmasi
          </button>
          <div v-else></div>
          <button class="btn btn-outline" style="min-width: 120px;" @click="selectedBooking = null">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Check, Eye, Filter, Search, X } from 'lucide-vue-next'

const loading = ref(true)
const bookings = ref([])
const search = ref('')
const filterStatus = ref('all')
const selectedBooking = ref(null)

const statusLabel = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan'
}

const normalizeStatus = (status) => {
  const raw = String(status || '').toLowerCase().trim()
  if (raw === 'pending' || raw === 'menunggu') return 'pending'
  if (raw === 'confirmed' || raw === 'dikonfirmasi') return 'confirmed'
  if (raw === 'completed' || raw === 'selesai') return 'completed'
  if (raw === 'cancelled' || raw === 'dibatalkan') return 'cancelled'
  return 'pending'
}

const statusPriority = {
  pending: 0,
  confirmed: 1,
  completed: 2,
  cancelled: 3
}

const statusStyle = (status) => {
  if (status === 'confirmed') return { background: '#dbeafe', color: '#2563eb' }
  if (status === 'completed') return { background: '#dcfce7', color: '#16a34a' }
  if (status === 'cancelled') return { background: '#fee2e2', color: '#dc2626' }
  return { background: '#fef3c7', color: '#d97706' }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (time) => String(time || '').slice(0, 5)

const filteredBookings = computed(() => {
  const term = search.value.trim().toLowerCase()

  return bookings.value
    .filter((item) => {
      const matchSearch =
        !term ||
        (item.customer_name || '').toLowerCase().includes(term) ||
        (item.treatment_name || '').toLowerCase().includes(term) ||
        String(item.id || '').toLowerCase().includes(term)

      const normalized = normalizeStatus(item.status)
      const matchStatus = filterStatus.value === 'all' || normalized === filterStatus.value
      return matchSearch && matchStatus
    })
    .slice()
    .sort((a, b) => {
      const aStatus = normalizeStatus(a.status)
      const bStatus = normalizeStatus(b.status)
      if (statusPriority[aStatus] !== statusPriority[bStatus]) {
        return statusPriority[aStatus] - statusPriority[bStatus]
      }
      if (a.booking_date !== b.booking_date) {
        return b.booking_date.localeCompare(a.booking_date)
      }
      return String(a.start_time).localeCompare(String(b.start_time))
    })
})

const statusSummary = computed(() => {
  const byStatus = (status) => bookings.value.filter((item) => normalizeStatus(item.status) === status).length
  return [
    { key: 'pending', label: 'Menunggu', count: byStatus('pending'), color: '#d97706' },
    { key: 'confirmed', label: 'Dikonfirmasi', count: byStatus('confirmed'), color: '#2563eb' },
    { key: 'completed', label: 'Selesai', count: byStatus('completed'), color: '#16a34a' },
    { key: 'cancelled', label: 'Dibatalkan', count: byStatus('cancelled'), color: '#dc2626' }
  ]
})

const loadBookings = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false })
      .order('start_time', { ascending: true })

    if (error) throw error
    bookings.value = data || []
  } catch (error) {
    console.error('Error loading bookings:', error)
    alert('Gagal memuat data reservasi')
  } finally {
    loading.value = false
  }
}

const quickUpdateStatus = async (booking, newStatus) => {
  try {
    if (newStatus === 'cancelled') {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id)

      if (error) throw error

      bookings.value = bookings.value.filter((item) => item.id !== booking.id)
      if (selectedBooking.value?.id === booking.id) {
        selectedBooking.value = null
      }
      return
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id)

    if (error) throw error

    booking.status = newStatus
    if (selectedBooking.value?.id === booking.id) {
      selectedBooking.value = { ...selectedBooking.value, status: newStatus }
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Gagal mengubah status reservasi')
  }
}

onMounted(() => {
  loadBookings()
})
</script>
