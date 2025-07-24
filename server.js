const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const puntosRouter = require('./routes/stations');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/api/puntos', puntosRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=> console.log('MongoDB conectada'))
  .catch(err=> console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Servidor en puerto ${PORT}`));
