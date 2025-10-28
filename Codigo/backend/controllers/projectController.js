const Project = require("../models/Project");

//Obtener
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado o acceso denegado" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el proyecto",
      error: error.message
    });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener proyectos",
      error: error.message
    });
  }
};


exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("userId", "name role");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyectos", error: error.message });
  }
};


//Crear
exports.createProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const newProject = new Project({ ...req.body, userId });
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error al crear proyecto", error: error.message });
  }
};


//Actualizar
exports.updateProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para modificar este proyecto" });
    }

    Object.assign(project, req.body); 
    await project.save();

    res.json({ message: "Proyecto actualizado", project });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proyecto", error: error.message });
  }
};

exports.addActionToHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para modificar este proyecto" });
    }

    project.history.push(req.body);
    await project.save();

    res.json({ message: "Acción agregada", project });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar acción", error: error.message });
  }
};

