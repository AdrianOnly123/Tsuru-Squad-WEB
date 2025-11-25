const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const app = express();
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");


dotenv.config();

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chinampa.onrender.com"
];

const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("❌ Error interno:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});
