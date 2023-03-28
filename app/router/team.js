const { TeamController } = require("../controllers/team.controller");
const { checkLogin } = require("../middlewares/autoLogin");
const { expressValidatorMapper } = require("../middlewares/checkErrors");
const { mongoIDValidator } = require("../validations/public");
const { createTeamValidator } = require("..//validations/team");

const router = require("express").Router();
router.post("/create", checkLogin,createTeamValidator(), expressValidatorMapper,  TeamController.createTeam)
router.get("/list", checkLogin, TeamController.getListOfTeam)
router.get("/me", checkLogin, TeamController.getMyTeams)
router.get("/invite/:teamID/:username", checkLogin, TeamController.inviteUserToTeam)
router.get("/:id", checkLogin,mongoIDValidator(), expressValidatorMapper, TeamController.getTeamById)
router.delete("/remove/:id", checkLogin,mongoIDValidator(), expressValidatorMapper, TeamController.removeTeamById)
router.put("/update/:teamID", checkLogin, TeamController.updateTeam)
module.exports = {
    teamRoutes : router
}