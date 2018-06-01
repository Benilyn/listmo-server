const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./router/userRouter');
const projectRouter = require('./router/projectRouter');
const taskRouter = require('./router/taskRouter');
const loginRouter = require('./router/loginRouter');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {User} = require('./models/userModel');
const {Project} = require('./models/projectModel');
const {Task} = require('./models/taskModel');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

// logging
app.use(cors());
app.use(morgan('dev'));
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
//app.use('/login', loginRouter);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

//---------------------------------
// start of login
//--------------------------------

const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    function(userName, password, done) {
        User.findOne({ userName: userName })
          .then(function(user) {
              if (!user || !user.password === password) {
                  return done(null, false, { message: 'Incorrect username or password.' });
              }
              done(null, user);
          }); //.then function
    } //function(email, password, done)
)); //passport.use

passport.serializeUser(function(user, done) {
    done(null, user.id);
}); //passport.serializeUser

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id })
      .then(function(user) {
          done(null, user);
      }) //.then function
    .catch(function(err) {
        done(err, null);
    }); //.catch function
}); //passport.deserializeUser

app.post ('/login', passport.authenticate('local'), function (req, res) {
  res.json(req.user.apiRepr());
}); //router.post

//---------------------------------
// end of login
//--------------------------------


app.use('*', function(req, res) {
  return res.status(404).json({message: 'Not Found'});
});

// referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

app.get('/login', (req, res) => {
  if (!(req.user)) {
    const message = 'No user logged in';
    console.error(message);
    res.sendStatus(401);
  }
  else{
      res.sendStatus(200);
  }
});

module.exports = {app, runServer, closeServer};
