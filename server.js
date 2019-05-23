const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');

const {localStrategy, jwtStrategy} = require('./strategies.js');

const userRouter = require('./router/userRouter');
const projectRouter = require('./router/projectRouter');
const taskRouter = require('./router/taskRouter');
const loginRouter = require('./router/loginRouter');
const authRouter = require('./router/authRouter');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {User} = require('./models/userModel');
const {Project} = require('./models/projectModel');
const {Task} = require('./models/taskModel');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
const passport = require('passport');
passport.use(localStrategy);
passport.use(jwtStrategy);
//app.use(passport.initialize());
//app.use(passport.session());


app.use(cors());
app.use(morgan('dev'));
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/login', authRouter);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));



app.use('*', function(req, res) {
  return res.status(404).json({message: 'Not Found'});
});

// referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, {useMongoClient: true}, err => {
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

//app.get('/login', (req, res) => {
//  if (!(req.user)) {
//    const message = 'No user logged in';
//    console.error(message);
//    res.sendStatus(401);
//  }
//  else{
//      res.sendStatus(200);
//  }
//});

module.exports = {app, runServer, closeServer};
