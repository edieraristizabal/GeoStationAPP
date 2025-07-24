// 1. Inicializar mapa con capa satélite de Google
const mapa = L.map('map', { center: [4.6, -74.08], zoom: 12 });
L.gridLayer.googleMutant({ type: 'satellite' }).addTo(mapa);

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
  } else {
    alert('Error: ' + json.error);
  }
});
