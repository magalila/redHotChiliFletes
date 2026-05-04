

const getAdminStats = async () => {
    // 1. Recuperamos el token que guardamos al hacer login
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../../auth/login.html'; // Redirigir si no hay sesión
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/orders/admin/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No tienes permisos de administrador o el token expiró');
        }

        const data = await response.json();

        // 2. Aquí llamamos a la función que pintará los datos en el Dashboard
        renderDashboard(data);

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        alert('Error de autenticación. Por favor, reingrese al sistema.');
    }
  
};

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '../../auth/login.html'; 
}
window.logout = logout;
