
// test_api.js

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';

// app to test
const app = require('../app');


describe('Test REST API', function() {

  let server = null;
  let db = null;


  // --
  // Start the app and connect to db
  //

  before(function(done){

    // connect test to db
    MongoClient.connect(url).then(function(dbS) {
      db = dbS;
      // start the app to test
      app.locals.connectDB(url); // connect app to db
      server = app.listen(3001, function(){ done(); });
    });
  });


  // --
  // Remove all accounts from test database
  //

  beforeEach(function(done){
    db.collection('accounts').remove({}, function(err){
      assert.equal(err, null);
      done();
    });
  });


  // --
  // Shut down server (app to test)
  //

  after(function(){

    server.close(function(){
      setTimeout(function () { // wait to get the test summary
        process.exit(0);
      }, 100);
    });
  });


  // --
  // Test GET
  //

  it('should list all accounts', function(done){

    // insert using db api
    db.collection('accounts').insertMany([
      {"balance": 10, "name":"AB"},
      {"balance": 20, "name":"DC"}
    ], function(err){

      assert.equal(err, null);

      // select using rest api to test
      chai.request(app).get('/accounts').end(function(err, res){

        assert.equal(res.status, 200);

        const actualAccounts = res.body;

        assert.equal(actualAccounts.length, 2);
        assert.equal(Object.keys(actualAccounts[0]).length, 3);

        actualAccounts.forEach(account=>{delete account._id});
        assert.deepEqual(actualAccounts, [
          {"balance": 20, "name":"DC"},
          {"balance": 10, "name":"AB"}
        ]);

        done();
      });//chai.request
    }); // insertMany
  });//it


  // --
  // Test POST
  //

  it('should add a single account', function(done){

    // insert using rest api to test
    chai.request(app).post('/accounts').send({
      "balance": 100,
      "name":"ABC"
    }).end(function(err, res){

      assert.equal(err, null);
      assert.equal(res.status, 201);

      // select using db api
      db.collection('accounts').findOne({
        "balance": 100,
        "name":"ABC"
      }, function(err, account){

        assert.equal(err, null);

        account._id = account._id.toHexString();
        assert.deepEqual(account, res.body);

        assert.equal(account.balance, 100);
        assert.equal(account.name, "ABC");

        done();
      }); // findOne
    }); // chai.request
  }); // it


  // --
  // Test PUT
  //

  it('should update a single account', function(done){

    // insert using db api
    db.collection('accounts').insertOne({
      "balance": 100,
      "name":"ABC"
    }, function(err, res){

      assert.equal(err, null);

      const accountID = res.insertedId;

      // update using rest api to test
      chai.request(app).put('/accounts/'+accountID).send({
        "balance": 200,
        "name":"DEF"
      }).end(function(err, res){

        assert.equal(err, null);
        assert.equal(res.status, 200);

        // select using db api
        db.collection('accounts').findOne({_id: accountID}, function(err, account){

          assert.equal(err, null);

          account._id = account._id.toHexString();
          assert.deepEqual(account, res.body);

          assert.equal(account.balance, 200);
          assert.equal(account.name, "DEF");

          done();
        }); // findOne
      }); // chai.request
    }); // insertOne
  }); // it


  // --
  // Test DELETE
  //

  it('should delete a single account', function(done){

    // insert using db api
    db.collection('accounts').insertOne({
      "balance": 100,
      "name":"ABC"
    }, function(err, res){

      assert.equal(err, null);

      const accountID = res.insertedId;

      // delete using rest api to test
      chai.request(app).delete('/accounts/'+accountID).send().end(function(err, res){

        assert.equal(err, null);
        assert.equal(res.status, 200);

        // select using db api
        db.collection('accounts').findOne({_id: accountID}, function(err, account){

          assert.equal(err, null);
          assert.equal(account, null);

          done();
        }); // findOne
      }); // chai.request
    }); // insertOne
  }); // it

}); // describe
