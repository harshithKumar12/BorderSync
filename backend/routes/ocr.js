const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const Tesseract = require('tesseract.js');

// Store uploads temporarily in backend/uploads/
const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|bmp|tiff/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ── Helpers ───────────────────────────────────────────────────────────

function extractFields(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const raw   = text.toUpperCase();

  // ── Passport / document number ──
  // MRZ line format: starts with P< or ID
  // Also try generic patterns: letter + 6-9 digits
  let docNumber = null;

  // Try MRZ line 1 (passport): P<COUNTRY + name
  // Try MRZ line 2: document number is first 9 chars before first <
  const mrzLine = lines.find(l => /^[A-Z0-9<]{30,44}$/.test(l.replace(/\s/,'')));
  if (mrzLine) {
    const cleaned = mrzLine.replace(/\s/g,'');
    // MRZ doc number: chars 1-9 of second MRZ line
    const mrzNum = cleaned.substring(0,9).replace(/</g,'');
    if (/^[A-Z0-9]{6,9}$/.test(mrzNum)) docNumber = mrzNum;
  }

  // Fallback: label-based extraction
  if (!docNumber) {
    const numLine = lines.find(l =>
      /passport\s*(no|number|#|num)/i.test(l) ||
      /document\s*(no|number)/i.test(l) ||
      /doc\s*(no|num)/i.test(l)
    );
    if (numLine) {
      const m = numLine.match(/[A-Z]{1,2}[-\s]?[0-9]{6,9}/i);
      if (m) docNumber = m[0].replace(/[\s-]/g,'').toUpperCase();
    }
  }

  // Fallback: generic pattern
  if (!docNumber) {
    const m = raw.match(/\b[A-Z]{1,2}[0-9]{6,9}\b/);
    if (m) docNumber = m[0];
  }

  // ── Name ──
  let name = null;
  const nameLine = lines.find(l =>
    /^(surname|last\s*name|family\s*name)\s*[:/]/i.test(l) ||
    /^(given\s*name|first\s*name|name)\s*[:/]/i.test(l)
  );
  if (nameLine) {
    name = nameLine.replace(/^[^:/]+[:/]\s*/,'').trim();
  }

  // ── Nationality ──
  let nationality = null;
  const natLine = lines.find(l => /nationality\s*[:/]/i.test(l));
  if (natLine) {
    nationality = natLine.replace(/^[^:/]+[:/]\s*/,'').trim();
  }

  // ── Date of birth ──
  let dateOfBirth = null;
  const dobLine = lines.find(l => /date\s*of\s*birth|birth\s*date|dob/i.test(l));
  if (dobLine) {
    const m = dobLine.match(/(\d{1,2}[\s./\-]\d{1,2}[\s./\-]\d{2,4})/);
    if (m) {
      const parts = m[1].split(/[\s./\-]/);
      if (parts.length === 3) {
        const year = parts[2].length === 2
          ? (parseInt(parts[2]) > 30 ? '19'+parts[2] : '20'+parts[2])
          : parts[2];
        dateOfBirth = year + '-' + parts[1].padStart(2,'0') + '-' + parts[0].padStart(2,'0');
      }
    }
  }

  // ── Document type guess ──
  let documentType = 'passport';
  if (/visa/i.test(raw))          documentType = 'visa';
  if (/refugee|unhcr/i.test(raw)) documentType = 'refugee_card';

  return { docNumber, name, nationality, dateOfBirth, documentType };
}

// ── POST /api/ocr/scan ────────────────────────────────────────────────
router.post('/scan', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    console.log('[OCR] Processing:', req.file.originalname);

    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: m => { if (m.status === 'recognizing text') process.stdout.write('\r[OCR] ' + Math.round(m.progress * 100) + '%'); },
    });

    console.log('\n[OCR] Done');
    const text   = result.data.text;
    const fields = extractFields(text);

    return res.json({
      success:      true,
      extracted:    fields,
      rawText:      text,
      confidence:   Math.round(result.data.confidence),
    });

  } catch (err) {
    console.error('[OCR] Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    // Clean up temp file
    fs.unlink(filePath, () => {});
  }
});

module.exports = router;