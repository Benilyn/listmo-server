const mongoose = require('mongoose');
const Task = require('./taskModel.js');

const projectSchema = mongoose.Schema({
	projectTitle:{type: String, required: true},
	projectDueDate: {type: String, default: ''},
	projectDetail:{type: String, default: ''},
	projectTask: [{type: mongoose.Schema.ObjectId, ref: 'Task'}],
	user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

projectSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		projectTitle: this.projectTitle,
		projectDueDate: this.projectDueDate,
		projectDetail: this.projectDetail,
		projectTask: this.projectTask,
		user: this.user
	};
};

const Project = mongoose.model('Project', projectSchema);

module.exports = {Project};
