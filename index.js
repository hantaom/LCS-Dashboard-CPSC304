const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const QueryHandler = require('./query.js');

// Isaish PostgreSQL code
// ######################################################################################################
// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://wiji:isaiah@localhost:5432/lcs';
// const client = new pg.Client(connectionString);
// client.connect();
// let qh = new QueryHandler(client);
// qh.deleteAllPlayersAndStats();
// ######################################################################################################

// Hantao PostgreSQL code
// ######################################################################################################
const myConnectionString = process.env.DATABASE_URL || 'postgres://hantao:Password1@localhost:5432/demodb';
console.log(myConnectionString);
const { Client } = require('pg');
const client = new Client({
  connectionString: myConnectionString
});
client.connect()
// // console.log(client.log);
// let queryResults = [];
// client.query('SELECT * FROM PLAYERS;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     queryResults.push(row["pl_name"]);
//   }
//   // console.log(JSON.stringify(queryResults));
//   client.end();
// });
// ######################################################################################################

// Create the Query Handler object
// let qh = new QueryHandler(client);
// qh.getAndParsePlayerStats();

// ######################################################################################################


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

  var queryObj = request.query;
  var jsonResponse = {};
  var queryString = queryObj.query;
  console.log(queryString);

  // Connect to the client

  client.query(queryString, (err, res) => {
    if (err) throw err;
    res.rows.forEach(function (value, i) {
      jsonResponse[i] = JSON.stringify(value);
      console.log(i);
      console.log(jsonResponse);  
    });
    response.send(jsonResponse);
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