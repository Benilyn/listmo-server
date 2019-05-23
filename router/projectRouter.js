const express = require('express');
const router = express.Router();
const passport = require('passport');

const {Project} = require('../models/projectModel');
const {Task} = require('../models/taskModel');
const {PORT, DATABASE_URL} = require('../config');

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', (req, res)=>{
	Project.find().then(projects=>res.send(projects));
});

router.post('/', jwtAuth, (req, res) => {
	const requiredFields = ['projectTitle'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		} //if (!(field in req.body))
	} //for (let i=0)

	let newProject = {
			projectTitle: req.body.projectTitle,
			projectDueDate: req.body.projectDueDate,
			projectDetail: req.body.projectDetail,
			user: req.user.id
			};
			console.log(newProject);

	Project
		.create(newProject)
		.then (
			project => res.status(201).json(project.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
}); //router.post

router.get('/user',jwtAuth, (req, res) => {
	Project
		.find({user: req.user.id})
		.then(projects => {
			let projectTasks = [];
			projects.map(project => {

				Task.find({taskProject: project._id})
				.then(tasks => {
					project.projectTask = tasks;
					projectTasks.push(project.apiRepr());
				}) //.then(tasks => {
			}) //projects.map
			setTimeout(function () {
				res.json(projectTasks);
			}, 100);

		}) //.then(projects => {
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
	else{
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
	}
}); //router.put


router.delete('/:id', (req, res) => {
	Project
		.findOneAndRemove({_id: req.params.id})
		.exec()
		.then((delproj) => {
			console.log(delproj);
			console.log(`Deleted project \`${req.params.id}\``);
			res.status(204).end();
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: 'Unable to delete project'});
		});
}); //router.delete

module.exports = router;
