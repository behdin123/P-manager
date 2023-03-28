const autoBind = require("auto-bind");
const res = require("express/lib/response");
const { UserModel } = require("../models/user");
const { TeamModel } = require("../models/team");
class TeamController {
  constructor() {
    autoBind(this);
  }
  async createTeam(req, res, next) {
    try {
      const { name, username, description } = req.body;
      const owner = req.user._id;
      const team = await TeamModel.create({
        name,
        description,
        username,
        owner,
      });
      if (!team) throw { status: 500, message: "Creating the team encountered a problem" };
      return res.status(201).json({
        status: 201,
        success: true,
        message: "The team was successfully created",
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfTeam(req, res, next) {
    try {
      const teams = await TeamModel.find({});
      return res.status(200).json({
        status: 200,
        success: true,
        teams,
      });
    } catch (error) {
      next(error);
    }
  }
  async getTeamById(req, res, next) {
    try {
      const teamID = req.params.id;
      const team = await TeamModel.findById(teamID);
      if (!team) throw { status: 404, message: "No team was found" };
      return res.status(200).json({
        status: 200,
        success: true,
        team,
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyTeams(req, res, next) {
    try {
      const userID = req.user._id;
      const teams = await TeamModel.aggregate([
        {
          $match : {
            $or: [{ owner: userID }, { users: userID }]
          },
        },
        {
          $lookup : {
            from : "users",
            localField : "owner",
            foreignField : "_id",
            as : "owner"
          }
        },
        {
          $project : {
            "owner.roles" : 0,
            "owner.password" : 0,
            "owner.token" : 0,
            "owner.teams" : 0,
            "owner.skills" : 0,
            "owner.inviteRequests" : 0,
          }
        },
        {
          $unwind : "$owner"
        }
      ]);
      return res.status(200).json({
        status: 200,
        success: true,
        teams,
      });
    } catch (error) {}
  }
  async removeTeamById(req, res, next) {
    try {
      const teamID = req.params.id;
      const team = await TeamModel.findById(teamID);
      if (!team) throw { status: 404, message: "No team was found" };
      const result = await TeamModel.deleteOne({ _id: teamID });
      if (result.deletedCount == 0)
        throw { status: 500, message: "The team was not deleted. Please try again" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "The team was successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
  async findUserInTeam(teamID, userID) {
    const result = await TeamModel.findOne({
      $or: [{ owner: userID }, { users: userID }],
      _id: teamID,
    });
    return !!result;
  }
  //http:anything.com/team/invite/:teamID/:username
  async inviteUserToTeam(req, res, next) {
    try {
      const userID = req.user._id;
      const { username, teamID } = req.params;
      const team = await this.findUserInTeam(teamID, userID);
      if (!team)
        throw { status: 400, message: "No team was found to invite people to" };
      const user = await UserModel.findOne({ username });
      if (!user)
        throw {
          status: 400,
          message: "The user you are trying to invite to the team was not found",
        };
      const userInvited = await this.findUserInTeam(teamID, user._id);
      if (userInvited)
        throw {
          status: 400,
          message: "The user has already been invited to the team",
        };
      const request = {
        caller: req.user.username,
        requestDate: new Date(),
        teamID,
        status: "pending",
      };
      const updateUserResult = await UserModel.updateOne(
        { username },
        {
          $push: { inviteRequests: request },
        }
      );
      if (updateUserResult.modifiedCount == 0)
        throw { status: 500, message: "The invitation request was not registered" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "The request was successfully registered",
      });
    } catch (error) {
      next(error);
    }
  }
  async updateTeam(req, res, next) {
    try {
      console.log(req.body);
      const data = { ...req.body };
      Object.keys(data).forEach((key) => {
        if (!data[key]) delete data[key];
        if (["", " ", undefined, null, NaN].includes(data[key]))
          delete data[key];
      });
      const userID = req.user._id;
      const { teamID } = req.params;
      const team = await TeamModel.findOne({ owner: userID, _id: teamID });
      if (!team) throw { status: 404, message: "No team was found with these specifications" };
      const teamEditResult = await TeamModel.updateOne(
        { _id: teamID },
        { $set: data }
      );
      if (teamEditResult.modifiedCount == 0)
        throw { status: 500, message: "The update of team information was not successful" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "The update was successful",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  removeUserFromTeam() {}
}

module.exports = {
  TeamController: new TeamController(),
};
