document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/proveedor/datos');
    if (!response.ok) throw new Error('Error al obtener datos del proveedor');

    const proveedor = await response.json();

    document.getElementById('nombre').textContent = proveedor.nombre;
    document.getElementById('apellido').textContent = proveedor.apellido;
    document.getElementById('dni').textContent = proveedor.dni;
    document.getElementById('email').textContent = proveedor.email;
    document.getElementById('fechaCreacion').textContent = new Date(proveedor.createdAt).toLocaleString();

    document.getElementById('fotoPerfil').href = `http://localhost:3000/${proveedor.fotoPerfil}`;
    document.getElementById('dniPdf').href = `http://localhost:3000/${proveedor.dniPdf}`;
    document.getElementById('certificadoAntecedente').href = `http://localhost:3000/${proveedor.certificadoAntecedente}`;
    document.getElementById('licenciaConducir').href = `http://localhost:3000/${proveedor.licenciaConducir}`;
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar los datos del proveedor.');
  }
});
