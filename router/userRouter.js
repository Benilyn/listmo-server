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

	User
		.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			userName: req.body.userName,
			email: req.body.email,
			password: req.body.password
			})
		.then (
			user => res.status(201).json(user.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
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
