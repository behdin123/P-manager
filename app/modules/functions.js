/**
 * This file exports utility functions related to hashing, creating and verifying JWT tokens, 
 * creating upload paths, and creating links for files.
 */

// Import dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


/**
 * Returns a hashed string based on the input string.
 * @param {string} str - The input string to be hashed.
 * returns string - The hashed string.
 */
function hashString(str){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt)
}


/**
 * Generates a JWT token based on the input payload.
 * @param {object} payload - The payload to be included in the token.
 * returns string - The generated JWT token.
 */
function tokenGenerator(payload){
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn : "365 days"})
    return token
}


/**
 * Verifies the validity of a JWT token.
 * @param {string} token - The JWT token to be verified.
 * returns object - The payload of the verified JWT token.
 * throws object - Throws an error if the token is invalid or missing the username.
 */
function verifyJwtToken(token) {
    const result = jwt.verify(token, process.env.SECRET_KEY);
    if(!result?.username) throw {status : 401, message : "Please log in to your account"}
    return result
}


/**
 * Creates a path for uploading files based on the current date.
 * returns string - The created path.
 */
function createUploadPath(){
    let d = new Date();
    const Year = ""+d.getFullYear();
    const Month = d.getMonth() + "";
    const day = "" + d.getDate();
    const uploadPath = path.join(__dirname, "..", "..", "public", "upload", Year, Month, day);
    fs.mkdirSync(uploadPath, {recursive : true});
    return path.join("public", "upload", Year, Month, day);
}


/**
 * Creates a link for a file address.
 * @param {string} fileAddress - The file address, to create a link for.
 * @param {object} req - The Express request object.
 * returns string - The created file link.
 */
function createLinkForFiles(fileAddress, req){
    return fileAddress? (req.protocol + "://" + req.get("host")+ "/" + (fileAddress.replace(/[\\\\]/gm, "/"))) : undefined
}

module.exports = {
    hashString,
    createLinkForFiles,
    tokenGenerator,
    verifyJwtToken,
    createUploadPath
}