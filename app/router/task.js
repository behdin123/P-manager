/**
 * This file defines the routes for handling task-related operations.
 * Each route uses the TaskController to handle the operation.
 *
 * Middleware:
 * - checkLogin: Ensures the user is logged in before accessing protected routes
 * - mongoIDValidator: Validates MongoDB ObjectIds in the route parameters
 * - expressValidatorMapper: Handles validation errors
 */

const { TaskController } = require("../controllers/task.controller");

const { checkLogin } = require("../middlewares/autoLogin");

const { mongoIDValidator } = require("../validations/public");

const { expressValidatorMapper } = require("../middlewares/checkErrors");

const router = require("express").Router();

// Create a new task
router.post("/create", checkLogin, TaskController.createTask);

// Get a task by its ID
router.get("/:taskId", checkLogin, mongoIDValidator("taskId"), expressValidatorMapper, TaskController.getTaskById);

// Update a task
router.put("/:taskId/update", checkLogin, mongoIDValidator("taskId"), expressValidatorMapper, TaskController.updateTask);

// Delete a task
router.delete("/:taskId/delete", checkLogin, mongoIDValidator("taskId"), expressValidatorMapper, TaskController.deleteTask);

// Update the column of a task (used when dragging and dropping a task between columns)
router.put("/:taskId/update-column", checkLogin, mongoIDValidator("taskId"), expressValidatorMapper, TaskController.updateTaskColumn);


module.exports = {
  taskRoutes: router,
};