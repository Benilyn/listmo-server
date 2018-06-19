const chai		=	require('chai');
const chaiHttp	=	require('chai-http');
const should	=	chai.should();
const faker		=	require('faker');
const mongoose	=	require('mongoose');

const {app}	= require('../server.js');
const {Task} = require('../models/taskModel');
const {PORT, TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);
mongoose.Promise = global.Promise;

function generateTaskData() {
  return {
    taskTitle: faker.lorem.words(3),
    taskDueDate: faker.date.past(),
    taskDetail: faker.lorem.sentence(),
//    tasktask: faker.random.objectElement()
  };
} // function generateTaskData

function seedTaskData() {
  const seedTasks = [];
  for (let i=0; i<=5; i++) {
    seedTasks.push(generateTaskData());
  }
  return Task.insertMany(seedTasks);
} // function seedTaskData

describe('Task API resource', function() {
  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, {useMongoClient: true});
  }); //before

  beforeEach(function() {
    const tasks = seedTaskData();
    console.log(tasks);
    return tasks;
  }); //beforeEach

  afterEach(function() {
    console.warn('Deleting task database');
    return mongoose.connection.dropDatabase();
  }); //afterEach

  after(function() {
		return mongoose.disconnect();
	}); //after function

  describe('Task GET endpoint', function() {
    it('should return all existing tasks', function() {
  //      console.log(tasks);
      let res;
      return chai.request(app)
      .get('/task')
      .then(function(_res) {
        console.log(_res.body);
        res = _res;
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        res.body.forEach(function(task) {
          task.should.be.a('object');
        }); //.forEach function
      }) //.then function
      .catch(function(err){
        console.error(err);
      });
    }); //it(should return all)

    it('should return task with right fields', function() {
			return chai.request(app)
				.get('/task')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.length.should.be.at.least(1);
					res.body.forEach(function(task) {
						task.should.be.a('object');
						task.should.include.keys(
							'id', 'taskTitle', 'taskDueDate');
					}); //.forEach function
				}) //.then function(res)
				.catch(function(err){
					console.error(err);
				});
		}); //it(should return whines with right fields)
  }); //describe('Task GET endpoint'

  describe('Task on POST endpoint', function() {
    it.only('should add a task', function() {
      const newTask = {
        taskTitle: faker.lorem.words(3),
        taskDueDate: faker.date.past(),
        taskDetail: faker.lorem.sentence()
      }; //const newTask
      return chai.request(app)
        .post('/task')
        .send(newTask)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'taskTitle', 'taskDueDate', 'taskDetail');
          res.body.id.should.not.be.null;
          res.body.taskTitle.should.equal(newTask.taskTitle);
          res.body.taskDetail.should.equal(newTask.taskDetail);
        })
        .catch(function(err) {
          console.log(err);
        });
    }); //should add a task
  }); //describe('Task on POST endpoint'


}); //describe('Task API resource'
