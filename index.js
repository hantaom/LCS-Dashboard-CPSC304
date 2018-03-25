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
// const connectionString = process.env.DATABASE_URL || 'postgres://hantao:Password1@localhost:5432/lcs';
// console.log(connectionString);
// const pg = require('pg');
// const client = new pg.Client(connectionString);
// client.connect();
// // console.log(client.log);
// let queryResults = [];
// client.query('SELECT * FROM PLAYERS;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     // console.log(JSON.stringify(row));
//     queryResults.push(row["pl_name"]);
//   }
//   // console.log(JSON.stringify(queryResults));
//   client.end();
// });
// ######################################################################################################

// Heroku PostgreSQL code
// ######################################################################################################
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://opiryfbynhdawy:54d7d93eb3d8ca33e4365c05e38cb263c0cfaa4a6c1e9481c535e3fd8f4ec01e@ec2-54-235-146-51.compute-1.amazonaws.com:5432/d9tqp550p8taqi',
  ssl: true,
});

client.connect();

let queryResults = [];
client.query('SELECT * FROM PLAYERS;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    // console.log(JSON.stringify(row));
    queryResults.push(row["pl_name"]);
  }
  // console.log(JSON.stringify(queryResults));
  client.end();
});

// let qh = new QueryHandler(client);
// qh.getAndParsePlayerStats();


// ######################################################################################################


// Create the Query Handler object
// let qh = new QueryHandler(client);

// COMMENTED OUT CREATION OF TABLES
// ######################################################################################################
// client.query('CREATE TABLE players (\n' +
//     '\tpl_name varchar (30),\n' +
//     '\tposition varchar (10),\n' +
//     '\tteam_name varchar (30),\n' +
//     '\tprimary key (pl_name, team_name)\n' +
//     ');', (err, res)=> {
//     if (err) throw err;
//     console.log("holy crap it connected");
//     console.log(JSON.stringify(res));
// });

// client.query(`CREATE TABLE player_stats (
// 	pl_name varchar(30),
// 	games_played int,
// 	cs_per_min int,
// 	assists int,
// 	kda float,
// 	minutes_played int,
// 	cs_total int,
// 	kills int,
// 	deaths int,
// 	kill_participation float,
// 	primary key (pl_name)
// );`, (err, res)=> {
//     if (err) throw err;
//     console.log("holy crap it connected");
//     console.log(JSON.stringify(res));
// });
// ######################################################################################################


// qh.getAndParsePlayerStats();
//console.log("Successfully added all data");

// End PostgreSQL session
// client.end();


// Express code
// ######################################################################################################
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build')));
//app.use(express.static(__dirname + '/public'));

// Put all API endpoints under '/api'
// app.get('/api/passwords', (req, res) => {
//   const count = 5;

//   // Generate some passwords
//   const passwords = Array.from(Array(count).keys()).map(i =>
//     generatePassword(12, false)
//   );

//   console.log(JSON.stringify(passwords));
//   // Return them as json
//   res.json(passwords);

//   console.log(`Sent ${count} passwords`);
// });

// Query endpoint to send the query results
app.get('/api/query', (req, res) => {
  console.log(JSON.stringify(queryResults));
  res.json(queryResults);
  console.log("Query Results sent");
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.send("NOT FOUND");
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);