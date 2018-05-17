const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	title:{type: String, required: true},
	dueDate: {type: Date},
	details:{type: String},
	projectTask: {type: String}
});

projectSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		dueDate: this.dueDate,
		details: this.details,
		projectTask: this.projectTask
	};
};

const Project = mongoose.model('Project', projectSchema);

module.exports = {Project};