let createError = require('http-errors');
let bodyParser = require('body-parser');
let express = require('express');
let multer = require('multer');
let upload = multer();
let app = express();

const router = require('./routes/index');
const middleware = require('./middleware/index');

app.use('/files', express.static(__dirname + '/files'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array('files'));
router(app, middleware);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

module.exports = app;
