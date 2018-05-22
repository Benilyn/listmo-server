const express = require('express');
const router = express.Router();

const {Project} = require('../models/projectModel');
const {PORT, DATABASE_URL} = require('../config');

router.post('/', (req, res) => {
	const requiredFields = ['projectTitle'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body)) 
	} //for (let i=0)

	Project
		.create({
			projectTitle: req.body.projectTitle,
			projectDueDate: req.body.projectDue,
			projectDetail: req.body.projectDetail,
			projectTask: req.body.projectTask
			})
		.then (
			project => res.status(201).json(project.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
}); //router.post

router.get('/', (req, res) => {
	Project
		.find()
		.populate('projectTask')
		.exec()
		.then(projects => {
			res.json(projects.map(project => project.apiRepr()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.get

router.get('/:id', (req, res) => {
	Project
		.findById(req.params.id)
		.exec()
		.then(project => res.json(project.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.get(/:id)

router.delete('/:id', (req, res) => {
	Project
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
	const updateableFields = ['projectTitle', 'projectDueDate', 'projectDetail'];
	updateableFields.forEach(field => {
    	if (field in req.body) {
    		updated[field] = req.body[field];
    	}
  	}); //updateableFields

  	Project
    	.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    	.exec()
    	.then(updatedProject => res.status(201).json(updatedProject.apiRepr()))
    	.catch(err => res.status(500).json({message: 'Internal server error'}));
}); //router.put



module.exports = router;