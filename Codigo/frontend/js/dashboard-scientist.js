console.log("Dashboard científico cargado");
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token || user.role !== "scientist") {
    alert("⚠️ Acceso restringido. Solo científicos pueden ver este panel.");
    window.location.href = "./index.html";
    return;
  }
  fetch("http://localhost:3000/api/projects/all", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((projects) => {
      console.log("Proyectos recibidos:", projects);
      renderProjectCards(projects);
      renderRankingChart(projects);
      renderBiofertilizerChart(projects);
    });

  function renderProjectCards(projects) {
    const container = document.getElementById("projectCards");
    container.innerHTML = "";

    projects.forEach((p) => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
      <div class="card-header">
        <h3>${p.crop}</h3>
        <span class="location">${p.location}</span>
      </div>
      <div class="card-body">
        <p><strong>Agricultor:</strong> ${p.userId?.name ?? "Desconocido"}</p>
        <p><strong>Biofertilizante:</strong> ${p.bioFertilizer}</p>
        <p><strong>Biodiversidad:</strong> ${
          p.biodiversity ?? "No especificada"
        }</p>
        <p><strong>Humedad:</strong> ${p.humidity}%</p>
      </div>
    `;
      container.appendChild(card);
    });
  }

  function renderRankingChart(projects) {
    const ctx = document.getElementById("rankingChart").getContext("2d");
    if (!ctx) {
      console.warn("Canvas #rankingChart no encontrado");
      return;
    }

    const grouped = {};
    projects.forEach((p) => {
      const name = p.user?.name ?? "Desconocido";
      grouped[name] = (grouped[name] || 0) + 1;
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(grouped),
        datasets: [
          {
            label: "Proyectos realizados",
            data: Object.values(grouped),
            backgroundColor: "#2ecc71",
          },
        ],
      },
    });
  }

  function renderBiofertilizerChart(projects) {
    const ctx = document.getElementById("biofertilizerChart").getContext("2d");
    const grouped = {};
    projects.forEach((p) => {
      const bf = p.bioFertilizer ?? "Sin dato";
      grouped[bf] = (grouped[bf] || 0) + 1;
    });

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(grouped),
        datasets: [
          {
            label: "Uso de biofertilizantes",
            data: Object.values(grouped),
            backgroundColor: ["#3498db", "#e67e22", "#9b59b6", "#1abc9c"],
          },
        ],
      },
    });
  }

  // Mostrar datos en navbar
  document.getElementById("navUserName").textContent = `Nombre: ${user.name}`;
  document.getElementById("navUserRole").textContent = `Rol: ${user.role}`;

  document.getElementById("logoutNav").onclick = () => {
    localStorage.clear();
    window.location.href = "./index.html";
  };
});
