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
    it.only('should return all existing projects', function() {
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
  }); //describe('Project on GET endpoint'
}); // describe('Projects API resource')
