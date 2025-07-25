// 1. Inicializar mapa con capa satélite de Google
const mapa = L.map('map', { center: [4.6, -74.08], zoom: 12 });
L.gridLayer.googleMutant({ type: 'satellite' }).addTo(mapa);

async function fetchPoints() {
  const res = await fetch('/api/puntos');
  const data = await res.json();
  data.forEach(p => {
    const [lng, lat] = p.location.coordinates;
    L.marker([lat, lng])
      .addTo(mapa)
      .bindPopup(`<b>${p.afloramiento}</b><br/>${p.descripcionRoca}`);
  });
}

fetchPoints();

// 2. Habilitar herramienta de dibujo de marcadores
mapa.pm.addControls({
  position: 'topleft',
  drawMarker: true,
  editMode: true,
  removalMode: true
});

// 3. Al colocar un marcador, mostrar formulario
mapa.on('pm:create', e => {
  if (e.shape === 'Marker') {
    const { lat, lng } = e.marker.getLatLng();
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    document.getElementById('formContainer').style.display = 'block';
  }
});

// Wait for the DOM to be fully loaded before adding the event listener
document.addEventListener('DOMContentLoaded', () => {
  const pointForm = document.getElementById('pointForm');
  pointForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(pointForm);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/api/puntos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      // Close the form and refresh points
      document.getElementById('formContainer').style.display = 'none';
      pointForm.reset();
      fetchPoints();
    } else {
      alert('Error saving point');
    }
  });
});
