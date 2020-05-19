const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: Object,
    required: true
  },
  teamMembers: [
    {
      email: {
        type: String
      },
      name: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
  },
  hoursPerDay: {
    type: Number,
    default: 2
  },
  fee: {
    type: Number
  },
  classState: {
    type: String
  } 
});

module.exports = Project = mongoose.model("projects", ProjectSchema);
