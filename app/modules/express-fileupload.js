/**
 * This file exports a middleware function for uploading a file.
 * The function checks whether a file has been submitted and whether it is in a valid format.
 * If the file is valid, it is moved to the appropriate directory.
*/

const fileupload = require("express-fileupload");
const path = require("path");
const { createUploadPath } = require("./functions");

const uploadFile = async (req, res, next) => {
    
    try {
        // Check if a file was submitted
        if(req.file || Object.keys(req.files).length == 0) throw {status : 400, message : "Please submit the project's cover image"}

        let image = req.files.image
        let type = path.extname(image.name);

        // Check if the file format is valid
        if(![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(type)) throw {status : 400, message : "The submitted image format is not valid"}

        // Set the image path
        const image_path =  path.join(createUploadPath(), (Date.now() + type))
        req.body.image = image_path.substring(7)

        let uploadPath = path.join(__dirname, "..", "..", image_path);
        console.log(uploadPath)

        // Move the file to the appropriate directory
        image.mv(uploadPath, (err) => {
            console.log(err)
            if(err) throw {status : 500, message : "Image upload failed"}
            next();
    })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadFile
}
