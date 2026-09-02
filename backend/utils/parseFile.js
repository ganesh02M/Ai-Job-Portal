import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");

import mammoth from "mammoth";

const extractPdfText = async (buffer) => {
  // New version (v2+): exports a PDFParse class
  if (pdfParseModule.PDFParse) {
    const parser = new pdfParseModule.PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  }

  // Old version: default export or module itself is a function
  const fn = pdfParseModule.default || pdfParseModule;
  if (typeof fn === "function") {
    const data = await fn(buffer);
    return data.text;
  }

  throw new Error("Unsupported pdf-parse module shape");
};

export const extractText = async (file) => {
  let text = "";

  if (file.mimetype === "application/pdf") {
    text = await extractPdfText(file.buffer);
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    text = result.value;
  }

  if (!text || text.trim().length < 50) {
    throw new Error(
      "Could not extract enough text. Please upload a text-based PDF/DOCX (not a scanned image)."
    );
  }

  return text.trim();
};