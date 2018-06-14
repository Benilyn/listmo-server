const chai		=	require('chai');
const chaiHttp	=	require('chai-http');
const should	=	chai.should();
const faker		=	require('faker');
const mongoose	=	require('mongoose');

const {app}	= require('../server.js');
const {Project} = require('../models/projectModel');
const {PORT, TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);
mongoose.Promise = global.Promise;

function generateProjectData() {
  return {
    projectTitle: faker.lorem.words(3),
    projectDueDate: faker.date.past(),
    projectDetail: faker.lorem.sentence(),
    projectTask: faker.random.arrayElement(3)
  };
} // function generateProjectData

function seedProjectData() {
  const seedProjects = [];
  for (let i=0; i<=5; i++) {
    seedProjects.push(generateProjectData());
  }
  return Project.insertMany(seedProjects);
} // function seedProjectData

describe('Projects API resource', function() {
  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, {useMongoClient: true});
  }); //before

  beforeEach(function() {
    const projects = seedProjectData();
    console.log(projects);
    return projects;
  }); //beforeEach

  afterEach(function() {
    console.warn('Deleting prroject database');
    return mongoose.connection.dropDatabase();
  }); //afterEach

  after(function() {
		return mongoose.disconnect();
	}); //after function

  describe('Project on GET endpoint', function() {
    it('should return all existing projects', function() {
//      console.log(projects);
			let res;
			return chai.request(app)
			.get('/project')
			.then(function(_res) {
				console.log(_res.body);
				res = _res;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);
				res.body.forEach(function(project) {
					project.should.be.a('object');
				}); //.forEach function
			}) //.then function
			.catch(function(err){
				console.error(err);
			});
		}); //it(should return all)

    it('should return projects with right fields', function() {
			return chai.request(app)
				.get('/project')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.length.should.be.at.least(1);
					res.body.forEach(function(project) {
						project.should.be.a('object');
						project.should.include.keys(
							'id', 'projectTitle', 'projectDueDate', 'projectTask');
					}); //.forEach function
				}) //.then function(res)
				.catch(function(err){
					console.error(err);
				});
		}); //it(should return whines with right fields)
  }); //describe('Project on GET endpoint'

  describe('Project on POST endpoint', function() {
    it('should add a project', function() {
      const newProject = {
        projectTitle: faker.lorem.words(3),
        projectDueDate: faker.date.past(),
        projectDetail: faker.lorem.sentence(),
        projectTask: faker.random.arrayElement(3)
      }; //const newProject
      return chai.request(app)
        .post('/project')
        .send(newProject)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'projectTitle', 'projectDueDate', 'projectDetail', 'projectTask');
          res.body.id.should.not.be.null;
          res.body.projectTitle.should.equal(newProject.projectTitle);
//          res.body.projectDueDate.should.equal(newProject.projectDueDate);
          res.body.projectDetail.should.equal(newProject.projectDetail);
//          res.body.projectTask.should.equal(newProject.projectTask);
        })
        .catch(function(err) {
          console.log(err);
        });
    }); //should add a project
  }); //describe('Project on POST endpoint'

  describe('Project DELETE endpoint', function() {
		it('should delete a project by id', function() {
			let project;
			return Project
				.findOne()
				.exec()
				.then(function(_project) {
					project = _project;
					return chai.request(app).delete(`/project/${project._id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Project.findById(project._id).exec();
				})
				.then(function(_project) {
					should.not.exist(_project);
				});
		}); //'should delete a project by id', function()
	}); //'Project DELETE endpoint', function()

  describe('Project PUT endpoint', function() {
		it.only('should update fields you send over', function() {
			const updateProject = {
        projectTitle: faker.lorem.words(3),
        projectDueDate: faker.date.past(),
        projectDetail: faker.lorem.sentence(),
        projectTask: faker.random.arrayElement(3)
			};

			return Project
				.findOne()
				.exec()
				.then(function(project) {
					updateProject.id = project.id;
					return chai.request(app)
						.put(`/project/${project.id}`)
						.send(updateProject);
				})
				.then(function(res) {
					console.log(res.body);
					res.should.have.status(201);
					res.body.projectTitle.should.equal(updateProject.projectTitle);
//					res.body.projectDueDate.should.equal(updateProject.projectDueDate);
					res.body.projectDetail.should.equal(updateProject.projectDetail);
//					res.body.projectTask.should.equal(updateProject.projectTask);
					return Project.findById(updateProject.id).exec();
				})
				.then(function(project) {
					project.projectTitle.should.equal(updateProject.projectTitle);
//					project.projectDueDate.should.equal(updateProject.projectDueDate);
					project.projectDetail.should.equal(updateProject.projectDetail);
//					project.projectTask.should.equal(updateProject.projectTask);
				});
		}); //'should update fields you send over', function()
	}); //'Project PUT endpoint', function

}); // describe('Projects API resource')
