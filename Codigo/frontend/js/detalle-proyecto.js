const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");
const user = JSON.parse(localStorage.getItem("user"));

const token = localStorage.getItem("token");

if (!token || !projectId) {
  document.getElementById("mensajeError").textContent =
    "⚠️ No se pudo cargar el proyecto. Verifica tu sesión o el enlace.";
  document.getElementById("mensajeError").style.display = "block";
  throw new Error("Token o ID de proyecto faltante");
}

// Obtener datos del proyecto
fetch(`http://localhost:3000/api/projects/${projectId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(async (res) => {
    const data = await res.json();
    console.log("Proyecto recibido:", data);

    if (!res.ok) {
      throw new Error(
        `Error ${res.status}: ${data.message || "Error desconocido"}`
      );
    }

    // Mostrar datos en la vista
    document.getElementById("cropName").textContent = data.crop;
    document.getElementById("locationText").textContent = data.location;
    document.getElementById("statusText").textContent = data.status || "—";
    document.getElementById("sowingDateText").textContent = formatDate(
      data.sowingDate
    );
    document.getElementById("humidityText").textContent =
      data.humidity !== null ? `${data.humidity}%` : "—";
    document.getElementById("fertilizerText").textContent =
      data.bioFertilizer || "—";
    document.getElementById("observationsText").textContent =
      data.observations || "—";
    document.getElementById("recommendationsText").textContent =
      data.recommendations || "—";

    // Historial
    const historyList = document.getElementById("historyList");
    if (Array.isArray(data.history) && data.history.length > 0) {
      data.history.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${formatDate(entry.date)} — ${entry.type} (${
          entry.action
        })`;
        li.classList.add("history-item");
        historyList.appendChild(li);
      });
    } else {
      historyList.innerHTML = "<li>No hay historial registrado.</li>";
    }
  })
  .catch((err) => {
    console.error("Error al cargar proyecto:", err.message);
    document.getElementById("mensajeError").textContent = err.message.includes(
      "Unexpected token"
    )
      ? "⚠️ El proyecto no fue encontrado o el servidor devolvió una respuesta inesperada."
      : `Error: ${err.message}`;
    document.getElementById("mensajeError").style.display = "block";
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

// Mostrar datos en navbar en deshuso por el momento NAVBAR
document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;

document.getElementById("logoutNav").onclick = () => {
  localStorage.clear();
  window.location.href = "./index.html";
};

//NAVBAR FINAL
