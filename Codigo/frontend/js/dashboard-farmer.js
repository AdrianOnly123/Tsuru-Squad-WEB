const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("⚠️ No has iniciado sesión.");
  window.location.href = "./index.html";
}

// Mostrar datos en navbar en deshuso por el momento NAVBAR
document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;
document.getElementById("userName").textContent = user.name;

document.getElementById("logoutNav").onclick = () => {
  localStorage.clear();
  window.location.href = "./index.html";
};

//NAVBAR FINAL

if (!user.id) {
  console.error("❌ user._id está undefined:", user);
  alert("Error: el usuario no tiene un ID válido.");
}

// Obtener proyectos del ejidatario
fetch("http://localhost:3000/api/projects?owner=${user.id}", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(async (res) => {
    const data = await res.json();
    console.log("Respuesta completa del backend:", data);

    if (!res.ok) {
      throw new Error(
        `Error ${res.status}: ${data.message || "Error desconocido"}`
      );
    }

    if (!Array.isArray(data)) {
      throw new Error("El backend no devolvió un arreglo de proyectos.");
    }

    if (data.length === 0) {
      document.getElementById("mensajeVacio").style.display = "block";
      return;
    }

    renderizarProyectos(data);

    console.log("Respuesta del backend:", data);
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latest = data[0];

    document.getElementById("humidityValue").textContent =
      latest.humidity !== null ? `${latest.humidity}%` : "—";

    document.getElementById("statusValue").textContent = latest.status || "—";

    document.getElementById("fertilizationDate").textContent = latest.sowingDate
      ? formatDate(latest.sowingDate)
      : "—";

    document.getElementById("recommendationText").textContent =
      latest.recommendations || latest.bioFertilizer || "Sin recomendaciones.";
    // Historial de acciones

    const historyList = document.getElementById("historyList");

    if (!historyList) {
      console.warn("Elemento #historyList no encontrado en el DOM");
      return;
    }
    latest.history.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${formatDate(entry.date)} — ${entry.type} (${
        entry.action
      })`;
      li.classList.add("history-item");
      historyList.appendChild(li);
    });
  })
  .catch((err) => {
    console.error("Error al obtener proyectos:", err.message);
    document.getElementById(
      "mensajeVacio"
    ).textContent = `Error: ${err.message}`;
    document.getElementById("mensajeVacio").style.display = "block";
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

// carga de proyectos

function renderizarProyectos(proyectos) {
  const container = document.getElementById("proyectosContainer");
  container.innerHTML = ""; // Limpiar contenido previo

  proyectos.forEach((proyecto) => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";

    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${proyecto.crop}</h5>
          <p class="card-text"><strong>Ubicación:</strong> ${
            proyecto.location
          }</p>
          <p class="card-text"><strong>Estado:</strong> ${proyecto.status}</p>
          <p class="card-text"><strong>Siembra:</strong> ${formatDate(
            proyecto.sowingDate
          )}</p>
          <p class="card-text"><strong>Humedad:</strong> ${
            proyecto.humidity ?? "—"
          }%</p>
          <p class="card-text"><strong>Fertilizante:</strong> ${
            proyecto.bioFertilizer || "—"
          }</p>
          <a href="./detalle-proyecto.html?id=${
            proyecto._id
          }" class="btn btn-outline-primary mt-auto">Ver detalles</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

