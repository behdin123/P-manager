const { ProjectController } = require("../controllers/project.controller");
const { checkLogin } = require("../middlewares/autoLogin");
const { expressValidatorMapper } = require("../middlewares/checkErrors");
const { createProjectValidator } = require("../validations/project");
const { uploadFile } = require("../modules/express-fileupload");
const fileupload = require("express-fileupload");
const { mongoIDValidator } = require("../validations/public");
const { addStrToArr } = require("../middlewares/convertStringToArray");
const router = require("express").Router();

// Create a new project
router.post("/create",fileupload(), checkLogin, addStrToArr("tags"), uploadFile, createProjectValidator(),expressValidatorMapper, ProjectController.createProject)

// Get a list of all projects
router.get("/list", checkLogin, ProjectController.getAllProject)

// Get a specific project by ID
router.get("/:id", checkLogin, mongoIDValidator(), expressValidatorMapper, ProjectController.getProjectById)

// Remove a project by ID
router.delete("/remove/:id", checkLogin,mongoIDValidator(), expressValidatorMapper, ProjectController.removeProject)

// Update a project by ID
router.put("/edit/:id", checkLogin, mongoIDValidator(), expressValidatorMapper,ProjectController.updateProject)

// Update a project's image by ID
router.patch("/edit-projectImage/:id", fileupload(), checkLogin,uploadFile, mongoIDValidator(), expressValidatorMapper,ProjectController.updateProjectImage)

// Export the router as a module
module.exports = {
    projectRoutes : router
}