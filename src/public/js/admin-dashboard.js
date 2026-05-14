
// 1. Protección de Ruta
(function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'ADMIN') window.location.href = '../../auth/login.html';
})();

// Variables de Estado Globales
let todosLosVehiculos = [];
let todosLosProveedores = [];
let vistaActual = 'vehiculos'; // Puede ser 'vehiculos' o 'proveedores'

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



const mostrarProveedores = async () => {
    vistaActual = 'proveedores';
    localStorage.setItem("vistaActual", vistaActual);
    window.limpiarBuscador();

    const container = document.getElementById('tabla-vehiculos-container');
    const token = localStorage.getItem('token');
    container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';

    try {
        const response = await fetch('http://localhost:3000/api/auth/admin/proveedores', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error del servidor (${response.status})`);
        const proveedores = await response.json();
        if (Array.isArray(proveedores)) {
            todosLosProveedores = proveedores;
            renderProveedoresTable(proveedores);
        } else {
            container.innerHTML = `<div class="alert alert-warning m-3">Error al cargar proveedores.</div>`;
        }
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger m-3">Error: ${error.message}</div>`;
    }
};

const renderProveedoresTable = (proveedores) => {
    const container = document.getElementById('tabla-vehiculos-container');
    const cardTitle = document.querySelector('.card-header h5');
    if (cardTitle) cardTitle.innerText = "Listado de Proveedores Activos";

    if (proveedores.length === 0) {
        container.innerHTML = "<p class='text-muted p-4 text-center'>No hay proveedores.</p>";
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr class="text-secondary small fw-bold">
                        <th class="ps-3 border-0">PROVEEDOR / DETALLES</th>
                        <th class="d-none d-md-table-cell border-0">D.N.I</th>
                        <th class="text-center d-none d-md-table-cell border-0">FLOTA</th>
                        <th class="text-end pe-3 border-0">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
    `;

    proveedores.forEach(prov => {
        const flotaCount = prov.vehiculos?.length || 0;
        const dni = prov.dni || '---';

        html += `
            <tr>
                <td class="ps-3">
            <div class="d-flex align-items-center">
                <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-2 d-none d-sm-flex" style="width: 32px; height: 32px; flex-shrink:0;">
                    ${prov.nombre.charAt(0).toUpperCase()}
                </div>
                
                <div class="d-flex flex-column">
                    <span class="fw-bold text-dark">${prov.nombre}</span>
                    
                    <div class="d-md-none small mt-1 d-flex align-items-center">
                        
                        <div style="width: 100px;" class="text-secondary flex-shrink-0">
                            <i class="bi bi-card-text me-1"></i>${dni}
                        </div>
                        
                        <div class="ms-2">
                            <span class="badge rounded-pill bg-info-subtle text-info border border-info-subtle" style="font-size: 0.7rem;">
                                <i class="bi bi-truck me-1"></i>${flotaCount}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        
                </td>

                <td class="d-none d-md-table-cell text-secondary">${dni}</td>
                <td class="text-center d-none d-md-table-cell">
                    <span class="badge rounded-pill bg-info-subtle text-info border border-info-subtle">
                        ${flotaCount} móviles
                    </span>
                </td>

                <td class="text-end pe-3">
                    <div class="d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-primary d-flex align-items-center" onclick="verDetalles('${prov.id}')">
                            <i class="bi bi-person-lines-fill"></i>
                            <span class="d-none d-md-inline ms-1">Detalles</span>
                        </button>
                        <button class="btn btn-sm btn-outline-danger d-flex align-items-center" onclick="eliminarProv('${prov.id}')">
                            <i class="bi bi-trash3"></i>
                            <span class="d-none d-md-inline ms-1">Eliminar</span>
                        </button>
                    </div>
                </td>
            </tr>`;
    });
    container.innerHTML = html + `</tbody></table></div>`;
};
// --- LÓGICA UNIFICADA DEL BUSCADOR ---

document.getElementById('buscador-input')?.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();

    if (vistaActual === 'vehiculos') {
        if (termino === "") return renderVehicleTable(todosLosVehiculos);
        const filtrados = todosLosVehiculos.filter(v =>
            v.proveedor?.nombre?.toLowerCase().includes(termino) ||
            v.patente?.toLowerCase().includes(termino) ||
            v.modelo?.toLowerCase().includes(termino)
        );
        renderVehicleTable(filtrados);

    } else if (vistaActual === 'proveedores') {
        if (termino === "") return renderProveedoresTable(todosLosProveedores);
        const filtrados = todosLosProveedores.filter(p =>
            p.nombre?.toLowerCase().includes(termino) ||
            p.dni?.includes(termino) ||
            p.telefono?.includes(termino)
        );
        renderProveedoresTable(filtrados);

    } else if (vistaActual === 'detalles') {
        const id = localStorage.getItem("proveedorId");
        const proveedor = todosLosProveedores.find(p => p.id === id);
        if (!proveedor) return;

        let vehiculos = proveedor.vehiculos || [];
        if (termino !== "") {
            vehiculos = vehiculos.filter(v =>
                v.patente?.toLowerCase().includes(termino) ||
                v.modelo?.toLowerCase().includes(termino) ||
                v.tipo_vehiculo?.toLowerCase().includes(termino)
            );
        }

        const proveedorFiltrado = { ...proveedor, vehiculos };
        renderDetallesProveedor(proveedorFiltrado);
    }
});

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
// window.handleVehicle = async (id, habilitar) => {
//     const token = localStorage.getItem('token');
//     try {
//         const response = await fetch(`http://localhost:3000/api/vehicles/${id}/status`, {
//             method: 'PATCH',
//             headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//             body: JSON.stringify({ habilitar })
//         });
//         if (response.ok) getPendingVehicles();
//     } catch (error) { console.error(error); }
// };
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
      body: JSON.stringify({ accion }) // 👈 ahora enviamos la acción
    });
    if (response.ok) getPendingVehicles();
  } catch (error) { console.error(error); }
};



const logout = () => {
    localStorage.clear();
    window.location.href = '../../auth/login.html';
};

window.logout = logout;
window.mostrarProveedores = mostrarProveedores;
window.getPendingVehicles = getPendingVehicles;



const renderDetallesProveedor = (proveedor) => {
    const container = document.getElementById('tabla-vehiculos-container');

    // Cambiamos el título de la card principal
    const cardTitle = document.querySelector('.card-header h5');
    if (cardTitle) cardTitle.innerText = `Expediente: ${proveedor.nombre}`;

    let html = `
        <div class="p-3 mb-5">
<div class="card border-0 shadow-sm mb-4">
    <div class="card-header bg-white py-3">
        <h6 class="mb-0 text-primary"><i class="bi bi-person-badge me-2"></i>Datos Personales</h6>
    </div>
    <div class="card-body">
        <div class="row g-3">
            <div class="col-6 col-md-3">
                <label class="text-muted small d-block">Nombre Completo</label>
                <span class="fw-bold">${proveedor.nombre || proveedor.name || 'Sin nombre'}</span>
            </div>
            <div class="col-6 col-md-3">
                <label class="text-muted small d-block">D.N.I / CUIL</label>
                <span class="fw-bold">${proveedor.dni || '---'}</span>
            </div>
            <div class="col-6 col-md-3">
                <label class="text-muted small d-block">Teléfono</label>
                <span class="fw-bold text-success">
                    <i class="bi bi-whatsapp me-1"></i>${proveedor.telefono || proveedor.phone || '---'}
                </span>
            </div>
            <div class="col-6 col-md-3">
                <label class="text-muted small d-block">Fecha de Alta</label>
                <span class="fw-bold">
    ${proveedor.fechaCreacion ? new Date(proveedor.fechaCreacion).toLocaleString('es-AR') : '---'}            </div>
        </div>
    </div>
</div>

       
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 text-primary"><i class="bi bi-truck me-2"></i>Flota de Vehículos</h6>
                <span class="badge bg-primary-subtle text-primary rounded-pill">
                    ${proveedor.vehiculos?.length || 0} unidades
                </span>
            </div>
            
            <div class="card-body p-2 p-md-0"> <!-- Padding reducido en mobile para las cards -->
                
                <!-- VISTA DESKTOP: Tabla tradicional -->
                <div class="table-responsive d-none d-md-block">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light small fw-bold">
                            <tr>
                                <th class="ps-3">MODELO / PATENTE</th>
                                <th class="text-center">TIPO / ESTADO</th>
                                <th class="text-center">CAPACIDAD</th>
                                <th class="text-center">FECHA GESTIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${proveedor.vehiculos?.map(v => `
                                <tr>
                                    <td class="ps-3">
                                        <div class="fw-bold text-dark">${v.modelo || 'Sin modelo'}</div>
                                        <div class="badge bg-light text-dark border fw-normal" style="font-size: 0.7rem;">
                                            ${v.patente || '---'}
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="d-flex flex-column align-items-center">
                                            <span class="fw-bold text-uppercase small">${v.tipo_vehiculo || '---'}</span>
                                           <span class="badge ${v.estado === 'APROBADO' ? 'bg-success' : v.estado === 'RECHAZADO' ? 'bg-danger' : 'bg-warning text-dark'} mt-1">
                                            ${v.estado}
                                          </span>

                                        </div>
                                    </td>
                                    <td class="text-center small text-muted">
                                        ${v.capacidadPeso || 0} kg / ${v.capacidadVol || 0} m³
                                    </td>
                                    <td class="text-center small text-muted">
                                        ${v.fechaGestion ? new Date(v.fechaGestion).toLocaleDateString('es-AR') : 'Pendiente'}

                                    </td>
                                </tr>
                            `).join('') || '<tr><td colspan="4" class="text-center p-3">No hay vehículos</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <!-- VISTA MOBILE: Cards individuales -->
                <div class="d-md-none">
                    ${proveedor.vehiculos?.map(v => `
                        <div class="card border shadow-sm mb-3 mx-2">
                            <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h6 class="fw-bold mb-1 text-uppercase">${v.modelo || 'Sin modelo'}</h6>
                                        <span class="badge bg-light text-dark border fw-normal">${v.patente || '---'}</span>
                                    </div>
                                 <span class="badge ${v.estado === 'APROBADO' ? 'bg-success' : v.estado === 'RECHAZADO' ? 'bg-danger' :'bg-warning text-dark'} shadow-sm">
                                    ${v.estado}
                                </span>


                                </div>
                                
                                <div class="row g-2 border-top pt-3">
                                    <div class="col-6">
                                        <label class="text-muted d-block mb-1" style="font-size: 0.65rem; letter-spacing: 0.5px;">TIPO</label>
                                        <span class="fw-bold small text-uppercase">${v.tipo_vehiculo || '---'}</span>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted d-block mb-1" style="font-size: 0.65rem; letter-spacing: 0.5px;">CAPACIDAD</label>
                                        <span class="small fw-semibold">${v.capacidadPeso || 0}kg / ${v.capacidadVol || 0}m³</span>
                                    </div>
                                    <div class="col-12 mt-3 bg-light rounded p-2 d-flex align-items-center">
                                        <i class="bi bi-calendar3 text-primary me-2"></i>
                                        <div>
                                            <label class="text-muted d-block" style="font-size: 0.6rem; line-height: 1;">ÚLTIMA GESTIÓN</label>
                                            <span class="small" style="font-size: 0.75rem;">
                                              
                                            ${v.fechaGestion ? new Date(v.fechaGestion).toLocaleDateString('es-AR') : 'Pendiente'}

                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('') || '<p class="text-center text-muted p-4">No hay vehículos registrados</p>'}
                </div>

            </div>
        </div>
    `;

    container.innerHTML = html;
};

// document.addEventListener('DOMContentLoaded', () => {
//     getAdminStats();
//     const ultimaVista = localStorage.getItem("vistaActual");

//     if (!ultimaVista) {
//         // Si no hay nada guardado → vista inicial
//         getPendingVehicles();
//     } else if (ultimaVista === "proveedores") {
//         mostrarProveedores();
//     } else if (ultimaVista === "detalles") {
//         const id = localStorage.getItem("proveedorId");
//         if (id) {
//             mostrarProveedores().then(() => {
//                 const prov = todosLosProveedores.find(p => p.id === id);
//                 if (prov) renderDetallesProveedor(prov);
//             });
//         } else {
//             getPendingVehicles(); // fallback si no hay proveedorId
//         }
//     } else {
//         getPendingVehicles(); // cualquier otro caso → inicio
//     }
// });
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

    getPendingVehicles(); // ✅ ahora se ejecuta solo si hay token
});

