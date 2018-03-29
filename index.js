const express = require('express');
const path = require('path');

const QueryHandler = require('./query.js');

// FORMAT FOR POSTGRES
// postgres://yourname:yourpassword@localhost:5432/nameOfDatabase

const isaiahPSQL = 'postgres://wiji:isaiah@localhost:5432/templcs';
const hantaoPSQL = 'postgres://hantao:Password1@localhost:5432/demodb';
const kenPSQL = 'postgres://cjken@localhost:5432/test';
const ianPSQL = 'postgres://postgres: @localhost:5432/LCS'

const pg = require('pg');
const myConnectionString = process.env.DATABASE_URL || hantaoPSQL; // replace this with your name/password

const client = new pg.Client({
    connectionString: myConnectionString
});

client.connect();
const qh = new QueryHandler(client);
qh.getAndParsePlayerStats();

// Hantao PostgreSQL code
// ######################################################################################################
// let queryResults = [];
// client.query('SELECT * FROM PLAYERS;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     queryResults.push(row["pl_name"]);
//   }
//   // console.log(JSON.stringify(queryResults));
//   client.end();
// });


// Express code
// ######################################################################################################
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build')));

// Query endpoint to send the query results
app.get('/api/temp', (req, res) => {
  console.log(JSON.stringify(queryResults));
  res.json(queryResults);
  console.log("Query Results sent");
});

app.post('/api/query', function(request, response){
  console.log(request.query);

  let queryObj = request.query;
  let queryString = queryObj.query;
  console.log(queryString);

  qh.executeQuery(queryString)
      .then(queryResults => {
          console.log(JSON.stringify(queryResults));
          response.send(queryResults.rows);
      })
      .catch(err => {
          console.log(err);
      });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Query Server listening on port: ${port}`);
