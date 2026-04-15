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
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

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

// Generate PDF from the already-rendered dashboard HTML.
// Frontend sends the full HTML — agent just pipes it through createPDF. No LLM needed.
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { html_content } = req.body;

    if (!html_content || html_content.length < 100) {
      return res.status(400).json({ error: 'No HTML content provided' });
    }

    // Step 1: Send HTML to the simple converter agent (text → createPDF)
    const agentResponse = await fetch(`${PUBLIC_URL}/maistro`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent: '225-HTML-to-PDF',
        params: [{ name: 'html_content', value: html_content }],
        options: { returnVariables: true }
      })
    });

    if (!agentResponse.ok) {
      return res.status(500).json({ error: `Agent call failed: ${agentResponse.status}` });
    }

    // Step 2: Download the real PDF binary from NeuralSeek file storage
    const pdfResponse = await fetch(`${CONSOLE_URL}/maistro/octet-stream/VNO_Investment_OnePager.pdf`, {
      method: 'GET',
      headers: { 'apikey': API_KEY }
    });

    if (!pdfResponse.ok) {
      return res.status(500).json({ error: `Failed to download PDF: ${pdfResponse.status}` });
    }

    const pdfBuffer = await pdfResponse.buffer();
    const pdfBase64 = pdfBuffer.toString('base64');

    res.json({ pdf: pdfBase64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ─── GOOGLE MAPS ENDPOINTS ───

// In-memory cache to avoid repeat API calls for the same address
const mapCache = {};

// Check if Google Maps is available
app.get('/api/map-config', (req, res) => {
  res.json({ available: !!GOOGLE_MAPS_KEY });
});

// Geocode + fetch satellite + 4 street view images
app.get('/api/map-images', async (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'address query param required' });
  if (!GOOGLE_MAPS_KEY) return res.json({ available: false });

  // Return cached result if we have it
  if (mapCache[address]) return res.json(mapCache[address]);

  try {
    // Step 1: Geocode address → lat/lon
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.json({ available: false, error: 'Address not found' });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // Step 2: Fetch satellite + 4 street views in parallel
    const imageRequests = [
      // Satellite overhead
      fetch(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=640x400&maptype=satellite&key=${GOOGLE_MAPS_KEY}`),
      // Street views from 4 directions
      fetch(`https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${lat},${lng}&heading=0&pitch=10&key=${GOOGLE_MAPS_KEY}`),
      fetch(`https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${lat},${lng}&heading=90&pitch=10&key=${GOOGLE_MAPS_KEY}`),
      fetch(`https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${lat},${lng}&heading=180&pitch=10&key=${GOOGLE_MAPS_KEY}`),
      fetch(`https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${lat},${lng}&heading=270&pitch=10&key=${GOOGLE_MAPS_KEY}`)
    ];

    const responses = await Promise.all(imageRequests);
    const buffers = await Promise.all(responses.map(r => r.buffer()));

    const toDataUri = (buf) => `data:image/png;base64,${buf.toString('base64')}`;

    const result = {
      available: true,
      center: { lat, lng },
      satellite: toDataUri(buffers[0]),
      streetViews: [
        { heading: 0, label: 'North', src: toDataUri(buffers[1]) },
        { heading: 90, label: 'East', src: toDataUri(buffers[2]) },
        { heading: 180, label: 'South', src: toDataUri(buffers[3]) },
        { heading: 270, label: 'West', src: toDataUri(buffers[4]) }
      ],
      embedUrl: `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(address)}&maptype=satellite&zoom=18`
    };

    // Cache it
    mapCache[address] = result;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3225;
app.listen(PORT, () => {
  console.log(`Dashboard server running on http://localhost:${PORT}`);
});
