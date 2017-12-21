
// app.js

const express = require('express');
const logger = require('morgan');
const errorhandler = require('errorhandler');

const bodyParser = require('body-parser');
const assert = require('assert');

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

// --
// Schema
//

const accountSchema = new Schema({
  name: String,
  balance: Number
});
const Account = mongoose.model('Account', accountSchema);

// --
// Routes and Handlers
//

app.get('/accounts', (req, res) => {
  Account.find({}).sort({_id:-1}).exec(function(err, accounts) {
    assert.equal(err, null, '** ERROR/GET **');
    res.status(200).send(accounts);
  });
});

app.post('/accounts', (req, res) => {
  new Account(req.body).save(function(err, account) {
    assert.equal(err, null, '** ERROR/POST **');
    res.status(201).send(account);
  });
});

app.put('/accounts/:id', (req, res) => {
  Account.findById(req.params.id).exec(function(err, account) {
    assert.equal(err, null, '** ERROR/PUT(find) **');
    if(account) {
      account.set(req.body).save(function(err, account){
        assert.equal(err, null, '** ERROR/PUT(save) **');
        res.status(200).send(account);
      });
    } else {
      res.status(404).send('[not found]');
    }
  });
});

app.delete('/accounts/:id', (req, res) => {
  Account.findById(req.params.id).exec(function(err, account) {
    assert.equal(err, null, '** ERROR/DELETE(find) **');
    if(account) {
      account.remove(function(err, account){
        assert.equal(err, null, '** ERROR/DELETE(remove) **');
        res.status(200).send(account);
      });
    } else {
      res.status(404).send('[not found]');
    }
  });
});

// --
// App Export
//

app.locals.connectDB = function(url) {
  mongoose.connect(url, {useMongoClient: true});
};

module.exports = app;
