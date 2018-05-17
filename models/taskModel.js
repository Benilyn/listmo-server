const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
	taskTitle:{type: String, required: true},
	taskDueDate: {type: Date},
	taskDetail:{type: String},
	taskTask: {type: String}
});

TaskSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		taskTitle: this.taskTitle,
		taskDueDate: this.taskDueDate,
		taskDetail: this.taskDetail
	};
};

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task};