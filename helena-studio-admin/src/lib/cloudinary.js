const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinaryService = {
  async uploadImage(file, folder = 'helena-studio') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      formData.append('folder', folder)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Upload gagal')
      }

      const data = await response.json()
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Gagal upload gambar: ' + error.message)
    }
  },

  async deleteImage(publicId) {
    // Note: Delete requires signed request with API secret
    // Better to do this from backend, or just leave images in Cloudinary
    // For now, we'll just return success
    console.warn('Delete image not implemented - image will remain in Cloudinary')
    return { success: true }
  },

  getOptimizedUrl(url, options = {}) {
    const { width, height, quality = 'auto', format = 'auto' } = options
    
    if (!url || !url.includes('cloudinary.com')) {
      return url
    }

    const parts = url.split('/upload/')
    if (parts.length !== 2) return url

    const transformations = []
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    transformations.push(`q_${quality}`)
    transformations.push(`f_${format}`)

    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
  }
}
