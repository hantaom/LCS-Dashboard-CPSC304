import React from "react";
import {CONSTANTS} from "../TableConstants";
import TableView from "./TableView";
import request from 'superagent';
import { Button } from 'reactstrap';

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tableNames: {selected: []},
                      selectedColumns: {selected: []},
                      joinOptions: {selected: []},
                      whereOptions: {selected: []},
                      displayColumns: []
                    }
    
        // Bind this to the function you need
        this.handleTableChanges = this.handleTableChanges.bind(this);
        this.handleColumnChanges = this.handleColumnChanges.bind(this);
        this.handleJoinChanges = this.handleJoinChanges.bind(this);
        this.handleWhereChanges = this.handleWhereChanges.bind(this);
        this.createColumnOptions = this.createColumnOptions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      
      // Functions for handling the state changes
      // #######################################################################################
      handleTableChanges(event) {
        const newTables = this.state.tableNames;
        let selected = [];
        if (newTables.hasOwnProperty(event.target.value)) {
            delete newTables[event.target.value];
        } else {
            if (!newTables.hasOwnProperty(event.target.value)) {
                newTables[event.target.value] = event.target.value;
            }
        }
        for (var key in newTables) {
            if (newTables.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        this.state.tableNames.selected = selected;
        this.setState({tableNames: newTables});
      }

      handleColumnChanges(event) {
        const newColumns = this.state.selectedColumns;
        let selected = [];
        if (newColumns.hasOwnProperty(event.target.value)) {
            delete newColumns[event.target.value];
        } else {
            if (!newColumns.hasOwnProperty(event.target.value)) {
                newColumns[event.target.value] = event.target.value;
            }
        }
        for (var key in newColumns) {
            if (newColumns.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        this.state.selectedColumns.selected = selected;
        this.setState({selectedColumns: newColumns});
      }

      handleJoinChanges(event) {
        const newJoinChanges = this.state.joinOptions;
        let selected = [];
        if (newJoinChanges.hasOwnProperty(event.target.value)) {
            delete newJoinChanges[event.target.value];
        } else {
            if (!newJoinChanges.hasOwnProperty(event.target.value)) {
                newJoinChanges[event.target.value] = event.target.value;
            }
        }
        for (var key in newJoinChanges) {
            if (newJoinChanges.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        this.state.joinOptions.selected = selected;
        this.setState({joinOptions: newJoinChanges});
      }

      handleWhereChanges(event) {
        const newWhereChanges = this.state.whereOptions;
        let selected = [];
        if (newWhereChanges.hasOwnProperty(event.target.value)) {
            delete newWhereChanges[event.target.value];
        } else {
            if (!newWhereChanges.hasOwnProperty(event.target.value)) {
                newWhereChanges[event.target.value] = event.target.value;
            }
        }
        for (var key in newWhereChanges) {
            if (newWhereChanges.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        this.state.whereOptions.selected = selected;
        this.setState({whereOptions: newWhereChanges});
      }
      // #######################################################################################
    
      handleSubmit(event) {
        let query_tables = this.state.tableNames.selected;
        let query_columns = this.state.selectedColumns.selected;
        let query_joins = this.state.joinOptions.selected;
        let query_filters = this.state.whereOptions.selected;
        let queryString = 'select ';
        // Generate the SELECT part of the query string
        if (query_columns.length > 0) {
            for (let i = 0; i <= query_columns.length - 1; i++) {
                if (i === query_columns.length - 1) {
                    queryString = queryString + query_columns[i] + ' ';
                } else {
                    queryString = queryString + query_columns[i] + ", ";
                }
            }
        }
        // Generate the "FROM" part of the query string
        queryString = queryString + "from ";
        if (query_tables.length > 0) {
            for (let i = 0; i <= query_tables.length - 1; i++) {
                if (i === 0) {
                    queryString = queryString + query_tables[i] + ' ';
                } else {
                    queryString = queryString + "inner join " + query_tables[i] + ' ';
                }
            }
        }
        // Generate the INNER JOIN part of the query string
        queryString = queryString + "on ";
        if (query_joins.length > 0) {
            for (let i = 0; i <= query_joins.length - 1; i++) {
                if (i === 0) {
                    queryString = queryString + query_joins[i];
                }
            }
        }
        // Append ending of query
        queryString = queryString + ";";
        console.log(queryString);
        // Make the post request
        let that = this;
        request
        .post('/api/query')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .query({ query: queryString})
        .end(function(err, res){
          console.log(res.text);
          alert(res.text);
        }); 
        event.preventDefault();
      }

      // Code that fills what is inside the selection boxes
      // #######################################################################################
      createTableOptions() {
        let items = [];
        let tables = ["team", "players", "champion", "game", "game_stats", "player_stats", "team_stats", "plays_in"];
        for (let i = 0; i <= tables.length - 1; i++) {             
            // Dynamically set the options for tables 
            items.push(<option value={tables[i]}>{tables[i]}</option>);   
        }
        return items;
    }
    createColumnOptions() {
        let items = [];
        let columns = this.state.displayColumns;
        let selectedTable = this.state.tableNames;
        if (selectedTable.hasOwnProperty("team")) {
            columns = columns.concat(["team.team_name", "team.head_coach"]);
        } else {
            let toRemove = ["team.team_name", "team.head_coach"];
            if (columns.length > 1) {
                columns = columns.filter( function( el ) {
                    return !toRemove.includes( el );
                  });
            }
        }
        if (selectedTable.hasOwnProperty("players")) {
            columns = columns.concat(["players.pl_name", "players.position", "players.team_name", "players.rating"]);
        } else {
            let toRemove = ["players.pl_name", "players.position", "players.team_name", "players.rating"];
            if (columns.length > 1) {
                columns = columns.filter( function( el ) {
                    return toRemove.indexOf( el ) < 0;
                });
            }
        }
        if (selectedTable.hasOwnProperty("champion")) {
            columns = columns.concat(["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"]);
        } else {
            let toRemove = ["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("game")) {
            columns = columns.concat(["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"]);
        } else {
            let toRemove = ["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("game_stats")) {
            columns = columns.concat(["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"]);
        } else {
            let toRemove = ["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("player_stats")) {
            columns = columns.concat(["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"]);
        } else {
            let toRemove = ["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("team_stats")) {
            columns = columns.concat(["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"]);
        } else {
            let toRemove = ["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("plays_in")) {
            columns = columns.concat(["plays_in.game_id", "plays_in.ch_name", "plays_in.pl_name"]);
        } else {
            let toRemove = ["plays_in.game_id", "plays_in.ch_name", "plays_in.pl_name"]
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        for (let i = 0; i <= columns.length - 1; i++) {             
             items.push(<option value={columns[i]}>{columns[i]}</option>);   
        }
        return items;
    }

    createJoinOptions() {
        let items = [];
        let joinFilters = [];
        if (this.state.tableNames.selected.length > 1) {
            let t1 = this.state.tableNames.selected[0];
            let t1_columns = CONSTANTS.TABLES[t1];
            let t2 = this.state.tableNames.selected[1];
            let t2_columns = CONSTANTS.TABLES[t2];
            for (let i = 0; i <= t1_columns.length - 1; i++) {
                let columnName_T1 = t1_columns[i].split(".")[1];
                // console.log(columnName_T1);
                for (let j = 0; j <= t2_columns.length - 1; j++) {
                    let columnName_T2 = t2_columns[j].split(".")[1];
                    if (columnName_T1 === columnName_T2) {
                        joinFilters.push(t1_columns[i] + "=" + t2_columns[j])
                    }
                }
            }
        }
        for (let i = 0; i <= joinFilters.length - 1; i++) {             
            // Dynamically set the options for tables 
            items.push(<option value={joinFilters[i]}>{joinFilters[i]}</option>);   
        }
        return items;
    }

    createWhereOptions() {
        let items = [];
        let filterColumns = [];
        for (let i = 0; i <= filterColumns.length - 1; i++) {             
            // Dynamically set the options for tables 
            items.push(<option value={filterColumns[i]}>{filterColumns[i]}</option>);   
        }
        return items;
    }

    // #######################################################################################

    
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              <header>Table:</header>
              <select multiple={true} value={this.state.tableNames.selected} onChange={this.handleTableChanges}>
                {this.createTableOptions()}
              </select>
            </label>
            <br/>
            <label>
              <header>Please select your columns:</header>
              <select multiple={true} value={this.state.selectedColumns.selected} onChange={this.handleColumnChanges}>
                {this.createColumnOptions()}
              </select>
            </label>
            <br/>
            <label>
              <header>Please select the join condition:</header>
              <select multiple={true} value={this.state.joinOptions.selected} onChange={this.handleJoinChanges}>
                {this.createJoinOptions()}
              </select>
            </label>
            <br/>
            <label>
              <header>Please select any restrictions (WHERE): </header>
              <select multiple={true} value={this.state.whereOptions.selected} onChange={this.handleWhereChanges}>
                {this.createWhereOptions()}
              </select>
            </label>
            <br/>
            <br/>
            <Button type="submit" color="success">Generate Query</Button>
            <br/>
            <br/>
          </form>
        );
      }
    }