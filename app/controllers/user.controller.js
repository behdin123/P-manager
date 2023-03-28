const { UserModel } = require("../models/user");
const { createLinkForFiles } = require("../modules/functions");

class UserController {
  getProfile(req, res, next) {
    try {
      const user = req.user;
      user.profile_image = createLinkForFiles(user.profile_image, req);
      return res.status(200).json({
        status: 200,
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfile(req, res, next) {
    try {
      let data = { ...req.body };
      const userID = req.user._id;
      let fields = ["first_name", "last_name", "skills"];
      let badValues = ["", " ", null, undefined, 0, -1, NaN, [], {}];
      Object.entries(data).forEach(([key, value]) => {
        console.log(key, value);
        if (!fields.includes(key)) delete data[key];
        if (badValues.includes(value)) delete data[key];
      });
      console.log(data);
      const result = await UserModel.updateOne({ _id: userID }, { $set: data });
      if (result.modifiedCount > 0) {
        return res.status(200).json({
          status: 200,
          succerss: true,
          message: "The profile was updated successfully.",
        });
      }
      throw { status: 400, message: "The update was not successful" };
    } catch (error) {
      next(error);
    }
  }
  async uploadProfileImage(req, res, next) {
    try {
      const userID = req.user._id;
      const filePath = req.file?.path?.substring(7);
      const result = await UserModel.updateOne(
        { _id: userID },
        { $set: { profile_image: filePath } }
      );
      if (result.modifiedCount == 0)
        throw { status: 400, message: "The update was not successful" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "The update was successful",
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllRequest(req, res, next) {
    try {
      const userID = req.user._id;
      const inviteRequests = await UserModel.aggregate([
        {
          $match : {
            _id: userID 
          }
        },
        {
          $lookup : {
            from : "users",
            localField : "inviteRequests.caller",
            foreignField : "username",
            as : "callerInfo"
          }
        }
      ]);
      return res.json({
        requests: inviteRequests,
      });
    } catch (error) {
      next(error);
    }
  }
  async getRequestsByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const userID = req.user._id;
      const requests = await UserModel.aggregate([
        {
          $match: { _id: userID },
        },
        {
          $project: {
            inviteRequests: 1,
            _id: 0,
            inviteRequests : {
                $filter : {
                    input : "$inviteRequests",
                    as : "request",
                    cond : {
                        $eq : ["$$request.status", status]
                    }
                }
            }
          },
        },
      ]);
      return res.status(200).json({
        status: 200,
        success: true,
        requests : requests?.[0]?.inviteRequests || []
      });
    } catch (error) {
      next(error);
    }
  }
  async changeStatusRequest(req, res, next) {
      try {
          const {id, status} = req.params;
          const request = await UserModel.findOne({"inviteRequests._id" : id})
          if(!request) throw {status : 404, message : "No request was found with these specifications"}
          const findRequest = request.inviteRequests.find(item => item.id == id);
          if(findRequest.status !== "pending") throw {status : 400, message : "This request has already been accepted or rejected before"}
          if(!["accepted", "rejected"].includes(status)) throw {status : 400, message : "The submitted information is not valid"}
          const updateResult = await UserModel.updateOne({"inviteRequests._id" : id}, {
              $set : {"inviteRequests.$.status" : status}
          })
          if(updateResult.modifiedCount == 0) throw {status : 500, message : "The status of the request was not changed"}
          return res.status(200).json({
              status : 200,
              success : true,
              message : "The status of the request was changed successfully."
          })
        } catch (error) {
        next(error)
      }
  }
}
module.exports = {
  UserController: new UserController(),
};
