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

// 4. Envío del formulario
document.getElementById('dataForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  const res = await fetch('http://localhost:3000/api/puntos', {
    method: 'POST',
    body: fd
  });
  const json = await res.json();
  if (json.success) {
    alert('Registrado con ID: ' + json.id);
    document.getElementById('formContainer').style.display = 'none';
    fetchPoints();
  } else {
    alert('Error: ' + json.error);
  }
});
