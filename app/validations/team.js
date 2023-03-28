const { body, param } = require("express-validator");
const { TeamModel } = require("../models/team");

 function createTeamValidator(){
     return [
         body("name").isLength({min : 5}).withMessage("The team name cannot be less than 5 characters"),
         body("description").notEmpty().withMessage("The description cannot be empty"),
         body("username").custom(async (username) => {
             const usernameRegep = /^[a-z]+[a-z0-9\_\.]{3,}$/gim
            if(usernameRegep.test(username)){
                const team = await TeamModel.findOne({username});
                if(team) throw "The username has been used by another team before";
                return true
            }
            throw "Enter the username correctly"
         })
     ]
 }
 function inviteToTeam(){
     return [
         
     ]
 }

 module.exports = {
    createTeamValidator
 }