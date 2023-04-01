const mongoose = require("mongoose");

const ColumnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project: { type: mongoose.Types.ObjectId, required: true },
    order: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ColumnModel = mongoose.model("column", ColumnSchema);

module.exports = {
  ColumnModel,
};