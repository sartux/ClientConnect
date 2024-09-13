// document.addEventListener('DOMContentLoaded', () => {
//     const logoutBtn = document.querySelector('.logout-btn');

//     logoutBtn.addEventListener('click', () => {
//         // Aquí puedes agregar la lógica para cerrar sesión
//         alert('Sesión cerrada');
//     });
// });

// dashboard.js
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.main-content');
    sidebar.classList.toggle('collapsed');
    content.style.marginLeft = sidebar.classList.contains('collapsed') ? '80px' : '250px';
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}