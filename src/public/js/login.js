document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 1. Guardar el token (esto es lo que valida tus permisos en el dashboard)
            localStorage.setItem('token', data.token);

            // 2. Extraer los datos del objeto 'usuario' que viene del backend
            const usuario = data.usuario;

            if (usuario && usuario.rol) {
                // Guardamos el rol para controles rápidos en el front
                localStorage.setItem('userRole', usuario.rol);

                // 3. Redirección lógica según el rol de la base de datos
                if (usuario.rol === 'ADMIN') {
                    window.location.href = '../views/admin/dashboard.html';
                } else if (usuario.rol === 'PROVEEDOR') {
                    window.location.href = '../provider/my-vehicles.html';
                } else {
                    // Para clientes u otros roles
                    alert('Bienvenido/a ' + usuario.nombre);
                }
            } else {
                console.error('Estructura de usuario no encontrada en la respuesta:', data);
                alert('Error de configuración en el usuario. Contacte al administrador.');
            }
        } else {
            // Si el backend envía un error (401, 404, 500), mostramos el mensaje que viene del servidor
            alert(data.error || data.mensaje || 'Error al iniciar sesión.');
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor de RedHotChiliFletes.');
    }
      const logout = () => {
    // Eliminamos el token y datos del usuario
    localStorage.removeItem('token');
    // Redirigimos al login (ajustá la ruta según tu carpeta)
    window.location.href = '../../auth/login.html'; 
};
});