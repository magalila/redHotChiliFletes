document.addEventListener('DOMContentLoaded', () => {
  cargarProveedores();
});

async function cargarProveedores() {
  const token = localStorage.getItem('token');
  const body = document.getElementById('proveedores-body');
  const container = document.getElementById('tabla-proveedores-container');
  body.innerHTML = '';
  container.insertAdjacentHTML('beforeend', '<div class="text-center p-5" id="loading"><div class="spinner-border text-primary"></div></div>');

  try {
    const response = await fetch('http://localhost:3000/api/proveedor/activos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    document.getElementById('loading')?.remove();

    if (!response.ok) throw new Error(`Error del servidor (${response.status})`);
    const proveedores = await response.json();

    if (!Array.isArray(proveedores) || proveedores.length === 0) {
      body.innerHTML = "<tr><td colspan='4' class='text-center text-muted p-4'>No hay proveedores.</td></tr>";
      return;
    }

    renderProveedoresTable(proveedores);
  } catch (error) {
    document.getElementById('loading')?.remove();
    body.innerHTML = `<tr><td colspan='4' class='text-center text-danger p-4'>Error: ${error.message}</td></tr>`;
  }
}

function renderProveedoresTable(proveedores) {
  const template = document.getElementById('proveedor-row-template');
  const body = document.getElementById('proveedores-body');
  body.innerHTML = '';

  proveedores.forEach(prov => {
    const clone = template.content.cloneNode(true);
    const flotaCount = prov.vehiculos?.length || 0;
    const dni = prov.dni || '---';

    clone.querySelector('[data-field="inicial"]').textContent = prov.nombre.charAt(0).toUpperCase();
    clone.querySelectorAll('[data-field="nombre"]').forEach(el => el.textContent = prov.nombre);
    clone.querySelectorAll('[data-field="dni"]').forEach(el => el.textContent = dni);
    clone.querySelectorAll('[data-field="flota-count"]').forEach(el => el.textContent = flotaCount);

    clone.querySelector('[data-action="detalles"]').onclick = () => {
      window.location.href = `detalles.html?id=${prov.id}&nombre=${encodeURIComponent(prov.nombre)}`;
    };

    clone.querySelector('[data-action="eliminar"]').onclick = () => eliminarProv(prov.id);

    body.appendChild(clone);
  });
}

function eliminarProv(id) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3000/api/proveedor/activos/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (res.ok) cargarProveedores();
      else alert("Error al eliminar proveedor");
    })
    .catch(err => console.error(err));
}

function logout() {
  localStorage.clear();
  window.location.href = '../../auth/login.html';
}
