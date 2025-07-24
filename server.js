// server.js
require('dotenv').config();
const path    = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const puntosRouter = require('./routes/stations');

const app = express();

// Servir estáticos y SPA
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API
app.use(express.static('public'));
app.use('/api/puntos', puntosRouter);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectada'))
.catch(err => console.error(err));

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

