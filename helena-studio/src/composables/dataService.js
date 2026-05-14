import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase tidak dikonfigurasi. Beberapa fitur mungkin tidak berfungsi.')
}

// Public client uses anon key - RLS policies akan membatasi akses
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const SALON_OPEN_HOUR = 10
const SALON_CLOSE_HOUR = 22
const HOURLY_CAPACITY = 4

const TREATMENT_DURATION_BY_NAME = {
  haircut: 60,
  haircolor: 120,
  haircoloring: 120,
  keratin: 180,
  hairkeratin: 180,
  hairkeratintreatment: 180,
  hairdo: 120,
  makeup: 60
}

const TREATMENT_MIN_DURATION_BY_NAME = {
  keratin: 180,
  hairkeratin: 180,
  hairkeratintreatment: 180
}

const normalizeText = (value) => String(value || '').toLowerCase().replace(/\s+/g, '')

const toMinutes = (timeValue) => {
  const normalized = String(timeValue || '').slice(0, 5)
  const [hour = '0', minute = '0'] = normalized.split(':')
  return Number(hour) * 60 + Number(minute)
}

const toTime = (minutes) => {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const getDurationByTreatment = (treatment) => {
  if (!treatment) return 60

  const categoryKey = normalizeText(treatment.category)
  const nameKey = normalizeText(treatment.name)
  const minDuration =
    TREATMENT_MIN_DURATION_BY_NAME[categoryKey] || TREATMENT_MIN_DURATION_BY_NAME[nameKey] || 0

  const dbDuration = Number(treatment.duration_minutes)
  if (Number.isFinite(dbDuration) && dbDuration > 0) {
    return Math.max(dbDuration, minDuration)
  }

  return TREATMENT_DURATION_BY_NAME[categoryKey] || TREATMENT_DURATION_BY_NAME[nameKey] || 60
}

const buildHourlyOccupancy = (bookings) => {
  const occupancy = {}
  bookings.forEach((booking) => {
    const startMinute = toMinutes(booking.start_time)
    const endMinute = toMinutes(booking.end_time)
    const startHour = Math.floor(startMinute / 60)
    const endHour = Math.ceil(endMinute / 60)

    for (let hour = startHour; hour < endHour; hour += 1) {
      occupancy[hour] = (occupancy[hour] || 0) + 1
    }
  })
  return occupancy
}

const normalizeTestimonialImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const transformation = 'c_fill,g_auto,w_900,h_900,q_auto,f_auto'
  return `${parts[0]}/upload/${transformation}/${parts[1]}`
}

const normalizePromoImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const transformation = 'c_fill,g_auto,w_1200,h_800,q_auto,f_auto'
  return `${parts[0]}/upload/${transformation}/${parts[1]}`
}

// API Service untuk fetch data dari Supabase
export const dataService = {
  // Promos
  async getPromos(limit = 3) {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching promos:', error)
      return []
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (data || [])
      .filter((item) => {
        if (!item.valid_until) return true
        const validUntil = new Date(item.valid_until)
        return !Number.isNaN(validUntil.getTime()) && validUntil >= today
      })
      .map((item) => ({
        ...item,
        image_url: normalizePromoImageUrl(item.image_url)
      }))
      .slice(0, limit)
  },

  // Treatments
  async getTreatments() {
    if (!supabase) return { data: [], error: 'Supabase not configured' }
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
    const normalizedData = (data || []).map((item) => ({
      ...item,
      duration_minutes: getDurationByTreatment(item)
    }))
    return { data: normalizedData, error }
  },

  async getTreatmentsByCategory(category) {
    if (!supabase) return { data: [], error: 'Supabase not configured' }
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
    const normalizedData = (data || []).map((item) => ({
      ...item,
      duration_minutes: getDurationByTreatment(item)
    }))
    return { data: normalizedData, error }
  },

  // Testimonials
  async getTestimonials() {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }
    return (data || []).map((item) => ({
      ...item,
      image_url: normalizeTestimonialImageUrl(item.image_url)
    }))
  },

  async getHomeTestimonials(limit = 10) {
    if (!supabase) return []
    const { data: treatmentRows } = await supabase
      .from('treatments')
      .select('id, category')
      .eq('is_active', true)

    const categoryByTreatmentId = new Map(
      (treatmentRows || []).map((row) => [row.id, row.category])
    )

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .not('treatment_id', 'is', null)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching home testimonials:', error)
      return []
    }

    const groupedByCategory = {
      haircut: [],
      haircolor: [],
      hairdo: [],
      keratin: [],
      makeup: [],
      others: []
    }

    ;(data || []).forEach((item) => {
      const category = categoryByTreatmentId.get(item.treatment_id)
      if (!category || !groupedByCategory[category]) {
        groupedByCategory.others.push(item)
        return
      }
      groupedByCategory[category].push(item)
    })

    // Rotate per category so Home is not dominated by one treatment type.
    const categoryOrder = ['haircut', 'haircolor', 'hairdo', 'keratin', 'makeup', 'others']
    const selected = []

    while (selected.length < limit) {
      let hasPushed = false
      for (const category of categoryOrder) {
        const queue = groupedByCategory[category]
        if (queue.length > 0) {
          selected.push(queue.shift())
          hasPushed = true
          if (selected.length >= limit) break
        }
      }
      if (!hasPushed) break
    }

    if (selected.length < limit) {
      const { data: fallbackData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .is('treatment_id', null)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      for (const item of fallbackData || []) {
        if (selected.length >= limit) break
        selected.push(item)
      }
    }

    return selected.slice(0, limit).map((item) => ({
      ...item,
      image_url: normalizeTestimonialImageUrl(item.image_url)
    }))
  },

  async getTestimonialsByTreatment(treatmentName) {
    if (!supabase) return []
    
    // Pertama, dapatkan treatment ID berdasarkan category atau nama
    // Normalize nama untuk matching
    const normalizedName = treatmentName.toLowerCase().replace(/\s+/g, '')
    let categoryMapping = {
      'haircut': 'haircut',
      'haircoloring': 'haircolor',
      'keratin': 'keratin',
      'hairdo': 'hairdo',
      'makeup': 'makeup'
    }
    
    const category = categoryMapping[normalizedName]
    
    if (!category) {
      console.warn('Unknown treatment:', treatmentName)
      return []
    }
    
    // Dapatkan semua treatments dengan category tersebut
    const { data: treatments, error: treatmentError } = await supabase
      .from('treatments')
      .select('id')
      .eq('category', category)
    
    if (treatmentError || !treatments || treatments.length === 0) {
      console.error('Error fetching treatments:', treatmentError)
      return []
    }
    
    // Dapatkan testimoni untuk semua treatment dengan category tersebut
    const treatmentIds = treatments.map(t => t.id)
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .in('treatment_id', treatmentIds)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching treatment testimonials:', error)
      return []
    }
    return (data || []).map((item) => ({
      ...item,
      image_url: normalizeTestimonialImageUrl(item.image_url)
    }))
  },

  // Certificates
  async getCertificates() {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching certificates:', error)
      return []
    }
    return data || []
  },

  // Website Images
  async getImages(section) {
    if (!supabase) return { data: [], error: 'Supabase not configured' }
    const query = supabase
      .from('website_images')
      .select('*')
      .eq('is_active', true)
    
    if (section) {
      query.eq('section', section)
    }
    
    const { data, error } = await query
    return { data: data || [], error }
  },

  async getImageByKey(section, imageKey) {
    if (!supabase) return { data: null, error: 'Supabase not configured' }
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('section', section)
      .eq('image_key', imageKey)
      .eq('is_active', true)
      .single()
    return { data, error }
  },

  // Bookings
  async getAvailableSlots(date, treatmentId, fallbackServiceName = '') {
    if (!supabase) return { data: [], error: 'Supabase not configured' }

    let treatment = null
    if (treatmentId) {
      const { data } = await supabase
        .from('treatments')
        .select('id, name, category, duration_minutes')
        .eq('id', treatmentId)
        .single()

      treatment = data || null
    }

    const fallbackDuration = TREATMENT_DURATION_BY_NAME[normalizeText(fallbackServiceName)] || 60
    const durationMinutes = treatment ? getDurationByTreatment(treatment) : fallbackDuration
    const durationHours = Math.max(1, Math.ceil(durationMinutes / 60))

    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed'])

    const occupancy = buildHourlyOccupancy(bookings || [])

    const slots = []

    for (let startHour = SALON_OPEN_HOUR; startHour <= SALON_CLOSE_HOUR - durationHours; startHour += 1) {
      const coveredHours = []
      for (let hour = startHour; hour < startHour + durationHours; hour += 1) {
        coveredHours.push(hour)
      }

      const occupiedCounts = coveredHours.map((hour) => occupancy[hour] || 0)
      const maxOccupied = Math.max(...occupiedCounts, 0)
      const spotsLeft = Math.max(0, HOURLY_CAPACITY - maxOccupied)
      const isAvailable = coveredHours.every((hour) => (occupancy[hour] || 0) < HOURLY_CAPACITY)

      slots.push({
        time: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(startHour + durationHours).padStart(2, '0')}:00`,
        available: isAvailable,
        spotsLeft,
        durationHours
      })
    }

    return { data: slots, error: null }
  },

  async createBooking(bookingData) {
    if (!supabase) return { data: null, error: 'Supabase not configured' }

    const startMinute = toMinutes(bookingData.start_time)
    const endMinute = toMinutes(bookingData.end_time)
    const startHour = Math.floor(startMinute / 60)
    const endHour = Math.ceil(endMinute / 60)

    if (startHour < SALON_OPEN_HOUR || endHour > SALON_CLOSE_HOUR) {
      return { data: null, error: { message: 'Jam reservasi di luar jam operasional salon' } }
    }

    const { data: existingBookings, error: existingError } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('booking_date', bookingData.booking_date)
      .in('status', ['pending', 'confirmed'])

    if (existingError) {
      return { data: null, error: existingError }
    }

    const occupancy = buildHourlyOccupancy(existingBookings || [])
    for (let hour = startHour; hour < endHour; hour += 1) {
      if ((occupancy[hour] || 0) >= HOURLY_CAPACITY) {
        return { data: null, error: { message: 'Slot jam tersebut sudah penuh. Silakan pilih jam lain.' } }
      }
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'pending',
        created_by: 'customer'
      }])
      .select()
      .single()
    return { data, error }
  },

  // Settings
  async getSettings() {
    if (!supabase) return { data: {}, error: 'Supabase not configured' }
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
    
    const settings = {}
    data?.forEach(s => settings[s.key] = s.value)
    return { data: settings, error }
  }
}
