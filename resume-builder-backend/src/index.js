const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

function wrapHtml(html) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; margin: 0; }
    h1, h2, h3 { margin: 1rem 0 0.5rem; }
    p, ul { margin: 0.5rem 0; }
    ul { padding-left: 1.5rem; }
  </style>
</head>
<body>${html}</body>
</html>`;
}

app.post('/api/pdf', async (req, res) => {
  const { html } = req.body;
  if (!html || typeof html !== 'string') {
    res.status(400).json({ error: 'HTML content required' });
    return;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    const page = await browser.newPage();
    const fullHtml = html.trim().startsWith('<!') ? html : wrapHtml(html);
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    await browser.close();

    const base64 = Buffer.from(pdf).toString('base64');
    res.json({ pdf: base64 });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ error: err?.message ?? 'PDF generation failed' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
