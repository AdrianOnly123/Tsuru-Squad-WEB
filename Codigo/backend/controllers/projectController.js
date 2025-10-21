const Project = require("../models/Project");

//Obtener
exports.getProjectsByUser = async (req, res) => {
  try {
    const userId = req.query.owner;
    if (!userId) return res.status(400).json({ message: "Falta el parámetro 'owner'" });

    const projects = await Project.find({ userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyectos", error: error.message });
  }
};

//Crear
exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error al crear proyecto", error: error.message });
  }
};

//Actualizar
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Proyecto no encontrado" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proyecto", error: error.message });
  }
};