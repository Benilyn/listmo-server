const mongoose = require('mongoose');
const Project = require('./projectModel.js'); 

const TaskSchema = mongoose.Schema({
//	project: {type: mongoose.Schema.ObjectId, ref: 'Project'},
	taskTitle: {type: String},
	taskDueDate: {type: Date},
	taskDetail:{type: String}
});

TaskSchema.methods.apiRepr = function() {
	return {
//		project: this.project,
		id: this._id,
		taskTitle: this.taskTitle,
		taskDueDate: this.taskDueDate,
		taskDetail: this.taskDetail
	};
};

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task};