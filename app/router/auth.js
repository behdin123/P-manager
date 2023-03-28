const router = require("express").Router();
const { expressValidatorMapper } = require("../middlewares/checkErrors");
const { registerValidator, loginValidation } = require("../validations/auth");
const {AuthController} = require("./../controllers/auth.controller")
router.post("/register", registerValidator(), expressValidatorMapper, AuthController.register)
router.post("/login", loginValidation(), expressValidatorMapper, AuthController.login)
module.exports = {
    authRoutes : router
}