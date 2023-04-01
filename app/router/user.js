/**
 * This file defines routes for user operations
 * Each route specifies the HTTP method, the URL path, and the required middleware functions for authentication, validation, and file upload
 */


// Import the necessary middleware and validation functions, as well as the UserController object from the user.controller.js file
const { UserController } = require("../controllers/user.controller");
const { checkLogin } = require("../middlewares/autoLogin");
const { expressValidatorMapper } = require("../middlewares/checkErrors");
const { imageValidator } = require("../validations/user");
const { upload_multer } = require("../modules/multer");

const router = require("express").Router();


// Gets the user's profile information
router.get("/profile", checkLogin, UserController.getProfile)

// Edits the user's profile information
router.post("/profile", checkLogin, UserController.editProfile)


// Uploads the user's profile image
// Uses upload_multer for file upload, imageValidator and expressValidatorMapper middleware for validation of request parameters
router.post("/profile-image", 
    upload_multer.single("image"),
    imageValidator(), expressValidatorMapper,
    checkLogin, UserController.uploadProfileImage)


// Gets all user requests
router.get("/requests", checkLogin, UserController.getAllRequest)

// Gets user requests by status
router.get("/requests/:status", checkLogin, UserController.getRequestsByStatus)


// Changes the status of the specified user request
router.get("/change-status-request/:id/:status", checkLogin, UserController.changeStatusRequest)


module.exports = {
    userRoutes : router
}