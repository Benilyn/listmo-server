const express = require('express');
const router = express.Router();

const {User} = require('../models/userModel');
const {PORT, DATABASE_URL} = require('../config');

router.post('/', (req, res) => {
	const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'password'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body))
	} //for (let i=0)

	let {userName, password, email = '', firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({userName})
    .count()
    .then(count => {
			console.log(userName);
      if (count > 0) {
				console.log(count);
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
			console.log(hash);
      return User.create({
        userName,
        password: hash,
				email,
        firstName,
        lastName
      });
    })
    .then(user => {
			console.log(user);
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: err});
    });
}); //router.post

router.get('/', (req, res) => {
	User
		.find()
		.exec()
		.then(users => {
			res.json(users.map(user => user.apiRepr()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.get

router.get('/:id', (req, res) => {
	User
		.findById(req.params.id)
		.exec()
		.then(user => res.json(user.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.get(/:id)

router.delete('/:id', (req, res) => {
	User
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => {
			res.status(204).json({message: 'Success'});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.delete

router.put('/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    	res.status(400).json({
     		error: 'Request path id and request body id values must match'
    	}); //res.status(400)
 	} //if

	const updated = {};
	const updateableFields = ['firstName', 'lastName', 'userName', 'email', 'password'];
	updateableFields.forEach(field => {
    	if (field in req.body) {
    		updated[field] = req.body[field];
    	}
  	}); //updateableFields

  	User
    	.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    	.exec()
    	.then(updatedUser => res.status(201).json(updatedUser.apiRepr()))
    	.catch(err => res.status(500).json({message: 'Internal server error'}));
}); //router.put



module.exports = router;
