const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

const mongoURL = {
  atlas: 'mongodb+srv://paul:paul@cluster0-bices.mongodb.net/test?retryWrites=true&w=majority',
  local: 'mongodb://127.0.0.1:27017/project-manager',
  docker: 'mongodb://mongo:27017/project-manager'
};

// Dev tools
const cors = require('cors');

const apiRouter = require('./server/controllers/api');
const authRouter = require('./server/controllers/auth');
const groupRouter = require('./server/controllers/groups');
const userRouter = require('./server/controllers/user');

const port = process.env.port || 3000;

const app = express();

app.use(cors());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(logger('dev', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist/front-Project-Manager')));

mongoose.connect(mongoURL.local, {
  useNewUrlParser: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connection to Mongo DB success');
}).catch((error) => console.error(error));

// Controllers
app.use('/api', apiRouter);
app.use('/api', authRouter);
app.use('/api/group', groupRouter);
app.use('/api/user', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/front-Project-Manager/index.html'));
}); */


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
