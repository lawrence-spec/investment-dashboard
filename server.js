require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const app = express();
app.use(express.json({ limit: '50mb' }));

const upload = multer({ dest: '/tmp/uploads/' });

const API_KEY = process.env.NEURALSEEK_API_KEY;
const PUBLIC_URL = process.env.NEURALSEEK_PUBLIC_API_URL;
const CONSOLE_URL = process.env.NEURALSEEK_CONSOLE_API_URL;

if (!API_KEY || !PUBLIC_URL || !CONSOLE_URL) {
  console.error('Missing required environment variables: NEURALSEEK_API_KEY, NEURALSEEK_PUBLIC_API_URL, NEURALSEEK_CONSOLE_API_URL');
  process.exit(1);
}

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Upload Excel to NeuralSeek
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    const response = await fetch(`${CONSOLE_URL}/exploreUpload`, {
      method: 'POST',
      headers: { 'apikey': API_KEY },
      body: form
    });

    const data = await response.json();
    // Clean up temp file
    fs.unlinkSync(req.file.path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run the orchestrator agent
app.post('/api/generate', async (req, res) => {
  try {
    const { filename } = req.body;

    const response = await fetch(`${PUBLIC_URL}/maistro`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent: '225-Dashboard-Orchestrator',
        params: [{ name: 'excel_file', value: filename }],
        options: { returnVariables: true }
      })
    });

    const data = await response.json();

    // Extract the full_html from variables
    const dashboardHtml = data.variables?.full_html || data.answer || '';
    res.json({ html: dashboardHtml, answer: data.answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate PDF one-pager
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { filename } = req.body;

    const response = await fetch(`${PUBLIC_URL}/maistro`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent: '225-PDF-OnePager',
        params: [{ name: 'excel_file', value: filename }],
        options: { returnVariables: true }
      })
    });

    const data = await response.json();
    const pdfHtml = data.variables?.pdf_html || '';
    res.json({ html: pdfHtml, answer: data.answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download a generated file from NeuralSeek
app.get('/api/download/:filename', async (req, res) => {
  try {
    const response = await fetch(`${PUBLIC_URL}/maistro`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent: '225-PDF-OnePager',
        params: [{ name: 'excel_file', value: req.params.filename }],
        options: { returnVariables: true }
      })
    });

    const data = await response.json();
    const html = data.variables?.pdf_html || '';
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3225;
app.listen(PORT, () => {
  console.log(`Dashboard server running on http://localhost:${PORT}`);
});
