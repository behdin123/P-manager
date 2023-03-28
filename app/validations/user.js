const { body } = require("express-validator");
const path = require("path")
function imageValidator() {
    return [
        body("image").custom((value, {req}) => {
            if(Object.keys(req.file).length == 0) throw "Please select an image"
            const ext = path.extname(req.file.originalname);
            const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
            if(!exts.includes(ext)) throw "The submitted format is not valid";
            const maxSize = 2 * 1024*1024;
            if(req.file.size > maxSize) throw "The file size cannot be more than 2 megabytes"
            return true
        })
    ]
}
module.exports = {
    imageValidator
}