const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://wiji:isaiah@localhost:5432/lcs';

const QueryHandler = require('./query.js');

const client = new pg.Client(connectionString);
client.connect();
let qh = new QueryHandler(client);
qh.deleteAllPlayersAndStats();

// COMMENTED OUT CREATION OF TABLES

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
//
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


// const app = express();
//
// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '/../client/build')));
//
// // Put all API endpoints under '/api'
// app.get('/api/passwords', (req, res) => {
//   const count = 5;
//
//   // Generate some passwords
//   const passwords = Array.from(Array(count).keys()).map(i =>
//     generatePassword(12, false)
//   );
//
//   // Return them as json
//   res.json(passwords);
//
//   console.log(`Sent ${count} passwords`);
// });
//
// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/../client/build/index.html'));
// });
//
// const port = process.env.PORT || 5000;
// app.listen(port);
//
// console.log(`Password generator listening on ${port}`);