//NAVBAR
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
  document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;
}

document.getElementById("logoutNav").onclick = () => {
  localStorage.clear();
  window.location.href = "./index.html";
};
//FIN NAVBAR

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

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
      (window.location.href = "./dashboard-scientist.html");
  } else {
    roleMessage.textContent = "Rol no reconocido. Contacta al administrador.";
    dashboardBtn.disabled = true;
  }

  document.getElementById("logout").onclick = () => {
    localStorage.clear();
    window.location.href = "./login.html";
  };
});
