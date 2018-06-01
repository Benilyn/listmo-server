const express = require('express');
const router = express.Router();

const {Task} = require('../models/taskModel');
const {PORT, DATABASE_URL} = require('../config');

router.post('/', (req, res) => {
	const requiredFields = ['taskTitle'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body))
	} //for (let i=0)

	Task
		.create({
			taskProject: req.body.taskProject,
			taskTitle: req.body.taskTitle,
			taskDueDate: req.body.taskDueDate,
			taskDetail: req.body.taskDetail
			})
	//	.then(
	//		task => task.populate('project'))
		.then (
			task => res.status(201).json(task.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
}); //router.post

router.get('/', (req, res) => {
	Task
		.find()
		.exec()
		.then(tasks => {
			res.json(tasks.map(task => task.apiRepr()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.get

router.get('/:id', (req, res) => {
	Task
		.findById(req.params.id)
		.exec()
		.then(task => res.json(task.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
}); //router.get(/:id)

router.delete('/:id', (req, res) => {
	Task
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
	const updateableFields = ['taskTitle', 'taskDueDate', 'taskDetail'];
	updateableFields.forEach(field => {
    	if (field in req.body) {
    		updated[field] = req.body[field];
    	}
  	}); //updateableFields

  	Task
    	.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    	.exec()
    	.then(updatedTask => res.status(201).json(updatedTask.apiRepr()))
    	.catch(err => res.status(500).json({message: 'Internal server error'}));
}); //router.put



module.exports = router;
