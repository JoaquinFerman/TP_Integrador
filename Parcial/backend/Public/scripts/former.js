document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".auto-form");

  forms.forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const action = form.getAttribute("data-action");
      const method = form.getAttribute("data-method") || "POST";

      let body;
      let headers = {};

      if (form.enctype === "multipart/form-data") {
        body = new FormData(form);
      } else {
        body = new URLSearchParams(new FormData(form));
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      }

      try {
        console.log(action);
        
        const response = await fetch(action, {
          method: method,
          headers,
          body
        });

        const result = await response.json();

        alert(result.message || result.error || "Operación completada");
        location.reload();

      } catch (err) {
        console.error("Error: " + err);
        alert("Ocurrió un error inesperado.");
      }
    });
  });
});