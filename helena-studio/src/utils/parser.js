export const parseAnalysisResponse = (text) => {
  const analysis = {};
  const recommendations = [];

  try {
    const diagnosisMatch = text.match(
      /##\s*(?:🔍\s*)?HASIL\s*(?:DIAGNOSA|ANALISIS)\s*([\s\S]*?)(?=##\s*(?:✂️\s*)?3\s*REKOMENDASI\s*GAYA\s*RAMBUT|##\s*(?:✂️\s*)?REKOMENDASI|$)/i
    );
    const diagnosisSection = diagnosisMatch ? diagnosisMatch[1] : '';

    analysis.faceShape = diagnosisSection.match(/\*\s*\*\*Bentuk Wajah:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A';
    analysis.hairType = diagnosisSection.match(/\*\s*\*\*Jenis Rambut:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A';
    analysis.hairLength = diagnosisSection.match(/\*\s*\*\*Panjang Rambut:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A';
    analysis.stylistNotes = diagnosisSection.match(/\*\s*Catatan Stylist:\s*([\s\S]*)/)?.[1]?.trim() || 'N/A';

    const recommendationsMatch = text.match(/##\s*(?:✂️\s*)?3\s*REKOMENDASI\s*GAYA\s*RAMBUT\s*([\s\S]*)/i);
    const recommendationsSection = recommendationsMatch ? recommendationsMatch[1] : '';
    const recBlocks = recommendationsSection.split(/###\s*Opsi\s*/i).slice(1);

    recBlocks.forEach((block) => {
      const optionMatch = block.match(/^(\d+)\s*:\s*(.*)/);
      if (!optionMatch) return;

      const option = `Opsi ${optionMatch[1]}`;
      const styleName = optionMatch[2].trim();
      const suitability = block.match(/\*\s*\*\*Kenapa Cocok:\*\*\s*([\s\S]*?)(?=\*\s*\*\*Prompt Visual)/i)?.[1]?.trim() || 'N/A';
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
