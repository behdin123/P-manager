const { body } = require("express-validator");

function createProjectValidator(){
    return [
        body("title").notEmpty().withMessage("The title shouldn't be empty"),
        body("tags").isArray({min : 0, max : 10}).withMessage("The maximum use of hashtags is 10 "),
        body("text").notEmpty().isLength({min : 20}).withMessage("Project description cannot be empty and must be at least 25 characters long"),
    ]
}
module.exports = {
    createProjectValidator
}