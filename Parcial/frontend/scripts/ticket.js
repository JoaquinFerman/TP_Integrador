window.onload = function() {
    const user = localStorage.getItem('username');
    const ticket = JSON.parse(localStorage.getItem('ticket')) || null;
    const ticketDiv = document.getElementById('ticket-content');
    const empresa = "MatchPoint Wear";
    const fecha = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });

    if (!ticket || !ticket.items || ticket.items.length === 0) {
        ticketDiv.innerHTML = "<p>No hay ticket para mostrar.</p>";
        return;
    }

    let html = `
        <div class="ticket-header-row">
            <span class="ticket-empresa">${empresa}</span>
            <span class="ticket-fecha">${fecha}</span>
        </div>
        <div class="ticket-user-row">
            <span class="ticket-user-label">Usuario:</span>
            <span class="ticket-user-name">${user}</span>
        </div>
    `;
    html += `<ul class="ticket-items-list">`;
    ticket.items.forEach(item => {
        html += `<li>${item.name} x${item.count} - $${(item.price * item.count).toFixed(2)}</li>`;
    });
    html += `</ul>`;
    html += `<strong class="ticket-total">Total: $${ticket.total.toFixed(2)}</strong>`;

    ticketDiv.innerHTML = html;

    localStorage.removeItem('ticket');
    localStorage.removeItem('cart');
    localStorage.removeItem('username');
    setupThemeToggle();
};

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