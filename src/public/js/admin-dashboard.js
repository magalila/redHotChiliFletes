
// 1. Protección de Ruta
(function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'ADMIN') window.location.href = '../../auth/login.html';
})();


let todosLosVehiculos = [];
let todosLosProveedores = [];
let vistaActual = 'vehiculos'; 

// --- ESTADÍSTICAS ---
const getAdminStats = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/orders/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Sesión inválida');
        const data = await response.json();
        renderDashboard(data);
    } catch (error) {
        console.error('Error stats:', error);
        if (error.message === 'Sesión inválida') logout();
    }
};

const renderDashboard = (stats) => {
    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
    document.getElementById('total-movido').innerText = formatter.format(stats.totalMovido);
    document.getElementById('ganancia-plataforma').innerText = formatter.format(stats.gananciaPlataforma);
    document.getElementById('total-pedidos').innerText = stats.totalPedidos;
};

// --- GESTIÓN DE FLOTA (Vehículos Pendientes) ---
const getPendingVehicles = async () => {
    vistaActual = 'vehiculos'; // Cambiamos el estado
    localStorage.setItem("vistaActual", vistaActual); // Guardamos la vista
    window.limpiarBuscador(); // Limpiamos el input visualmente

    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/vehicles/pending', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
            todosLosVehiculos = data;
            renderVehicleTable(data);
        }
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
    }
};

const renderVehicleTable = (vehicles) => {
    const container = document.getElementById('tabla-vehiculos-container');
    const cardTitle = document.querySelector('.card-header h5');
    if (cardTitle && vehicles.length > 0) {
        cardTitle.innerText = "Gestión de Flota Pendiente";
    }

    if (vehicles.length === 0) {
        container.innerHTML = "<p class='text-muted p-4 text-center'>No hay vehículos pendientes.</p>";
        return;
    }

    let html = `
        <div class="table-responsive  shadow-sm rounded-bottom">
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr class="text-secondary small fw-bold">
                        <th class="ps-3 border-0">PROVEEDOR / VEHÍCULO</th>
                        <th class="text-center d-none d-md-table-cell border-0">MODELO / TIPO</th>
                        <th class="text-center d-none d-md-table-cell border-0">PATENTE</th>
                        <th class="text-end pe-3 border-0">ACCIONES</th>
                    </tr>
                </thead>
                <tbody> 
    `;

    vehicles.forEach(v => {
        const nombre = v.proveedor?.nombre || 'Sin nombre';
        const patente = v.patente || '---';
        const modelo = v.modelo || 'S/M';
        const tipo = v.tipo_vehiculo || '';

        const estiloTipo = "text-danger fw-bold text-uppercase";
        const estiloModelo = "fw-semibold text-dark text-uppercase";

        html += `
            <tr>
                <td class="ps-3 border-bottom-0 border-top">
                    <div class="d-flex flex-column">
                        <span class="fw-bold text-dark">${nombre}</span>
                        <div class="d-md-none mt-1">
                            <span class="${estiloModelo}" style="font-size: 0.8rem;">${modelo}</span>
                            <span class="text-muted mx-1">•</span>
                            <span class="${estiloTipo}" style="font-size: 0.7rem;">${tipo}</span>
                            <div class="mt-1">
                                <span class="badge bg-light text-dark border fw-normal" style="font-size: 0.7rem;">${patente}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="text-center d-none d-md-table-cell border-top">
                    <div class="d-flex flex-column" style="line-height: 1.2;">
                        <span class="${estiloModelo}" style="font-size: 0.85rem;">${modelo}</span>
                        <span class="${estiloTipo}" style="font-size: 0.65rem; letter-spacing: 0.5px;">${tipo}</span>
                    </div>
                </td>
                <td class="text-center d-none d-md-table-cell border-top">
                    <span class="badge bg-light text-dark border fw-normal" style="font-size: 0.75rem;">${patente}</span>
                </td>
                <td class="text-end pe-3 border-top">
                    <div class="d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-success d-flex align-items-center" onclick="handleVehicle('${v.id}', true)">
                            <i class="bi bi-check-circle"></i>
                            <span class="d-none d-md-inline ms-1">Aceptar</span>
                        </button>
                        <button class="btn btn-sm btn-outline-danger d-flex align-items-center" onclick="handleVehicle('${v.id}', false)">
                            <i class="bi bi-x-circle"></i>
                            <span class="d-none d-md-inline ms-1">Rechazar</span>
                        </button>   
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
};

window.irHome = () => {
    vistaActual = 'vehiculos';
    localStorage.removeItem("vistaActual");
    localStorage.removeItem("proveedorId");
    getPendingVehicles();
};

window.verDetalles = (id) => {
    const proveedor = todosLosProveedores.find(p => p.id === id);
    if (proveedor) {
        vistaActual = 'detalles';
        localStorage.setItem("vistaActual", vistaActual);
        localStorage.setItem("proveedorId", id);
        renderDetallesProveedor(proveedor);
    }
};
// Función para limpiar el buscador
window.limpiarBuscador = () => {
    const input = document.getElementById('buscador-input');
    if (input) {
        input.value = '';
    }
};

// --- UTILIDADES ---
window.handleVehicle = async (id, habilitar) => {
    const token = localStorage.getItem('token');
    const accion = habilitar ? "APROBAR" : "RECHAZAR";
    try {
        const response = await fetch(`http://localhost:3000/api/vehicles/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accion }) 
        });
        if (response.ok) getPendingVehicles();
    } catch (error) { console.error(error); }
};


const logout = () => {
    localStorage.clear();
    window.location.href = '../../auth/login.html';
};

window.logout = logout;
window.getPendingVehicles = getPendingVehicles;

document.addEventListener('DOMContentLoaded', () => {
    getAdminStats();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'ADMIN') {
        window.location.href = '../../auth/login.html';
        return;
    }

    vistaActual = 'vehiculos';
    localStorage.removeItem("vistaActual");
    localStorage.removeItem("proveedorId");

    getPendingVehicles(); 
});

