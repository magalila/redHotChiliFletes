// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el ID del proveedor de la URL (?id=xxxx)
    const urlParams = new URLSearchParams(window.location.search);
    const proveedorId = urlParams.get('id');
    const nombre = urlParams.get('nombre');

    if (nombre) document.getElementById('nombre-proveedor').innerText = `Flota de ${nombre}`;

    if (proveedorId) {
        cargarVehiculosProveedor(proveedorId);
    }
});

let flotaOriginal = [];

async function cargarVehiculosProveedor(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3000/api/vehicles/proveedor/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        flotaOriginal = await response.json();
        renderFlota(flotaOriginal);
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderFlota(vehiculos) {
    const container = document.getElementById('lista-vehiculos-proveedor');
    document.getElementById('contador-vehiculos').innerText = `${vehiculos.length} vehículos`;

    let html = '';
    vehiculos.forEach(v => {
        const statusText = v.estado; // directamente el valor: "PENDIENTE", "APROBADO", "RECHAZADO"
        let statusClass = 'bg-warning text-dark';
        let borderClass = 'border-warning';

        if (v.estado === 'APROBADO') {
            statusClass = 'bg-success';
            borderClass = 'border-success';
        } else if (v.estado === 'RECHAZADO') {
            statusClass = 'bg-danger';
            borderClass = 'border-danger';
        }

        html += `
  <div class="card mb-3 border-0 shadow-sm border-start border-4 ${borderClass}">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <span class="badge ${statusClass} mb-2">${statusText}</span>
        <h5>${v.modelo}</h5>
        <p class="mb-0 text-muted small">Patente: <strong>${v.patente}</strong> | Tipo: ${v.tipo_vehiculo}</p>
      </div>
    </div>
  </div>`;

    });
    container.innerHTML = html;
}

// Función de filtrado por estado
window.filtrarFlota = (estado) => {
    let filtrados = [];
    if (estado === 'todos') {
        filtrados = flotaOriginal;
    } else if (estado === 'aprobados') {
        filtrados = flotaOriginal.filter(v => v.estado === 'APROBADO');
    } else if (estado === 'rechazados') {
        filtrados = flotaOriginal.filter(v => v.estado === 'RECHAZADO');
    } else if (estado === 'pendientes') {
        filtrados = flotaOriginal.filter(v => v.estado === 'PENDIENTE');
    }

    renderFlota(filtrados);

    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};
