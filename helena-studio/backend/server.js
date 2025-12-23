import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { performAnalysis, generateImage } from './lib/geminiService.js';
import { validateImageUpload, validateImageGeneration } from './lib/validator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Helena Studio Backend API',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// POST /api/analyze - Analyze face and hair
app.post('/api/analyze', async (req, res) => {
  try {
    // Validate input
    const validation = validateImageUpload(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { imageBase64, mimeType } = validation.data;

    // Perform analysis
    console.log('Starting face analysis...');
    const analysisResult = await performAnalysis(imageBase64, mimeType);
    console.log('Analysis completed successfully');

    return res.status(200).json({
      success: true,
      data: {
        analysis: analysisResult
      }
    });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image. Please try again.'
    });
  }
});

// POST /api/generate-image - Generate hairstyle image
app.post('/api/generate-image', async (req, res) => {
  try {
    // Validate input
    const validation = validateImageGeneration(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { prompt, imageSize, userImageBase64, userImageMimeType } = validation.data;

    // Generate image
    console.log('Starting image generation...');
    const generatedImageUrl = await generateImage(
      prompt, 
      imageSize, 
      userImageBase64, 
      userImageMimeType
    );
    console.log('Image generation completed');

    return res.status(200).json({
      success: true,
      data: {
        imageUrl: generatedImageUrl
      }
    });

  } catch (error) {
    console.error('Error in /api/generate-image:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image. Please try again.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Helena Studio Backend API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});
