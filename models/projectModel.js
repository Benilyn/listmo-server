const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	projectTitle:{type: String, required: true},
	projectDueDate: {type: Date},
	projectDetail:{type: String},
	projectTask: {type: mongoose.Schema.ObjectId, ref: 'Task'}
});

projectSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		projectTitle: this.projectTitle,
		projectDueDate: this.projectDueDate,
		projectDetail: this.projectDetail,
		projectTask: this.projectTask.taskTitle
	};
};

const Project = mongoose.model('Project', projectSchema);

module.exports = {Project};