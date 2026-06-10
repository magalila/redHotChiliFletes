document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const vehiculoId = params.get('id');
  if (vehiculoId) cargarDetallesVehiculo(vehiculoId);
});

async function cargarDetallesVehiculo(id) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:3000/api/vehicles/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const vehiculo = await response.json();
    renderDetallesVehiculo(vehiculo);
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderDetallesVehiculo(v) {
  document.getElementById('titulo-vehiculo').innerText = `${v.modelo} (${v.patente})`;

  // Datos principales
  const datos = `
    <p><strong>Tipo:</strong> ${v.tipo_vehiculo}</p>
    <p><strong>Capacidad:</strong> ${v.capacidadPeso} kg / ${v.capacidadVol} m³</p>
    <p><strong>Estado:</strong> ${v.estado}</p>
    <p><strong>Fecha de gestión:</strong> ${v.fechaGestion ? new Date(v.fechaGestion).toLocaleDateString('es-AR') : 'Pendiente'}</p>
  `;
  document.getElementById('datos-vehiculo').innerHTML = datos;

  // Documentos
  const lista = document.getElementById('documentos-lista');
  lista.innerHTML = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="bi bi-file-earmark-pdf text-danger me-2"></i>Cédula del vehículo</span>
      ${v.cedulaUrl ? `<a href="${v.cedulaUrl}" target="_blank" class="btn btn-sm btn-outline-primary">Ver PDF</a>` : '<span class="text-muted small">No disponible</span>'}
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span><i class="bi bi-shield-check text-success me-2"></i>Póliza de seguro vigente</span>
      ${v.polizaUrl ? `<a href="${v.polizaUrl}" target="_blank" class="btn btn-sm btn-outline-primary">Ver PDF</a>` : '<span class="text-muted small">No disponible</span>'}
    </li>
  `;
}

function volverAProveedor() {
  window.history.back();
}

function logout() {
  localStorage.clear();
  window.location.href = '../../auth/login.html';
}
