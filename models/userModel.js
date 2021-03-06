const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



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
		firstName:this.firstName,
		lastName: this.lastName,
		userName: this.userName,
		email: this.email,
		password: this.password
	};
};



userSchema.methods.serialize = function() {
  return {
		id: this._id,
    userName: this.userName || '',
    email: this.email || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};
