document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const proveedorId = params.get('id');
    const nombre = params.get('nombre');

    if (nombre) document.getElementById('nombre-proveedor').innerText = `Flota de ${nombre}`;
    if (proveedorId) cargarVehiculosProveedor(proveedorId);

    document.getElementById('filtro-estado').addEventListener('change', (e) => {
        filtrarFlota(e.target.value);
    });
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
    const contador = document.getElementById('contador-vehiculos');
    const template = document.getElementById('vehiculo-row-template');

    contador.innerText = `${vehiculos.length} vehículos`;
    container.innerHTML = '';

    vehiculos.forEach(v => {
        const clone = template.content.cloneNode(true);
        const estadoBadge = clone.querySelector('[data-field="estado"]');
        const borderCard = clone.querySelector('[data-field="border"]');

        estadoBadge.textContent = v.estado;
        let color = 'border-warning';
        let badge = 'bg-warning text-dark';
        if (v.estado === 'APROBADO') { color = 'border-success'; badge = 'bg-success'; }
        else if (v.estado === 'RECHAZADO') { color = 'border-danger'; badge = 'bg-danger'; }

        borderCard.classList.add(color);
        estadoBadge.classList.add(...badge.split(' '));

        clone.querySelector('[data-field="modelo"]').textContent = v.modelo || 'Sin modelo';
        clone.querySelector('[data-field="patente"]').textContent = v.patente || '---';
        clone.querySelector('[data-field="tipo"]').textContent = v.tipo_vehiculo || '---';
clone.querySelector('[data-field="border"]').onclick = () => {
    window.location.href = `vehiculo-detalle.html?id=${v.id}`;
  };
        container.appendChild(clone);
    });
}

function filtrarFlota(estado) {
    let filtrados = estado === 'todos'
        ? flotaOriginal
        : flotaOriginal.filter(v => v.estado === estado);

    renderFlota(filtrados);
}

function logout() {
    localStorage.clear();
    window.location.href = '../../auth/login.html';
}
function volverAProveedores() {
    window.location.href = 'proveedores.html';
}
