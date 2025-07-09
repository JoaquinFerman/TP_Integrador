export function setupThemeToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const darkClass = 'dark-mode';

    if (!toggleBtn) return;

    // Al cargar, aplica el tema guardado y emoji correcto
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add(darkClass);
        toggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove(darkClass);
        toggleBtn.textContent = '🌙';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle(darkClass);
        const isDark = document.body.classList.contains(darkClass);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
    });
}

export function updateCart(producto, cantidad) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = cart.findIndex(p => p.id === producto.id);
    if (cantidad == 0 && idx !== -1){
        cart.splice(idx, 1);
    } else if (idx !== -1) {
        cart[idx].count = cantidad;
    } else {
        cart.push({ ...producto, count: cantidad });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        if(window.scrollY > 60) {
            nav.style.padding = '8px 40px 24px 40px';
            nav.style.minHeight = '40px';
            nav.style.backgroundSize = 'cover 110%'; 
        }
        if (window.scrollY <= 60) {
            nav.style.padding = '20px 34px 45px 25px';
            nav.style.minHeight = '180px';
            nav.style.backgroundSize = 'cover 50%';
        }
    });
}

export function checkUsername(pag) {
    if(!localStorage.getItem('username')) {
        window.location.href = "../index.html";
        alert('Ingrese un nombre de usuario antes de acceder al ' + pag)
    }
}