const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { getProjectsByUser, getProjectById } = require("../controllers/projectController");
const verifyToken = require("../middleware/verifyToken");
const verifyScientist = require("../middleware/verifyScientist");
const { getAllProjects } = require("../controllers/projectController");



// Crud de proyectos de granjeros
router.get("/all", verifyToken, verifyScientist, getAllProjects);

router.get("/", verifyToken, projectController.getProjectsByUser);


router.get("/:id", verifyToken, getProjectById);

router.post("/", verifyToken, projectController.createProject);

router.put("/:id", verifyToken, projectController.updateProject);

router.patch("/:id/add-action", verifyToken, projectController.addActionToHistory);

//router.delete("/:id", projectController.deleteProject);

//crud de proyectos de cientificos


module.exports = router;