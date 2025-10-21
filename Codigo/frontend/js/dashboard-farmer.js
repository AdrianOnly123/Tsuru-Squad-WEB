const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("⚠️ No has iniciado sesión.");
  window.location.href = "./index.html";
}

// Mostrar datos en navbar
document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;
document.getElementById("userName").textContent = user.name;

document.getElementById("logoutNav").onclick = () => {
  localStorage.clear();
  window.location.href = "./index.html";
};

if (!user._id) {
  console.error("❌ user._id está undefined:", user);
  alert("Error: el usuario no tiene un ID válido.");
}

// Obtener proyectos del ejidatario
fetch(`http://localhost:3000/api/projects?owner=${user._id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((projects) => {
    if (!projects || projects.length === 0) {
      alert("No se encontraron proyectos.");
      return;
    }
    console.log("Respuesta del backend:", projects);
    // Ordenar por fecha de creación (más reciente primero)
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latest = projects[0];

    // Mostrar datos del proyecto
    document.getElementById("humidityValue").textContent =
      latest.humidity !== null ? `${latest.humidity}%` : "—";

    document.getElementById("statusValue").textContent =
      latest.status || "—";

    document.getElementById("fertilizationDate").textContent =
      latest.sowingDate ? formatDate(latest.sowingDate) : "—";

    document.getElementById("recommendationText").textContent =
      latest.recommendations || latest.bioFertilizer || "Sin recomendaciones.";

    // Historial de acciones
    const historyList = document.getElementById("historyList");
    latest.history.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${formatDate(entry.date)} — ${entry.type} (${entry.action})`;
      li.classList.add("history-item");
      historyList.appendChild(li);
    });
  })
  .catch((err) => {
    console.error("Error al obtener proyectos:", err);
    alert("Error al cargar datos del dashboard.");
  });

// Formatear fecha
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

console.log("User ID:", user._id); 