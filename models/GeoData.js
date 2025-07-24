const mongoose = require('mongoose');
const { Schema } = mongoose;

const geoDataSchema = new Schema({
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  afloramiento:    String,
  descripcionRoca: String,
  estructuras:     String,
  geomorfologia:   String,
  descripcionSuelos:String,
  fotos:          [String],   // nombres de archivos
  muestras:       [String]    // descripciones o IDs
}, { timestamps: true });

geoDataSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('GeoData', geoDataSchema);
