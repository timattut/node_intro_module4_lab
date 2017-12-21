
// server.js

const app = require('./app');
const url = 'mongodb://localhost:27017/edx-course-db';

app.locals.connectDB(url);

app.listen(3000, function(){
  console.log("Server is running");
});


//
// Curls for Testing
//

/* POST
curl -H "Content-Type: application/json" -X POST -d '{"balance": 100, "name":"checking"}'  "http://localhost:3000/accounts"
*/
/* GET
curl "http://localhost:3000/accounts"
*/
/* PUT
curl -H 'Content-Type: application/json' -X PUT -d '{"balance": 200, "name": "savings"}'  "http://localhost:3000/accounts/{ID}"
*/
/* DELETE
curl -X DELETE "http://localhost:3000/accounts/{ID}"
*/
