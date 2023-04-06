/**
 * This file exports functions for validating team-related data inputs.
 * The 'createTeamValidator' function returns an array of Express validator middleware functions for creating a new team, including validating the team name and username.
 * The 'inviteToTeam' function returns an array of Express validator middleware functions for inviting a user to a team.
 */

const { body, param } = require("express-validator");
const { TeamModel } = require("../models/team");

 function createTeamValidator(){
     return [
          body().custom((value, { req }) => {
            console.log("Request Body:", req.body);
            return true;
          }),
        
         // Validator for the team name
         body("name")
            .isLength({min : 5})
            .withMessage("The team name cannot be less than 5 characters"),
        
         // Validator for the team description
         body("description")
            .notEmpty()
            .withMessage("The description cannot be empty"),

         // Validator for the team username
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
         // Add validation functions for inviting a user to a team
     ]
 }

 module.exports = {
    createTeamValidator
 }