const chai		=	require('chai');
const chaiHttp	=	require('chai-http');
const should	=	chai.should();
const faker		=	require('faker');
const mongoose	=	require('mongoose');

const {app}	= require('../server.js');
const {User} = require('../models/userModel');
const {PORT, TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);
mongoose.Promise = global.Promise;

function seedUsers() {
	console.log('seeding users');
	const users = [];
	for (i=1; i<=5; i++) {
		users.push(generateUsers());
	}
	return User.insertMany(users);
} //seedUsers function

function generateUsers() {
	return {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		userName: faker.random.alphaNumeric(),
		email: faker.internet.email(),
		password: faker.internet.password()
	};
} //generateUsers function

describe('Users API resource', function() {
  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, {useMongoClient: true});
  }); //before function
  beforeEach(function() {
    return seedUsers();
  }); //beforeEach function

  afterEach(function() {
    console.warn('Deleting User database');
		return mongoose.connection.dropDatabase();
  }); //afterEach function

  after(function() {
    return mongoose.disconnect();
  }); //after function

  describe('User GET endpoint', function() {
    it('should return all existing users', function() {
			let res;
			return chai.request(app)
				.get('/user')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);
				}); //.then function
		}); //'should return all existing users', function()

		it('should return users with right fields', function() {
			return chai.request(app)
				.get('/user')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.length.of.at.least(1);
					res.body.forEach(function(user) {
						user.should.be.a('object');
						user.should.include.keys(
							'id', 'firstName', 'lastName', 'email', 'userName', 'password'
						);
					}); //forEach function
				}); //.then function
		}); //'should return users with right fields', function()
  }); //User GET endpoint

	describe('User POST endpoint', function() {
		it('should add a new user', function() {
			const newUser = {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				email: faker.internet.email(),
				userName: faker.random.alphaNumeric(),
				password: faker.internet.password()
			}; //const newUser

			return chai.request(app)
				.post('/user')
				.send(newUser)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'id', 'firstName', 'lastName', 'email', 'userName', 'password');
					res.body.id.should.not.be.null;
					res.body.firstName.should.equal(newUser.firstName);
					res.body.lastName.should.equal(newUser.lastName);
					res.body.email.should.equal(newUser.email);
					res.body.userName.should.equal(newUser.userName);
					res.body.password.should.equal(newUser.password);
				}); //.then function
		}); //'should add a new user'
	}); //'User POST endpoint', function()



}); //'Users API resource'
