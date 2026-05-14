<template>
  <div>
    <div class="topbar">
      <h1 class="topbar-title">Dashboard</h1>
      <div class="topbar-actions">
        <div class="user-info">
          <UserRound :size="16" />
          <span>{{ authStore.user?.username }}</span>
        </div>
      </div>
    </div>

    <div
      class="card"
      style="background: linear-gradient(90deg, #544771 0%, #c2b1d6 100%); color: white; border: none;"
    >
      <div class="flex justify-between items-center" style="gap: 1rem;">
        <div>
          <h2 style="font-size: 1.6rem; color: white;">Selamat Datang Kembali!</h2>
          <p style="font-size: 0.9rem; margin-top: 0.2rem; color: rgba(255, 255, 255, 0.9);">
            {{ todayLabel }} · Ada {{ todayStats.pending }} reservasi yang menunggu konfirmasi.
          </p>
        </div>
        <div
          style="background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 0.5rem 0.8rem; font-size: 0.82rem; white-space: nowrap; display: inline-flex; align-items: center; gap: 0.4rem;"
        >
          <Clock3 :size="14" />
          <span>Update: {{ currentTimeLabel }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-4">
      <div class="card">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #dbeafe; display: flex; align-items: center; justify-content: center; color: #2563eb;">
            <CalendarDays :size="24" />
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--text-light);">Booking Hari Ini</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--text);">{{ todayStats.total }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; color: #16a34a;">
            <CheckCircle2 :size="24" />
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--text-light);">Confirmed</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--success);">{{ todayStats.confirmed }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; color: #d97706;">
            <Clock3 :size="24" />
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--text-light);">Pending</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--warning);">{{ todayStats.pending }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #ede9fe; display: flex; align-items: center; justify-content: center; color: #4f46e5;">
            <Wallet :size="24" />
          </div>
          <div>
            <div style="font-size: 0.875rem; color: var(--text-light);">Revenue Hari Ini</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--text);">{{ formatCurrency(todayStats.revenue) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="margin-bottom: 0.8rem;">
        <div>
          <h2 class="card-title">Jadwal Harian</h2>
          <p style="font-size: 0.8rem; color: var(--text-faint); margin-top: 0.2rem;">
            Visualisasi kapasitas slot dan booking per jam (maks. 4 orang/jam)
          </p>
        </div>

        <div class="topbar-actions" style="gap: 0.45rem;">
          <button class="btn btn-outline btn-sm" @click="shiftDate(-1)">
            <ChevronLeft :size="14" />
          </button>

          <input v-model="timelineDate" type="date" class="form-input" style="max-width: 180px;" />

          <button class="btn btn-outline btn-sm" @click="shiftDate(1)">
            <ChevronRight :size="14" />
          </button>

          <button v-if="timelineDate !== todayDate" class="btn btn-outline btn-sm" @click="timelineDate = todayDate">
            Hari Ini
          </button>
        </div>
      </div>

      <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 0.8rem;">
        <span style="background: #544771; color: #fff; border-radius: 999px; padding: 0.26rem 0.62rem; font-size: 0.76rem; font-weight: 500;">
          {{ selectedDateLabelShort }}
        </span>
        <span style="color: var(--text-light); font-size: 0.82rem;">Jam operasional: 10:00 - 22:00 WIB</span>
        <span style="color: var(--text-light); font-size: 0.82rem;">{{ timelineBookings.length }} reservasi aktif</span>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
        <span
          v-for="service in timelineServiceLegend"
          :key="service.key"
          :style="{ background: service.bg, color: service.color }"
          style="border-radius: 999px; padding: 0.2rem 0.5rem; font-size: 0.72rem; font-weight: 500;"
        >
          {{ service.name }} ({{ service.count }})
        </span>
      </div>

      <div ref="timelineContainer" style="border: 1px solid #f0f0f0; border-radius: 14px; overflow-x: auto; background: #fff;">
        <div :style="{ minWidth: `${timelineHours.length * hourPixelWidth}px`, width: '100%' }">
          <div style="display: flex; border-bottom: 1px solid #f0f0f0; background: #fafafa; height: 38px;">
            <div
              v-for="hour in timelineHours"
              :key="`hour-head-${hour}`"
              :style="{ width: `${hourPixelWidth}px` }"
              style="border-right: 1px solid #f0f0f0; font-size: 0.76rem; color: #6b7280; display: flex; align-items: center; justify-content: center; font-weight: 600;"
            >
              {{ String(hour).padStart(2, '0') }}.00
            </div>
          </div>

          <div v-if="timelineBookings.length === 0" style="text-align: center; color: var(--text-light); padding: 1.2rem 0; font-size: 0.88rem;">
            Belum ada reservasi aktif pada tanggal ini.
          </div>

          <div
            v-else
            :style="{ height: `${timelineBookings.length * 46 + 10}px` }"
            style="position: relative;"
          >
            <div
              v-for="(hour, index) in timelineHours"
              :key="`line-${hour}`"
              :style="{ left: `${index * hourPixelWidth}px` }"
              style="position: absolute; top: 0; bottom: 0; border-right: 1px dashed #e5e7eb;"
            ></div>

            <button
              v-for="(item, itemIndex) in timelineBookings"
              :key="item.id"
              type="button"
              @click="selectedBooking = item.raw"
              :style="{
                left: `${item.leftPx}px`,
                width: `${item.widthPx}px`,
                top: `${itemIndex * 46 + 6}px`,
                background: item.serviceBg,
                borderLeft: `3px solid ${item.serviceColor}`
              }"
              style="position: absolute; height: 38px; border-radius: 10px; color: #1f2937; border-top: none; border-right: none; border-bottom: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 0 0.62rem; gap: 0.48rem;"
              :title="item.tooltip"
            >
              <span style="min-width: 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 0.76rem; font-weight: 600; text-align: left;">
                {{ item.shortLabel }}
              </span>
              <span :style="{ background: item.statusColor }" style="width: 7px; height: 7px; border-radius: 999px; flex-shrink: 0;"></span>
            </button>
          </div>

          <div style="border-top: 1px solid #f0f0f0; background: #fafafa;">
            <div style="display: flex; height: 50px;">
              <div
                v-for="hour in timelineHours"
                :key="`cap-${hour}`"
                :style="{ width: `${hourPixelWidth}px` }"
                style="border-right: 1px solid #f0f0f0; padding: 0.42rem 0.4rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.28rem;"
              >
                <div style="width: 100%; height: 4px; border-radius: 999px; background: #e5e7eb; overflow: hidden;">
                  <div
                    :style="{
                      width: `${Math.min(100, ((hourlyCounts[hour] || 0) / 4) * 100)}%`,
                      background: hourOccupancyBarColor(hour)
                    }"
                    style="height: 100%; border-radius: 999px;"
                  ></div>
                </div>
                <span :style="{ color: hourOccupancyTextColor(hour) }" style="font-size: 0.7rem; font-weight: 600;">
                  {{ hourlyCounts[hour] || 0 }}/4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem; align-items: center;">
        <span style="display: inline-flex; align-items: center; gap: 0.36rem; font-size: 0.74rem; color: #6b7280;"><span style="width: 7px; height: 7px; border-radius: 999px; background: #d97706;"></span>Menunggu</span>
        <span style="display: inline-flex; align-items: center; gap: 0.36rem; font-size: 0.74rem; color: #6b7280;"><span style="width: 7px; height: 7px; border-radius: 999px; background: #2563eb;"></span>Dikonfirmasi</span>
        <span style="display: inline-flex; align-items: center; gap: 0.36rem; font-size: 0.74rem; color: #6b7280;"><span style="width: 7px; height: 7px; border-radius: 999px; background: #16a34a;"></span>Selesai</span>
        <span style="display: inline-flex; align-items: center; gap: 0.36rem; font-size: 0.74rem; color: #6b7280;"><span style="width: 7px; height: 7px; border-radius: 999px; background: #dc2626;"></span>Dibatalkan</span>
        <span style="margin-left: auto; font-size: 0.72rem; color: #9ca3af;">Slot penuh (kapasitas 4/4)</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Booking Hari Ini</h2>
        <router-link to="/bookings" class="btn btn-primary btn-sm">
          Lihat Semua
        </router-link>
      </div>

      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>

      <div v-else-if="todayBookings.length === 0" style="text-align: center; padding: 2rem; color: var(--text-light);">
        Belum ada booking hari ini
      </div>

      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Nama Customer</th>
              <th>Treatment</th>
              <th>Telepon</th>
              <th>Status</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in todayBookings" :key="booking.id">
              <td>
                <strong>{{ booking.start_time.slice(0, 5) }}</strong> - {{ booking.end_time.slice(0, 5) }}
              </td>
              <td>{{ booking.customer_name }}</td>
              <td>{{ booking.treatment_name }}</td>
              <td>{{ booking.customer_phone }}</td>
              <td>
                <span class="badge" :class="{
                  'badge-success': normalizeStatus(booking.status) === 'confirmed',
                  'badge-warning': normalizeStatus(booking.status) === 'pending',
                  'badge-info': normalizeStatus(booking.status) === 'completed',
                  'badge-error': normalizeStatus(booking.status) === 'cancelled'
                }">
                  {{ statusLabel[normalizeStatus(booking.status)] }}
                </span>
              </td>
              <td>{{ formatCurrency(booking.price) }}</td>
              <td>
                <button class="btn btn-outline btn-sm" @click="selectedBooking = booking" title="Lihat detail">
                  <Eye :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedBooking" class="modal-overlay" @click.self="selectedBooking = null">
      <div class="modal" style="max-width: 560px;">
        <div class="modal-header" style="border-bottom: none; padding-bottom: 0.35rem;">
          <h2 class="modal-title" style="font-size: 1.95rem; line-height: 1;">Detail Reservasi</h2>
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
            <span class="badge" :class="{
              'badge-success': normalizeStatus(selectedBooking.status) === 'confirmed',
              'badge-warning': normalizeStatus(selectedBooking.status) === 'pending',
              'badge-info': normalizeStatus(selectedBooking.status) === 'completed',
              'badge-error': normalizeStatus(selectedBooking.status) === 'cancelled'
            }">
              {{ statusLabel[normalizeStatus(selectedBooking.status)] }}
            </span>
          </div>
        </div>

        <div class="modal-footer" style="border-top: none; padding-top: 0.7rem; justify-content: space-between;">
          <div style="display: flex; gap: 0.5rem;">
            <button
              v-if="normalizeStatus(selectedBooking.status) === 'pending'"
              class="btn btn-primary"
              style="min-width: 140px;"
              @click="updateBookingStatus(selectedBooking, 'confirmed')"
            >
              Konfirmasi
            </button>
            <button
              v-if="normalizeStatus(selectedBooking.status) === 'confirmed'"
              class="btn"
              style="min-width: 160px; background: #16a34a; color: #fff;"
              @click="updateBookingStatus(selectedBooking, 'completed')"
            >
              Selesai Nyalon
            </button>
          </div>
          <button class="btn btn-outline" style="min-width: 120px;" @click="selectedBooking = null">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  UserRound,
  Wallet,
  X
} from 'lucide-vue-next'

const authStore = useAuthStore()
const loading = ref(true)
const todayBookings = ref([])
const timelineBookingsSource = ref([])
const selectedBooking = ref(null)
const timelineContainer = ref(null)
const timelineContainerWidth = ref(0)
let timelineResizeObserver = null
let useWindowResize = false

const toLocalDateInput = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().split('T')[0]
}

const todayDate = toLocalDateInput()
const timelineDate = ref(todayDate)

const todayLabel = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const currentTimeLabel = new Date().toLocaleTimeString('id-ID', {
  hour: '2-digit',
  minute: '2-digit'
})

const statusLabel = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan'
}

const statusColor = {
  pending: '#d97706',
  confirmed: '#2563eb',
  completed: '#16a34a',
  cancelled: '#dc2626'
}

const serviceStyles = {
  haircut: { name: 'Haircut', bg: '#ece8f4', color: '#544771' },
  haircolor: { name: 'Hair Coloring', bg: '#e0e7ff', color: '#6366f1' },
  keratin: { name: 'Hair Keratin Treatment', bg: '#d1fae5', color: '#10b981' },
  hairdo: { name: 'Hairdo', bg: '#fef3c7', color: '#d97706' },
  makeup: { name: 'Makeup', bg: '#fce7f3', color: '#ec4899' },
  others: { name: 'Lainnya', bg: '#e5e7eb', color: '#6b7280' }
}

const timelineStartHour = 10
const timelineEndHour = 22
const serviceDurationMinutes = {
  haircut: 60,
  haircolor: 120,
  keratin: 180,
  hairdo: 120,
  makeup: 60,
  others: 60
}

const normalizeStatus = (status) => {
  const raw = String(status || '').toLowerCase().trim()
  if (raw === 'pending' || raw === 'menunggu') return 'pending'
  if (raw === 'confirmed' || raw === 'dikonfirmasi') return 'confirmed'
  if (raw === 'completed' || raw === 'selesai') return 'completed'
  if (raw === 'cancelled' || raw === 'dibatalkan') return 'cancelled'
  return 'pending'
}

const normalizeServiceKey = (name) => {
  const raw = String(name || '').toLowerCase().replace(/\s+/g, '')
  if (raw.includes('haircut')) return 'haircut'
  if (raw.includes('haircolor')) return 'haircolor'
  if (raw.includes('keratin')) return 'keratin'
  if (raw.includes('hairdo')) return 'hairdo'
  if (raw.includes('makeup')) return 'makeup'
  return 'others'
}

const isActiveBooking = (booking) => normalizeStatus(booking.status) !== 'cancelled'

const todayStats = computed(() => {
  const activeBookings = todayBookings.value.filter(isActiveBooking)
  const total = activeBookings.length
  const confirmed = activeBookings.filter((b) => normalizeStatus(b.status) === 'confirmed').length
  const pending = activeBookings.filter((b) => normalizeStatus(b.status) === 'pending').length
  const revenue = activeBookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0)

  return { total, confirmed, pending, revenue }
})

const timelineHours = computed(() => {
  const hours = []
  for (let hour = timelineStartHour; hour < timelineEndHour; hour += 1) {
    hours.push(hour)
  }
  return hours
})

const hourPixelWidth = computed(() => {
  const hoursCount = timelineHours.value.length || 1
  const baseWidth = Math.floor((timelineContainerWidth.value || 0) / hoursCount)
  return Math.max(80, baseWidth || 0)
})

const selectedDateLabelShort = computed(() => {
  return new Date(`${timelineDate.value}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

const toMinutes = (time) => {
  const raw = String(time || '').slice(0, 5)
  const [hour = '0', minute = '0'] = raw.split(':')
  return Number(hour) * 60 + Number(minute)
}

const bookingDurationMinutes = (booking) => {
  const byData = Number(booking?.duration_minutes)
  if (Number.isFinite(byData) && byData > 0) {
    return byData
  }

  const serviceKey = normalizeServiceKey(booking?.treatment_name)
  return serviceDurationMinutes[serviceKey] || serviceDurationMinutes.others
}

const effectiveEndMinutes = (booking) => {
  const start = toMinutes(booking?.start_time)
  const rawEnd = toMinutes(booking?.end_time)
  const expectedEnd = start + bookingDurationMinutes(booking)

  // Protect old/inconsistent records where end_time is shorter than treatment duration.
  return Math.max(rawEnd, expectedEnd)
}

const toTimeLabel = (minutes) => {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const hourlyCounts = computed(() => {
  const counts = {}
  timelineBookingsSource.value.filter(isActiveBooking).forEach((booking) => {
    const startHour = Math.floor(toMinutes(booking.start_time) / 60)
    const endHour = Math.ceil(effectiveEndMinutes(booking) / 60)
    for (let hour = startHour; hour < endHour; hour += 1) {
      counts[hour] = (counts[hour] || 0) + 1
    }
  })
  return counts
})

const hourOccupancyBarColor = (hour) => {
  const value = hourlyCounts.value[hour] || 0
  if (value >= 4) return '#ef4444'
  if (value >= 3) return '#f59e0b'
  if (value >= 1) return '#6a5b8b'
  return '#d1d5db'
}

const hourOccupancyTextColor = (hour) => {
  const value = hourlyCounts.value[hour] || 0
  if (value >= 4) return '#ef4444'
  if (value >= 1) return '#544771'
  return '#9ca3af'
}

const timelineBookings = computed(() => {
  return timelineBookingsSource.value
    .filter(isActiveBooking)
    .slice()
    .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)) || String(a.customer_name).localeCompare(String(b.customer_name)))
    .map((booking) => {
      const start = toMinutes(booking.start_time)
      const end = effectiveEndMinutes(booking)
      const clampedStart = Math.max(start, timelineStartHour * 60)
      const clampedEnd = Math.min(end, timelineEndHour * 60)
      const leftPx = ((clampedStart - timelineStartHour * 60) / 60) * hourPixelWidth.value + 2
      const widthPx = Math.max(86, ((clampedEnd - clampedStart) / 60) * hourPixelWidth.value - 5)
      const normalizedStatus = normalizeStatus(booking.status)
      const serviceKey = normalizeServiceKey(booking.treatment_name)
      const serviceStyle = serviceStyles[serviceKey] || serviceStyles.others
      const effectiveEnd = toTimeLabel(end)

      return {
        id: booking.id,
        raw: booking,
        shortLabel: `${booking.customer_name} · ${booking.treatment_name}`,
        tooltip: `${booking.customer_name} · ${booking.treatment_name} · ${String(booking.start_time).slice(0, 5)}-${effectiveEnd} WIB`,
        leftPx,
        widthPx,
        statusColor: statusColor[normalizedStatus] || '#6b7280',
        serviceBg: serviceStyle.bg,
        serviceColor: serviceStyle.color,
        serviceKey
      }
    })
})

const updateTimelineWidth = () => {
  if (!timelineContainer.value) return
  timelineContainerWidth.value = timelineContainer.value.clientWidth
}

onMounted(() => {
  updateTimelineWidth()
  if (typeof ResizeObserver !== 'undefined') {
    timelineResizeObserver = new ResizeObserver(() => updateTimelineWidth())
    timelineResizeObserver.observe(timelineContainer.value)
  } else {
    useWindowResize = true
    window.addEventListener('resize', updateTimelineWidth)
  }
})

onBeforeUnmount(() => {
  if (timelineResizeObserver) {
    timelineResizeObserver.disconnect()
  }
  if (useWindowResize) {
    window.removeEventListener('resize', updateTimelineWidth)
  }
})

const timelineServiceLegend = computed(() => {
  const counts = {}
  timelineBookings.value.forEach((booking) => {
    counts[booking.serviceKey] = (counts[booking.serviceKey] || 0) + 1
  })

  return Object.keys(counts).map((key) => ({
    key,
    name: serviceStyles[key]?.name || 'Lainnya',
    count: counts[key],
    bg: serviceStyles[key]?.bg || serviceStyles.others.bg,
    color: serviceStyles[key]?.color || serviceStyles.others.color
  }))
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
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

const patchBookingInArray = (arrayRef, bookingId, newStatus) => {
  arrayRef.value = arrayRef.value.map((item) => {
    if (item.id !== bookingId) return item
    return { ...item, status: newStatus }
  })
}

const updateBookingStatus = async (booking, newStatus) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id)

    if (error) throw error

    patchBookingInArray(todayBookings, booking.id, newStatus)
    patchBookingInArray(timelineBookingsSource, booking.id, newStatus)
    selectedBooking.value = { ...selectedBooking.value, status: newStatus }
  } catch (error) {
    console.error('Error updating booking status:', error)
    alert('Gagal mengubah status reservasi')
  }
}

const shiftDate = (days) => {
  const base = new Date(`${timelineDate.value}T00:00:00`)
  base.setDate(base.getDate() + days)
  timelineDate.value = toLocalDateInput(base)
}

const loadTodayBookings = async () => {
  try {
    loading.value = true

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', todayDate)
      .order('start_time', { ascending: true })

    if (error) throw error
    todayBookings.value = data || []
  } catch (error) {
    console.error('Error loading bookings:', error)
    alert('Gagal memuat data booking')
  } finally {
    loading.value = false
  }
}

const loadTimelineBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', timelineDate.value)
      .order('start_time', { ascending: true })

    if (error) throw error
    timelineBookingsSource.value = data || []
  } catch (error) {
    console.error('Error loading timeline bookings:', error)
  }
}

watch(timelineDate, () => {
  loadTimelineBookings()
})

onMounted(() => {
  loadTodayBookings()
  loadTimelineBookings()
})
</script>
