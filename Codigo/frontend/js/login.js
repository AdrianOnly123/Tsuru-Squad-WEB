// Mostrar / ocultar contraseña
function togglePassword() {
  const pwd = document.getElementById("password");
  const btn = document.querySelector(".pwd-toggle");
  if (pwd.type === "password") {
    pwd.type = "text";
    btn.textContent = "Ocultar";
    btn.setAttribute("aria-label", "Ocultar contraseña");
  } else {
    pwd.type = "password";
    btn.textContent = "Mostrar";
    btn.setAttribute("aria-label", "Mostrar contraseña");
  }
}

// Login real con conexión al backend
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Bienvenido, " + data.user.name);
        // Puedes guardar el usuario en localStorage si lo necesitas:
        // localStorage.setItem("user", JSON.stringify(data.user));
        // window.location.href = "/dashboard.html";
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      alert("⚠️ Error al conectar con el servidor.");
      console.error(error);
    }
  });

function demoLogin() {
  document.getElementById("email").value = "demo@dose.app";
  document.getElementById("password").value = "demopassword";
  alert("Cuenta demo cargada. Presiona Entrar para iniciar sesión.");
}

function forgot(e) {
  e.preventDefault();
  alert("Función recuperar contraseña (pendiente).");
}

function signup(e) {
  e.preventDefault();
  alert("Función registro (pendiente).");
}

function support(e) {
  e.preventDefault();
  alert("Contacto de soporte (pendiente).");
}

localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
window.location.href = "./dashboard.html";
