const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  tasks: String,
  startDate: Date,
  endDate: Date,
  teamMembers: [TeamMemberSchema]
});

module.exports = mongoose.model('Project', ProjectSchema);
