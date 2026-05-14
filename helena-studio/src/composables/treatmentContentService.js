import { supabase } from './dataService'
import haircutImg from '@/assets/HaircutTreatment.png'
import coloringImg from '@/assets/ColoringTreatment.png'
import keratinImg from '@/assets/KeratinTreament.png'
import hairdoImg from '@/assets/HairdoTreatment.png'
import makeupImg from '@/assets/MakeupTreatment.png'

const DEFAULT_ITEMS = [
  {
    slug: 'haircut',
    title: 'Haircut',
    short_description: 'Potongan rambut profesional yang disesuaikan dengan bentuk wajah dan gaya pribadi Anda.',
    description:
      'Rasakan seni pemotongan presisi dengan penata rambut ahli kami. Kami menyesuaikan teknik potong dengan struktur wajah, tekstur rambut, dan preferensi gaya Anda.',
    duration_label: '30-60 menit',
    starting_price_label: 'Mulai Rp 65.000',
    banner_image_url: haircutImg,
    benefits: [
      'Konsultasi personal untuk memahami preferensi gaya Anda',
      'Teknik pemotongan presisi dengan stylist berpengalaman',
      'Finishing dan styling agar rambut mudah ditata'
    ],
    price_variants: [
      {
        id: 'haircut-1',
        name: 'Trim & Poni',
        price: 'Rp 65.000',
        duration: '20 menit',
        description: 'Rapikan ujung rambut dan poni agar tetap segar',
        image_url: haircutImg,
        is_popular: false
      },
      {
        id: 'haircut-2',
        name: 'Short Haircut',
        price: 'Rp 75.000',
        duration: '30 menit',
        description: 'Potongan pendek dengan teknik presisi',
        image_url: haircutImg,
        is_popular: false
      },
      {
        id: 'haircut-3',
        name: 'Medium Haircut',
        price: 'Rp 85.000',
        duration: '45 menit',
        description: 'Potongan medium dengan layer sesuai bentuk wajah',
        image_url: haircutImg,
        is_popular: true
      }
    ],
    sort_order: 1,
    is_active: true
  },
  {
    slug: 'hair-coloring',
    title: 'Hair Coloring',
    short_description: 'Ubah tampilan Anda dengan teknik pewarnaan modern dan hasil warna lembut.',
    description:
      'Layanan pewarnaan dengan konsultasi tone kulit, pemilihan teknik, dan produk premium agar warna tahan lama serta tetap sehat.',
    duration_label: '60-180 menit',
    starting_price_label: 'Mulai Rp 120.000',
    banner_image_url: coloringImg,
    benefits: [
      'Konsultasi warna sesuai undertone kulit',
      'Pilihan teknik coloring modern dan natural',
      'Produk premium untuk menjaga kelembapan rambut'
    ],
    price_variants: [
      {
        id: 'hair-coloring-1',
        name: 'Toner / Gloss',
        price: 'Rp 120.000',
        duration: '60 menit',
        description: 'Refresh warna dan kilau rambut tanpa bleach',
        image_url: coloringImg,
        is_popular: false
      },
      {
        id: 'hair-coloring-2',
        name: 'Cat Dasar (Single Color)',
        price: 'Rp 150.000',
        duration: '90 menit',
        description: 'Satu warna penuh dari akar ke ujung rambut',
        image_url: coloringImg,
        is_popular: false
      },
      {
        id: 'hair-coloring-3',
        name: 'Highlight / Lowlight',
        price: 'Rp 250.000',
        duration: '120 menit',
        description: 'Dimensi warna dengan teknik foil highlight/lowlight',
        image_url: coloringImg,
        is_popular: true
      }
    ],
    sort_order: 2,
    is_active: true
  },
  {
    slug: 'hair-keratin',
    title: 'Hair Keratin Treatment',
    short_description: 'Perawatan untuk mengembalikan kilau rambut agar tetap sehat, halus, dan mudah diatur.',
    description:
      'Perawatan keratin profesional untuk melembutkan rambut, mengurangi frizz, serta memberi hasil berkilau yang tahan lama.',
    duration_label: '120-180 menit',
    starting_price_label: 'Mulai Rp 250.000',
    banner_image_url: keratinImg,
    benefits: [
      'Mengurangi rambut mengembang dan kusut',
      'Membuat rambut lebih mudah ditata',
      'Meningkatkan kilau dan kelembutan rambut'
    ],
    price_variants: [],
    sort_order: 3,
    is_active: true
  },
  {
    slug: 'hairdo',
    title: 'Hairdo',
    short_description: 'Tata rambut elegan yang disesuaikan dengan tema acara dan bentuk wajah Anda.',
    description:
      'Styling rambut untuk acara formal, photoshoot, wisuda, dan momen spesial lain dengan hasil yang tahan lama.',
    duration_label: '45-120 menit',
    starting_price_label: 'Mulai Rp 150.000',
    banner_image_url: hairdoImg,
    benefits: [
      'Konsultasi gaya sesuai acara',
      'Teknik styling profesional dan tahan lama',
      'Finishing rapi dan natural di kamera'
    ],
    price_variants: [],
    sort_order: 4,
    is_active: true
  },
  {
    slug: 'makeup',
    title: 'Makeup',
    short_description: 'Tampilan sempurna untuk setiap momen spesial dengan sentuhan makeup artist profesional.',
    description:
      'Makeup artist kami menyesuaikan look dengan karakter wajah, lighting acara, dan preferensi personal Anda.',
    duration_label: '45-120 menit',
    starting_price_label: 'Mulai Rp 200.000',
    banner_image_url: makeupImg,
    benefits: [
      'Konsultasi look sesuai karakter wajah',
      'Produk premium dan higienis',
      'Makeup tahan lama untuk acara penting'
    ],
    price_variants: [],
    sort_order: 5,
    is_active: true
  }
]

const normalizeVariant = (item = {}, index = 0, fallbackImage = '') => ({
  id: item.id || `variant-${Date.now()}-${index}`,
  name: item.name || '',
  price: item.price || '',
  duration: item.duration || '',
  description: item.description || '',
  image_url: item.image_url || fallbackImage,
  is_popular: Boolean(item.is_popular)
})

const normalizeItem = (item) => {
  const benefits = Array.isArray(item?.benefits) ? item.benefits.filter(Boolean) : []
  const fallbackImage = item?.banner_image_url || ''
  const priceVariants = Array.isArray(item?.price_variants)
    ? item.price_variants.map((variant, index) => normalizeVariant(variant, index, fallbackImage))
    : []

  return {
    slug: item.slug,
    title: item.title,
    short_description: item.short_description || '',
    description: item.description || '',
    duration_label: item.duration_label || '',
    starting_price_label: item.starting_price_label || '',
    banner_image_url: item.banner_image_url || '',
    benefits,
    price_variants: priceVariants,
    is_active: item.is_active !== false,
    sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0
  }
}

const sortByOrder = (items) => [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

export const treatmentContentService = {
  async getTreatments() {
    if (!supabase) {
      return sortByOrder(DEFAULT_ITEMS)
    }

    try {
      const { data, error } = await supabase
        .from('website_treatments')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading website_treatments:', error)
        return sortByOrder(DEFAULT_ITEMS)
      }

      const normalized = (data || []).map(normalizeItem).filter((item) => item.slug)
      if (normalized.length === 0) {
        return sortByOrder(DEFAULT_ITEMS)
      }

      return sortByOrder(normalized)
    } catch (error) {
      console.error('Unexpected error loading website_treatments:', error)
      return sortByOrder(DEFAULT_ITEMS)
    }
  },

  async getTreatmentBySlug(slug) {
    const items = await this.getTreatments()
    return items.find((item) => item.slug === slug) || null
  }
}
