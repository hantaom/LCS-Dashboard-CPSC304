import React from "react";
import {CONSTANTS} from "../TableConstants";
import TableView from "./TableView";
import request from 'superagent';
import { Button } from 'reactstrap';

export default class Delete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tableName: "default",
                      whereOptions: {selected: []}
                    }
    
        // Bind this to the function you need
        this.handleTableChanges = this.handleTableChanges.bind(this);
        this.handleWhereChanges = this.handleWhereChanges.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      
      // Functions for handling the state changes
      // #######################################################################################
      handleTableChanges(event) {
        this.setState({tableName: event.target.value});
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
        let query_table = this.state.tableName;
        let query_filters = this.state.whereOptions.selected;
        let queryString = 'delete from ';
        // Generate the "FROM" part of the query string
        queryString = queryString + query_table + ' ';
        // Generate the WHERE part of the query string
        queryString = queryString + "where pl_name = 'bjergsen'";
        // Append ending of query
        queryString = queryString + ';';
        console.log(queryString);
        // Make the post request
        // let that = this;
        // request
        // .post('/api/query')
        // .set('Content-Type', 'application/x-www-form-urlencoded')
        // .query({ query: queryString})
        // .end(function(err, res){
        //   console.log(res.text);
        //   alert(res.text);
        // }); 
        alert(queryString);
        event.preventDefault();
      }

      // Code that fills what is inside the selection boxes
      // #######################################################################################
      createTableOptions() {
        let items = [];
        let tables = ["team", "players", "champion", "game", "game_stats", "player_stats", "team_stats", "plays_in"];
        for (let i = 0; i <= tables.length - 1; i++) {             
            // Dynamically set the options for tables 
            items.push(<option key={i} value={tables[i]}>{tables[i]}</option>);   
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
              <header>Please select the table:</header>
              <select value={this.state.tableName} onChange={this.handleTableChanges}>
                {this.createTableOptions()}
              </select>
            </label>
            <br/>
            <label>
              <header>Please select any restrictions (WHERE):</header>
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