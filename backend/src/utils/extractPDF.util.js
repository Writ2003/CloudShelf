import fs from 'fs';
import pdfParse from 'pdf-parse';

// Helper function to format plain text to HTML (basic)
const formatToHTML = (text) => {
  const pages = text.split('\f'); // Page breaks
  return pages.map(page => {
    const paragraphs = page
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, ' ')}</p>`)
      .join('');
    return paragraphs;
  });
}

export const processPDF = async(filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('PDF file not found at ' + filePath);
  }
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const htmlPages = formatToHTML(data.text);
  return htmlPages;
}

