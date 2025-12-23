/**
 * API Service for calling backend endpoints
 * Handles communication between frontend and backend API server
 */

// Use environment variable for backend URL
// For development: http://localhost:3000
// For production: Your Railway/Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Perform face and hair analysis
 * @param {string} imageBase64 - Base64 encoded image data (without data:image prefix)
 * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
 * @returns {Promise<string>} - Analysis text result
 */
export const performAnalysis = async (imageBase64, mimeType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType
      })
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to analyze image';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to analyze image');
    }

    return result.data.analysis;
  } catch (error) {
    console.error('API Error - performAnalysis:', error);
    throw new Error(error.message || 'Gagal menganalisa foto. Pastikan wajah terlihat jelas dan coba lagi.');
  }
};

/**
 * Generate hairstyle image
 * @param {string} prompt - Image generation prompt
 * @param {string} imageSize - Image size ('1K', '2K', '4K')
 * @param {string} userImageBase64 - User's base64 image with data URI
 * @param {string} userImageMimeType - User's image MIME type
 * @returns {Promise<string>} - Generated image data URL
 */
export const generateImage = async (prompt, imageSize = '1K', userImageBase64, userImageMimeType) => {
  try {
    // Extract base64 data if it includes data URI prefix
    const base64Data = userImageBase64.includes(',') 
      ? userImageBase64.split(',')[1] 
      : userImageBase64;

    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        imageSize,
        userImageBase64: base64Data,
        userImageMimeType
      })
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to generate image';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate image');
    }

    return result.data.imageUrl;
  } catch (error) {
    console.error('API Error - generateImage:', error);
    throw new Error(error.message || 'Gagal membuat gambar. Silakan coba lagi.');
  }
};
