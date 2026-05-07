// // 1. Protección de Ruta (Ejecución inmediata)
// (function () {
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('userRole');

//     if (!token || role !== 'ADMIN') {
//         // Si no hay token o no es admin, redirigir al login
//         window.location.href = '../../auth/login.html';
//     }
// })();


// const getAdminStats = async () => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//         window.location.href = '../../auth/login.html';
//         return;
//     }

//     try {
//         const response = await fetch('http://localhost:3000/api/orders/admin/stats', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             // Si el servidor responde 401 o 403, el token no sirve
//             throw new Error('Sesión inválida');
//         }

//         const data = await response.json();

//         // Llamamos a la función para pintar los datos
//         renderDashboard(data);

//     } catch (error) {
//         console.error('Error al obtener estadísticas:', error);
//         // Evitamos el alert infinito si falla la carga inicial, 
//         // pero informamos al usuario si la sesión expiró
//         if (error.message === 'Sesión inválida') {
//             alert('Su sesión ha expirado.');
//             logout();
//         }
//     }
// };

// // Función para actualizar el HTML con los datos de Neon
// const renderDashboard = (stats) => {
//     // Formateador de moneda para que se vea profesional ($ 1.234,56)
//     const formatter = new Intl.NumberFormat('es-AR', {
//         style: 'currency',
//         currency: 'ARS',
//     });

//     // Mapeo directo a los IDs de tu dashboard.html
//     document.getElementById('total-movido').innerText = formatter.format(stats.totalMovido);
//     document.getElementById('ganancia-plataforma').innerText = formatter.format(stats.gananciaPlataforma);
//     document.getElementById('total-pedidos').innerText = stats.totalPedidos;
// };

// // Función de salida
// function logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     window.location.href = '../../auth/login.html';
// }


// // const getPendingVehicles = async () => {
// //     const token = localStorage.getItem('token');
// //     try {
// //         const response = await fetch('http://localhost:3000/api/vehicles/pending', {
// //             headers: { 'Authorization': `Bearer ${token}` }
// //         });
// //         const vehicles = await response.json();
// //         renderVehicleTable(vehicles);
// //     } catch (error) {
// //         console.error('Error al cargar flota:', error);
// //     }
// // };
// let todosLosVehiculos = []; // Variable global para guardar la lista original

// // Modificamos tu función que trae los datos
// const getPendingVehicles = async () => {
//     const token = localStorage.getItem('token');
//     try {
//         const response = await fetch('http://localhost:3000/api/vehicles/pending', {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await response.json();

//         todosLosVehiculos = data; // Guardamos la copia
//         renderVehicleTable(data);  // Renderizamos normal
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// // --- LÓGICA DEL BUSCADOR ---
// // --- LÓGICA DEL BUSCADOR INTELIGENTE ---
// document.getElementById('buscador-input')?.addEventListener('input', (e) => {
//     const termino = e.target.value.toLowerCase().trim();
//     const infoBusqueda = document.getElementById('info-busqueda');

//     // Si el buscador está vacío, mostramos todos y ocultamos el texto de ayuda
//     if (termino === "") {
//         infoBusqueda?.classList.add('d-none');
//         renderVehicleTable(todosLosVehiculos);
//         return;
//     }

//     // Filtramos: si el nombre del proveedor O la patente incluyen lo que escribimos
//     const filtrados = todosLosVehiculos.filter(v => {
//         const nombreProveedor = v.proveedor?.nombre?.toLowerCase() || "";
//         const patente = v.patente?.toLowerCase() || "";

//         return nombreProveedor.includes(termino) || patente.includes(termino);
//     });

//     // Mostramos el texto de "resultados filtrados"
//     infoBusqueda?.classList.remove('d-none');

//     renderVehicleTable(filtrados);
// });

// // Función para el botón X
// window.limpiarBuscador = () => {
//     const input = document.getElementById('buscador-input');
//     const infoBusqueda = document.getElementById('info-busqueda');
//     if (input) {
//         input.value = '';
//         infoBusqueda?.classList.add('d-none');
//         renderVehicleTable(todosLosVehiculos);
//     }
// };


// const renderVehicleTable = (vehicles) => {
//     const container = document.getElementById('tabla-vehiculos-container');
//     if (!container) return;

//     if (vehicles.length === 0) {
//         container.innerHTML = "<p class='text-muted p-4 text-center'>No hay vehículos pendientes de aprobación.</p>";
//         return;
//     }

//     // Iniciamos el contenedor con un grupo de lista para que tenga bordes limpios
//     let html = `<div class="list-group list-group-flush">`;

//     vehicles.forEach(v => {
//         html += `
//             <div class="list-group-item p-4">
//                 <div class="row align-items-center">
//                     <div class="col-12 col-md-8">
//                         <div class="mb-2">
//                             <span class="badge bg-danger-subtle text-danger border border-danger-subtle mb-2">
//                                 ${v.tipo_vehiculo}
//                             </span>
//                             <h5 class="mb-1 text-dark">${v.modelo}</h5>
//                             <p class="text-secondary small mb-3">Patente: <span class="fw-bold">${v.patente}</span></p>
//                         </div>
                        
//                         <div class="d-flex align-items-center">
//                             <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
//                                 <i class="bi bi-person text-secondary"></i>
//                             </div>
//                             <div>
//                                 <div class="fw-semibold small">${v.proveedor?.nombre || 'S/N'}</div>
//                                 <div class="text-muted small">${v.proveedor?.email || ''}</div>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="col-12 col-md-4 mt-4 mt-md-0">
//                         <div class="d-grid gap-2 d-md-flex justify-content-md-end">
//                             <button class="btn btn-success px-4" onclick="handleVehicle('${v.id}', true)">
//                                 <i class="bi bi-check2-circle me-1"></i> Aprobar
//                             </button>
//                             <button class="btn btn-outline-danger px-4" onclick="handleVehicle('${v.id}', false)">
//                                 Rechazar
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>`;
//     });

//     html += `</div>`;
//     container.innerHTML = html;
// };


// window.handleVehicle = async (id, habilitar) => {
//     const token = localStorage.getItem('token');
//     const accion = habilitar ? 'aprobar' : 'rechazar';

//     if (!confirm(`¿Estás seguro de que quieres ${accion} este vehículo?`)) return;

//     try {
//         const response = await fetch(`http://localhost:3000/api/vehicles/${id}/status`, {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             // Enviamos el booleano que espera el controlador corregido
//             body: JSON.stringify({ habilitar: habilitar })
//         });

//         if (response.ok) {
//             alert(`Vehículo ${habilitar ? 'aprobado' : 'rechazado'} con éxito`);
//             getPendingVehicles(); // Recargar tabla
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// // Actualizamos el DOMContentLoaded para que llame a ambas funciones
// document.addEventListener('DOMContentLoaded', () => {
//     getAdminStats();
//     getPendingVehicles();
// });
// // Hacer logout disponible para el botón 'Salir'
// window.logout = logout;

// // Ejecutar la carga de datos apenas se abre el dashboard
// document.addEventListener('DOMContentLoaded', getAdminStats);




// 1. Protección de Ruta (Ejecución inmediata)
(function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'ADMIN') {
        window.location.href = '../../auth/login.html';
    }
})();

// Estadísticas del Dashboard
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

// --- GESTIÓN DE FLOTA (LA PARTE QUE FUNCIONABA EXCELENTE) ---
let todosLosVehiculos = []; 

const getPendingVehicles = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/vehicles/pending', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();

        // Validamos que sea un array antes de asignar y renderizar
        if (Array.isArray(data)) {
            todosLosVehiculos = data;
            renderVehicleTable(data);
        } else {
            console.error("La respuesta no es una lista:", data);
            document.getElementById('tabla-vehiculos-container').innerHTML = 
                "<p class='text-center p-4'>No se pudo cargar la lista correctamente.</p>";
        }
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
    }
};

const renderVehicleTable = (vehicles) => {
    const container = document.getElementById('tabla-vehiculos-container');
    if (!container) return;

    if (vehicles.length === 0) {
        container.innerHTML = "<p class='text-muted p-2 text-center small'>No hay vehículos pendientes.</p>";
        return;
    }

    let html = `<div class="list-group list-group-flush border-top shadow-sm">`;

    vehicles.forEach(v => {
        const nombre = v.proveedor?.nombre || 'Sin nombre';
        const contacto = v.proveedor?.telefono || 'S/N';

        html += `
            <div class="list-group-item py-2 px-3 border-bottom"> 
                <div class="row align-items-center g-0">
                    
                    <div class="col-4">
                        <div class="d-flex flex-column" style="line-height: 1.2;">
                            <span class="fw-bold text-dark" style="font-size: 0.85rem;">${nombre}</span>
                            <span class="text-muted" style="font-size: 0.7rem;">📞 ${contacto}</span>
                        </div>
                    </div>

                    <div class="col-3 text-center">
                        <div class="d-flex flex-column align-items-center" style="line-height: 1.1;">
                            <span class="fw-bold text-dark" style="font-size: 0.85rem;">${v.modelo || 'S/M'}</span>
                            <span class="text-danger fw-bold text-uppercase" style="font-size: 0.6rem; letter-spacing: 0.5px;">
                                ${v.tipo_vehiculo}
                            </span>
                        </div>
                    </div>

                    <div class="col-3 text-center">
                         <span class="badge bg-light text-dark border fw-normal" style="font-size: 0.75rem; letter-spacing: 1px;">
                            ${v.patente}
                         </span>
                    </div>

                    <div class="col-2 text-end">
                        <div class="d-flex justify-content-end gap-1">
                            <button class="btn btn-sm text-success p-1" onclick="handleVehicle('${v.id}', true)" title="Aprobar">
                                <i class="bi bi-check-circle-fill" style="font-size: 1.1rem;"></i>
                            </button>
                            <button class="btn btn-sm text-danger p-1" onclick="handleVehicle('${v.id}', false)" title="Rechazar">
                                <i class="bi bi-x-circle-fill" style="font-size: 1.1rem;"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
};

window.handleVehicle = async (id, habilitar) => {
    const token = localStorage.getItem('token');
    const accion = habilitar ? 'aprobar' : 'rechazar';

    if (!confirm(`¿Estás seguro de que quieres ${accion} este vehículo?`)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/vehicles/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ habilitar: habilitar })
        });

        if (response.ok) {
            alert(`Vehículo ${habilitar ? 'aprobado' : 'rechazado'} con éxito`);
            getPendingVehicles(); 
        }
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
};

//buscador
// --- LÓGICA DEL BUSCADOR EN admin-dashboard.js ---
document.getElementById('buscador-input')?.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();
    
    if (termino === "") {
        renderVehicleTable(todosLosVehiculos);
        return;
    }

    const filtrados = todosLosVehiculos.filter(v => {
        // Sacamos los datos de forma segura para que no rompa si algo es null
        const nombreProveedor = v.proveedor?.nombre?.toLowerCase() || "";
        const patente = v.patente?.toLowerCase() || "";
        const modelo = v.modelo?.toLowerCase() || "";

        // Retorna true si el término coincide con nombre, patente o modelo
        return nombreProveedor.includes(termino) || 
               patente.includes(termino) || 
               modelo.includes(termino);
    });

    renderVehicleTable(filtrados);
});
// Función para limpiar el buscador y resetear la tabla
window.limpiarBuscador = () => {
    const input = document.getElementById('buscador-input');
    
    if (input) {
        input.value = ''; // Vacía el texto del input
        
        // Disparamos manualmente el evento 'input' para que la lógica 
        // que ya tenés escrita detecte que está vacío y resetee la tabla
        input.dispatchEvent(new Event('input')); 
        
        // Opcional: devolver el foco al buscador
        input.focus();
    }
};

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '../../auth/login.html';
}

window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
    getAdminStats();
    getPendingVehicles();
});