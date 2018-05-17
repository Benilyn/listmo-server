const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
	title:{type: String, required: true},
	dueDate: {type: Date},
	details:{type: String},
	projectTask: {type: String}
});

TaskSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		dueDate: this.dueDate,
		details: this.details,
		projectTask: this.projectTask
	};
};

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task};