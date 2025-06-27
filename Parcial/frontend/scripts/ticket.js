window.onload = function() {
    // Simula obtener el usuario
    const user = localStorage.getItem('User') || 'Invitado';

    // Obtiene los datos del ticket guardados en localStorage
    const ticket = JSON.parse(localStorage.getItem('ticket')) || null;
    const ticketDiv = document.getElementById('ticket-content');

    if (!ticket || !ticket.items || ticket.items.length === 0) {
        ticketDiv.innerHTML = "<p>No hay ticket para mostrar.</p>";
        return;
    }

    let html = `<p><strong>User:</strong> ${user}</p>`;
    html += `<ul style="padding-left:20px;">`;
    ticket.items.forEach(item => {
        html += `<li>${item.name} x${item.count} - $${(item.price * item.count).toFixed(2)}</li>`;
    });
    html += `</ul>`;
    html += `<strong>Total: $${ticket.total.toFixed(2)}</strong>`;

    ticketDiv.innerHTML = html;

    // Limpia el ticket del localStorage
    localStorage.removeItem('ticket');
    localStorage.removeItem('cart');
};