import {checkUsername, setupThemeToggle} from "./functions.js";

function init() {
    checkUsername('ticket')
    setupThemeToggle();

    const user = localStorage.getItem('username');
    const ticket = JSON.parse(localStorage.getItem('ticket')) || null;
    const ticketDiv = document.getElementById('ticket-content');
    const empresa = "MatchPoint Wear";
    const fecha = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });

    if (!ticket || !ticket.items || ticket.items.length === 0) {
        ticketDiv.innerHTML = "<p>No hay ticket para mostrar.</p>";
        return;
    }

    let html =`
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
    
    const volverBtn = document.querySelector('.page-btn');
    if (volverBtn) {
        volverBtn.addEventListener('click', function() {
            localStorage.removeItem('ticket');
            localStorage.removeItem('cart');
            localStorage.removeItem('username');
            localStorage.removeItem('theme');
        });
    }
};

init();