import React from "react";


export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tableNames: [],
                      selectedColumns: [],
                      query: 'SELECT players.position, player_stats.assists FROM players INNER JOIN player_stats ON players.pl_name = player_stats.pl_name;',
                      displayColumns: []
                    }
    
        // Bind this to the function you need
        this.handleTableChanges = this.handleTableChanges.bind(this);
        this.handleColumnChanges = this.handleColumnChanges.bind(this);
        this.createColumnOptions = this.createColumnOptions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      
      // Functions for handling the state changes
      handleTableChanges(event) {
        const newTables = this.state.tableNames;
        if (newTables.indexOf(event.target.value) !== -1) {
            newTables.pop(event.target.value)
        } else {
            newTables.push(event.target.value)
        }
        this.setState({tableNames: newTables});
      }

      handleColumnChanges(event) {
        const newColumns = this.state.selectedColumns;
        if (newColumns.indexOf(event.target.value) !== -1) {
            newColumns.pop(event.target.value)
        } else {
            newColumns.push(event.target.value)
        }
        this.setState({selectedColumns: newColumns});
      }
    
      handleSubmit(event) {
        alert('Your favorite flavor is: ' + this.state.tableNames);
        event.preventDefault();
      }

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
        if (selectedTable.indexOf("team")  !== -1) {
            columns = columns.concat(["team.team_name", "team.head_coach"]);
        } else {
            let toRemove = ["team.team_name", "team.head_coach"];
            if (columns.length > 1) {
                columns = columns.filter( function( el ) {
                    return !toRemove.includes( el );
                  });
            }
        }
        if (selectedTable.indexOf("players")  !== -1) {
            columns = columns.concat(["players.pl_name", "players.position", "players.team_name", "players.rating"]);
        } else {
            let toRemove = ["players.pl_name", "players.position", "players.team_name", "players.rating"];
            if (columns.length > 1) {
                columns = columns.filter( function( el ) {
                    return toRemove.indexOf( el ) < 0;
                });
            }
        }
        if (selectedTable.indexOf("champion")  !== -1) {
            columns = columns.concat(["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"]);
        } else {
            let toRemove = ["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.indexOf("game")  !== -1) {
            columns = columns.concat(["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"]);
        } else {
            let toRemove = ["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.indexOf("game_stats")  !== -1) {
            columns = columns.concat(["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"]);
        } else {
            let toRemove = ["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.indexOf("player_stats")  !== -1) {
            columns = columns.concat(["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"]);
        } else {
            let toRemove = ["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.indexOf("team_stats")  !== -1) {
            columns = columns.concat(["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"]);
        } else {
            let toRemove = ["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"];
            columns = columns.filter( function( el ) {
                return toRemove.indexOf( el ) < 0;
            });
        }
        if (selectedTable.indexOf("plays_in")  !== -1) {
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

    
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Table:
              <select multiple={true} value={this.state.tableNames} onChange={this.handleTableChanges}>
                {this.createTableOptions()}
              </select>
            </label>
            <br/>
            <label>
              Please select your columns:
              <select multiple={true} value={this.state.selectedColumns} onChange={this.handleColumnChanges}>
                {this.createColumnOptions()}
              </select>
            </label>
            <br/>
            <label>
              Please select the join condition:
              <select multiple={true} value={this.state.selectedColumns} onChange={this.handleColumnChanges}>
                {this.createColumnOptions()}
              </select>
            </label>
            <br/>
            <label>
              Please select any restrictions:
              <select multiple={true} value={this.state.selectedColumns} onChange={this.handleColumnChanges}>
                {this.createColumnOptions()}
              </select>
            </label>
            <br/>
            <input type="submit" value="Generate Query" />
          </form>
        );
      }
    }