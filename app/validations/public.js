const { param } = require("express-validator")

function mongoIDValidator(){
    return [
        param("id").isMongoId().withMessage("The submitted ID is not valid")
    ]
}
module.exports = {
    mongoIDValidator
}