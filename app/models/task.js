const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    column: { type: mongoose.Types.ObjectId, ref: "column", required: true },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("task", TaskSchema);

module.exports = {
  TaskModel,
};