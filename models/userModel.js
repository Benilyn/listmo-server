const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	firstName:{type: String, required: true},
	lastName: {type: String, required: true},
	userName:{type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true}
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		userName: this.userName,
		email: this.email,
		password: this.password
	};
};

const User = mongoose.model('User', userSchema);

module.exports = {User};
