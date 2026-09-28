const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true},
  description: {type: String, trim: true},
  completed: {type: Boolean, default: false},
  dueDate: {type: Date, default: null},
  completedAt: {type: Date, default: null},
},{
    timeseries: true
});

module.exports = mongoose.model('Task', taskSchema)