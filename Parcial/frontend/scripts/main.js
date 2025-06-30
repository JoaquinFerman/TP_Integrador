function continuar(){
    const username = document.getElementById('nameInput').value
    if(!username){
        alert("Enter a valid name")
        return
    }
    localStorage.setItem('username', username);
    window.location.href = 'pages/catalog.html';
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const darkClass = 'dark-mode';

    // Al cargar, aplica el tema guardado y emoji correcto
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add(darkClass);
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle(darkClass);
        const isDark = document.body.classList.contains(darkClass);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
    });
}

setupThemeToggle();