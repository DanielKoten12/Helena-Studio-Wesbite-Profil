import { performAnalysis } from './lib/geminiService.js';
import { validateImageUpload } from './lib/validator.js';

/**
 * Vercel Serverless Function - Analyze Face & Hair
 * POST /api/analyze
 * Body: { imageBase64, mimeType }
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

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
    const analysisResult = await performAnalysis(imageBase64, mimeType);

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
}
