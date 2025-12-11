export const parseAnalysisResponse = (text) => {
  const analysis = {};
  const recommendations = [];

  try {
    const diagnosisSection = text.split('## 🔍 HASIL DIAGNOSA')[1]?.split('---')[0] || '';
    analysis.faceShape = diagnosisSection.match(/\* \*\*Bentuk Wajah:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A';
    analysis.hairType = diagnosisSection.match(/\* \*\*Jenis Rambut:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A';
    analysis.hairLength = diagnosisSection.match(/\* \*\*Panjang Rambut:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A';
    analysis.stylistNotes = diagnosisSection.match(/\*Catatan Stylist:\s*([\s\S]*)/)?.[1]?.trim() || 'N/A';

    const recommendationsSection = text.split('## ✂️ 3 REKOMENDASI GAYA RAMBUT')[1] || '';
    const recBlocks = recommendationsSection.split('### Opsi').slice(1);

    recBlocks.forEach((block) => {
      const optionMatch = block.match(/^ (\d+): (.*)/);
      if (!optionMatch) return;

      const option = `Opsi ${optionMatch[1]}`;
      const styleName = optionMatch[2].trim();
      const suitability = block.match(/\* \*\*Kenapa Cocok:\*\*\s*([\s\S]*?)(?=\* \*\*Prompt Visual \(Copy ke Nano Banana\):)/)?.[1]?.trim() || 'N/A';
      const promptMatch = block.match(/`([\s\S]*?)`/);
      const prompt = promptMatch ? promptMatch[1].trim() : 'N/A';
      
      recommendations.push({
        option,
        styleName,
        suitability,
        prompt,
      });
    });

    if (!analysis.faceShape || recommendations.length < 3) {
      console.warn("Parsing may have failed. Extracted data:", { analysis, recommendations });
    }
    
    return {
      analysis,
      recommendations,
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Could not understand the response from the AI. Please try again.");
  }
};
