const express = require('express');
const multer  = require('multer');
const GeoData = require('../models/GeoData');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Crear un punto con datos y fotos
router.post('/', upload.array('fotos', 5), async (req, res) => {
  try {
    const { lat, lng, afloramiento, descripcionRoca,
            estructuras, geomorfologia, descripcionSuelos, muestras } = req.body;
    const fotosNombres = req.files.map(f=>f.filename);

    const punto = new GeoData({
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      afloramiento,
      descripcionRoca,
      estructuras,
      geomorfologia,
      descripcionSuelos,
      fotos: fotosNombres,
      muestras: muestras.split(',').map(s=>s.trim())
    });
    await punto.save();
    res.status(201).json({ success: true, id: punto._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener todos los puntos
router.get('/', async (req, res) => {
  const puntos = await GeoData.find();
  res.json(puntos);
});

module.exports = router;
