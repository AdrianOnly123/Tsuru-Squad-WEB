import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    alert("⚠️ No has iniciado sesión.");
    window.location.href = "./index.html";
    return;
  }

  // Verificar usuario en backend
  fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Usuario validado:", data);
      // Aquí podrías actualizar datos dinámicos si lo deseas
    })
    .catch((err) => {
      console.error("Error al validar usuario:", err);
      alert("⚠️ Sesión inválida, inicia de nuevo.");
      localStorage.clear();
      window.location.href = "./index.html";
    });

  // Mostrar nombre en pantalla
  document.getElementById("userName").textContent = user.name;

  const roleMessage = document.getElementById("roleMessage");
  const dashboardBtn = document.getElementById("goToDashboard");

  if (user.role === "farmer") {
    roleMessage.textContent =
      "Como agricultor, podrás monitorear tus cultivos, registrar datos y mejorar tus resultados siguiendo nuestras recomendaciones.";
    dashboardBtn.onclick = () =>
      (window.location.href = "./dashboard-farmer.html");
  } else if (user.role === "scientist") {
    roleMessage.textContent =
      "Como científico, tendrás acceso a estudios, muestreo de datos y herramientas para mejorar biofertilizantes y semillas resilientes.";
    dashboardBtn.onclick = () =>
      (window.location.href = "./dashboard-scientist.html"); // ✅ corregido
  } else {
    roleMessage.textContent = "Rol no reconocido. Contacta al administrador.";
    dashboardBtn.disabled = true;
  }

  // Actualizar barra de navegación
  document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
  document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;

  document.getElementById("logoutNav").onclick = () => {
    localStorage.clear();
    window.location.href = "./index.html";
  };
});
