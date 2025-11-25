import { API_URL } from "./config.js";
// =====================================
// Registro de usuario
// =====================================
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value;

      if (!name || !email || !password || !role) {
        alert("Por favor completa todos los campos.");
        return;
      }

      // =====================================
      // MODO REAL (con backend)
      // =====================================
      try {
        console.log({ name, email, password, role });
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("✅ Registro exitoso. Bienvenido, " + data.user.name);

          if (data.user.role === "farmer") {
            window.location.href = "./dashboard-farmer.html";
          } else if (data.user.role === "scientist") {
            window.location.href = "./dashboard-scientist.html";
          } else {
            window.location.href = "./welcome.html";
          }
        } else {
          alert("❌ " + (data.message || "Error al registrarse."));
        }
      } catch (error) {
        alert("⚠️ Error al conectar con el servidor.");
        console.error("Error:", error.message);
      }
    });
});
