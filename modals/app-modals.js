const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

// DB must check for these things when it adds anything in database

const appSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, "Please enter task name"],
    },

    taskNotes: {
      type: String,
      required: [false],
      default: "No Task Notes!!",
    },
    taskDate: {
      type: Date,
      required: [true, "Please add a date for the Task"],
      default: Date.now,
    },
     completed : {
      type: Boolean,
      
      default: false,
     },
  },
  {
    timestamps: true,
  }
);

const todoApp = mongoose.model("todoApp", appSchema);

module.exports = todoApp;
