const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token) {
    alert("⚠️ No has iniciado sesión.");
    window.location.href = "./index.html";
    return;
  }
  fetch("http://localhost:3000/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // Mostrar nombre, rol, etc.
    });
  if (!user || !token) {
    alert("⚠️ No has iniciado sesión.");
    window.location.href = "./index.html";
    return;
  }

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
      (window.location.href = "/dashboard-scienist.html");
  } else {
    roleMessage.textContent = "Rol no reconocido. Contacta al administrador.";
    dashboardBtn.disabled = true;
  }

});

// Actualizar barra de navegación

document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;

document.getElementById("logoutNav").onclick = () => {
  localStorage.clear();
  window.location.href = "./index.html";
};
