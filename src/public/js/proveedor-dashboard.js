document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/api/proveedor/datos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Error al obtener datos del proveedor');
    const proveedor = await res.json();

    // Datos personales
    document.getElementById('nombre').textContent = proveedor.nombre;
    document.getElementById('dni').textContent = proveedor.dni;
    document.getElementById('email').textContent = proveedor.email || '---';
    document.getElementById('telefono').textContent = proveedor.telefono || '---';
    document.getElementById('fechaCreacion').textContent = new Date(proveedor.fechaCreacion).toLocaleString();

    document.getElementById('fotoPerfil').src = `http://localhost:3000/${proveedor.fotoPerfil}`;
    document.getElementById('dniPdf').href = `http://localhost:3000/${proveedor.dniPdf}`;
    document.getElementById('certificadoAntecedente').href = `http://localhost:3000/${proveedor.certificadoAntecedente}`;
    document.getElementById('licenciaConducir').href = `http://localhost:3000/${proveedor.licenciaConducir}`;

    // Vehículos
    const contenedorVehiculos = document.getElementById('vehiculos-container');
    proveedor.vehiculos.forEach(v => {
      const card = document.createElement('div');
      card.classList.add('card', 'mb-3', 'p-3', 'shadow-sm');
      card.innerHTML = `
        <h6 class="text-primary">${v.tipo_vehiculo} - ${v.patente}</h6>
        <p><strong>Modelo:</strong> ${v.modelo || '---'}</p>
        <p><strong>Capacidad Volumen:</strong> ${v.capacidadVol} m³</p>
        <p><strong>Capacidad Peso:</strong> ${v.capacidadPeso} kg</p>
        <p><strong>Estado:</strong> ${v.estado}</p>
        <div class="mt-2">
          ${v.documentos.map(d => `
            <a href="http://localhost:3000/${d.fileUrl}" target="_blank" class="btn btn-sm btn-outline-info me-2">
              Ver ${d.tipo}
            </a>
          `).join('')}
        </div>
      `;
      contenedorVehiculos.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert('Error al cargar los datos del proveedor.');
  }
});
