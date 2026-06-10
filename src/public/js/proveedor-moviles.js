document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('formVehiculo');
  const tabla = document.getElementById('tablaVehiculos');

  // Cargar vehículos existentes
  const cargarVehiculos = async () => {
    const res = await fetch('http://localhost:3000/api/vehicles/proveedor');
    const vehiculos = await res.json();
    tabla.innerHTML = vehiculos.map(v => `
      <tr>
        <td>${v.patente}</td>
        <td>${v.modelo}</td>
        <td>${v.tipo_vehiculo}</td>
        <td>${v.capacidadVol}</td>
        <td>${v.capacidadPeso}</td>
        <td><a href="http://localhost:3000/${v.documento}" target="_blank" class="btn btn-sm btn-outline-info">Ver PDF</a></td>
      </tr>
    `).join('');
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const res = await fetch('http://localhost:3000/api/vehicles', { method: 'POST', body: formData });
    if (res.ok) {
      alert('Vehículo agregado correctamente');
      form.reset();
      cargarVehiculos();
    } else {
      alert('Error al agregar vehículo');
    }
  });

  cargarVehiculos();
});
