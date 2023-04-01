/**
 * This file defines a Mongoose schema for a 'column' document.
 * The schema has three properties: 'title', 'project', and 'order', all of which are required. 
 * The 'project' property is a reference to the project to which the column belongs.
 */

// Import Mongoose library
const mongoose = require("mongoose");

// Define a new Mongoose schema for columns
const ColumnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Column title field
    project: { type: mongoose.Types.ObjectId, required: true }, // Reference to the parent project's ObjectId
    order: { type: Number, required: true }, // Order of the column in the project
  },
  {
    timestamps: true,
  }
);

// Create a new Mongoose model using the ColumnSchema
const ColumnModel = mongoose.model("column", ColumnSchema);

module.exports = {
  ColumnModel,
};