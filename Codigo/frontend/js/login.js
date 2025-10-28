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

    fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
})
  .then(async (response) => {
    const data = await response.json();
    console.log("Respuesta del login:", data);

    if (response.ok) {
      alert("✅ Bienvenido, " + data.user.name);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "./welcome.html";
    } else {
      alert("❌ " + (data.message || "Error al iniciar sesión"));
    }
  })
  .catch((error) => {
    alert("⚠️ Error al conectar con el servidor.");
    console.error("Error en login:", error);
  });
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
    .catch(err => console.error('❌ Error al registrar SW:', err));
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

