# node_intro_module4_lab

edX Introduction to NodeJS   
Module 4 Assignment Lab: REST API with Mongoose

> 1) Walk us through the design of your project.
Why did you design your project the way you did?
What difficulties did you overcome?

The design of the project is based on the tutorial lab "Module 3 Tutorial: CRUD REST API with Node, Express and MongoDB". `mongodb` requests of the tutorial has been replaced by `mongoose` requests.

The application has been divided into two modules, `app.js` and `server.js`. The first one exports an Express application containing a method, `connectDB`, to connect to Mongo database, in its `locals` property. The latter module calls the method and starts the app calling its `listen` method.

To start the application type `node server`. It runs on port `3000`,
and connects to `mongodb://localhost:27017/edx-course-db` and
uses its `accounts` collection.  


> 2) How did you test your project to verify that it works?
If you used any specific curl requests, let us know.


The `test` folder includes a  [mocha](http://mochajs.org) test script,
which use [chai](http://chaijs.com) asserts, and
[chai-http](http://chaijs.com/plugins/chai-http/) to make requests to the rest api to test.

To run the tests, type `mocha` or `npm test`.
When testing, the application runs on port `3001`.
The test scripts use the test database's (`mongodb://localhost:27017/test`) `accounts` collection.


> 3) Let us know if anything doesn't work as intended so your reviewers can know ahead of time

All the attached tests will pass.
