// services/pdfService.js
import puppeteer from 'puppeteer';

export async function generarPDFBufferDesdeHTML(html, options = {}) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' },
      ...options,
    });

    return buffer;
  } finally {
    await browser.close();
  }
}

export function enviarPDF(res, buffer, nombre = 'reporte.pdf') {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${nombre}"`);
  res.send(buffer);
}
