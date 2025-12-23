/**
 * Validate image data from request
 * @param {Object} body - Request body
 * @returns {Object} - Validated data or error
 */
export const validateImageUpload = (body) => {
  const { imageBase64, mimeType } = body;

  // Check if required fields exist
  if (!imageBase64 || !mimeType) {
    return {
      valid: false,
      error: 'Missing required fields: imageBase64 and mimeType are required'
    };
  }

  // Validate mime type
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validMimeTypes.includes(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid image format. Allowed formats: JPEG, PNG, WEBP'
    };
  }

  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  const base64Data = imageBase64.includes(',') 
    ? imageBase64.split(',')[1] 
    : imageBase64;

  if (!base64Regex.test(base64Data)) {
    return {
      valid: false,
      error: 'Invalid base64 image data'
    };
  }

  // Check image size (max 10MB)
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (sizeInBytes > maxSize) {
    return {
      valid: false,
      error: 'Image size exceeds 10MB limit'
    };
  }

  return {
    valid: true,
    data: {
      imageBase64: base64Data,
      mimeType
    }
  };
};

/**
 * Validate image generation request
 * @param {Object} body - Request body
 * @returns {Object} - Validated data or error
 */
export const validateImageGeneration = (body) => {
  const { prompt, imageSize, userImageBase64, userImageMimeType } = body;

  // Check required fields
  if (!prompt || !userImageBase64 || !userImageMimeType) {
    return {
      valid: false,
      error: 'Missing required fields: prompt, userImageBase64, and userImageMimeType are required'
    };
  }

  // Validate prompt length
  if (typeof prompt !== 'string' || prompt.length < 10 || prompt.length > 5000) {
    return {
      valid: false,
      error: 'Prompt must be between 10 and 5000 characters'
    };
  }

  // Validate image size parameter
  const validSizes = ['1K', '2K', '4K'];
  const size = imageSize || '1K';
  if (!validSizes.includes(size)) {
    return {
      valid: false,
      error: 'Invalid image size. Allowed: 1K, 2K, 4K'
    };
  }

  // Validate user image
  const imageValidation = validateImageUpload({
    imageBase64: userImageBase64,
    mimeType: userImageMimeType
  });

  if (!imageValidation.valid) {
    return imageValidation;
  }

  return {
    valid: true,
    data: {
      prompt,
      imageSize: size,
      userImageBase64: imageValidation.data.imageBase64,
      userImageMimeType
    }
  };
};
