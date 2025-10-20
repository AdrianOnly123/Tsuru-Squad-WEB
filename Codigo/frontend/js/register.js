document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value;

      if (!name || !email || !password) {
        alert("Por favor completa todos los campos.");
        return;
      }

      try {
        console.log({ name, email, password, role });
        const response = await fetch(
          "http://localhost:3000/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("✅ Registro exitoso. Bienvenido, " + data.user.name);
          window.location.href = "./dashboard.html";
        } else {
          alert("❌ " + data.message);
        }
      } catch (error) {
        alert("⚠️ Error al conectar con el servidor.");
        console.error("Error:", error.message);
      }
    });
});
