const { ProjectController } = require("../controllers/project.controller");
const { checkLogin } = require("../middlewares/autoLogin");
const { expressValidatorMapper } = require("../middlewares/checkErrors");
const { createProjectValidator } = require("../validations/project");
const { uploadFile } = require("../modules/express-fileupload");
const fileupload = require("express-fileupload");
const { mongoIDValidator } = require("../validations/public");
const { addStrToArr } = require("../middlewares/convertStringToArray");
const router = require("express").Router();

router.post("/create",fileupload(), checkLogin, addStrToArr("tags"), uploadFile, createProjectValidator(),expressValidatorMapper, ProjectController.createProject)
router.get("/list", checkLogin, ProjectController.getAllProject)
router.get("/:id", checkLogin, mongoIDValidator(), expressValidatorMapper, ProjectController.getProjectById)
router.delete("/remove/:id", checkLogin,mongoIDValidator(), expressValidatorMapper, ProjectController.removeProject)
router.put("/edit/:id", checkLogin, mongoIDValidator(), expressValidatorMapper,ProjectController.updateProject)
router.patch("/edit-projectImage/:id", fileupload(), checkLogin,uploadFile, mongoIDValidator(), expressValidatorMapper,ProjectController.updateProjectImage)
module.exports = {
    projectRoutes : router
}