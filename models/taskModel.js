const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
	taskTitle: {type: mongoose.Schema.ObjectId, ref: 'Project'},
	taskDueDate: {type: Date},
	taskDetail:{type: String},
	taskTask: {type: String}
});

TaskSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		taskTitle: this.project.projectTask,
		taskDueDate: this.taskDueDate,
		taskDetail: this.taskDetail
	};
};

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task};