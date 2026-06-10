document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('dni', document.getElementById('dni').value);
    formData.append('telefono', document.getElementById('telefono').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('fotoPerfil', document.getElementById('fotoPerfil').files[0]);
    formData.append('dniPdf', document.getElementById('dniPdf')?.files?.[0]);
    formData.append('certificadoAntecedente', document.getElementById('certificadoAntecedente').files[0]);
    formData.append('licenciaConducir', document.getElementById('licenciaConducir').files[0]);
    formData.append('password', document.getElementById('password').value);

  try {
  const response = await fetch('http://localhost:3000/api/users/register', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) throw new Error('Error al registrar usuario');

  const data = await response.json();

  // ✅ Mostrar mensaje de éxito
  alert('✅ Registro realizado con éxito');

  // ✅ Redirigir a la vista del proveedor
  window.location.href = '../proveedor/dashboard.html';
} catch (error) {
  console.error(error);
  alert('❌ Hubo un problema al registrar el usuario');
}

  });

  // Vista previa de PDFs con descarga
  const pdfMap = {
    verDniPdf: 'dniPdf',
    verCertificado: 'certificadoAntecedente',
    verLicencia: 'licenciaConducir'
  };

  Object.entries(pdfMap).forEach(([btnId, inputId]) => {
    document.getElementById(btnId).addEventListener('click', () => {
      const file = document.getElementById(inputId).files[0];
      if (!file) return alert('Seleccioná un archivo PDF primero.');

      const url = URL.createObjectURL(file);
      document.getElementById('pdfViewer').src = url;

      // Configurar botón de descarga
      document.getElementById('downloadPdf').onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
      };

      // Mostrar modal Bootstrap
      const pdfModal = new bootstrap.Modal(document.getElementById('pdfModal'));
      pdfModal.show();
    });
  });

  // Vista previa de imagen
  document.getElementById('verFoto').addEventListener('click', () => {
    const file = document.getElementById('fotoPerfil').files[0];
    if (!file) return alert('Seleccioná una imagen primero.');

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewImage').src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
});
