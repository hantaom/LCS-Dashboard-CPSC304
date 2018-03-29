import React from "react";
import request from "superagent";
import {CONSTANTS} from "../TableConstants";
import {Button} from 'reactstrap';

export default class Selection extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tables: {selected:""},
			columns: {selected:[]},
		}
		let tables = this.state.tables;
		tables["team"] = {attr: {team_name:"",head_coach:""}};
		tables["players"] = {attr: {pl_name:"",position:"",team_name:"",rating:0.5}};
		tables["champion"] = {attr: {ch_name:"",win_rate:0.5,pick_rate:0.5,"ban_rate"]};
		tables["game"] = {attr: {game_id:"",team_red","team_blue","game_time","result","duration","patch"]};
		tables["game_stats"] = {attr: ["game_id","first_blood","total_gold_red","total_gold_blue","total_champ_kill"]};
		tables["player_stats"]= {attr: ["pl_name","games_played","cs_per_min","assists","kda","minutes_played","cs_total","kills","deaths","kill_participation"]};
		tables["team_stats"] = {attr: ["team_name","games_played","wins","total_deaths","total_assists","avg_game_time"]};
		tables["plays_in"] = {attr: ["game_id","ch_name","pl_name"]};

		this.handleSubmit = this.handleSumbit.bind(this);
		this.buildQuery = this.buildQuery.bind(this);
		this.handleTableChanges = this.handleTableChanges.bind(this);
		this.handleColumnChanges = this.handleColumnChanges.bind(this);
		this.createTableOptions = this.createTableOptions.bind(this);
		this.createColumnOptions = this.createColumnOptions.bind(this);
	}

	handleSubmit(event) {
		let that = this;
		request
			.post('/api/query')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.query({query: that.buildQuery()})
			.end(function (err, res) {
				console.log(res.text);
				that.props.setData(JSON.parse(res.text));
				that.setState({
					queryResults: res,
					headerNames: that.state.displaySelectedColumns
				});
			});
		event.preventDefault();
	}
	handleTableChanges(event) {
		let { value } = event.target;
		const newTables = this.state.tables;
		newTables.selected = value;
		this.setState({tables: newTables});
		}
		handleColumnChanges(event) {
		let { value } = event.target;
		const newColumns = this.state.columns;
		let index = newColumns.selected.indexOf(value);
		if (index > -1) {
			delete newColumns[value];
			delete newColumns.selected[index];
		} else {
			newColumns[value] = "";
			newColumns.selected.push(value);
		}
	}

	buildQuery() {
		let insertClause = "insert into " + tables.selected + " (";
		let valueClause = values + "(";
		let appended = false;
		for (let key in columns) {
			if (appended) {
				insertClause = insertClause + ",";
				valueClause = valueClause + ",";
			}
			insertClause = insertClause + key;
			valueClause = valueClause + columns[key];
			appended = true;
		}
		insertClause = insertClause + ")";
		valueClause = valueClause + ")";
		let queryString = insertClause + valueClause + ";";
		return queryString;
	}


	/* CREATE OPTIONS */

	createTableOptions() {
		let items = [];
		let tables = CONSTANTS.TABLE_NAMES;

		tables.forEach(table => {
			items.push(<option key={table} value={table}>{table}</option>);
		});

		return items;
	}

	createColumnOptions() {
		let items = [];
		let tables
	}

	render() {
		return (
		   <form onSubmit={this.handleSubmit}>
				<label>
					<header>Table:</header>
					<select 
					  multiple={false}
					  value={this.state.tables.selected}
					  onChange={this.handleTableChanges}>
						{this.createTableOptions()}
					</select>
				</label>
				<br/>
				<br/>
				{
					this.state.tables.selected !== ""
						&&
					<label>
						<header>Please select data from table:</header>
						<select
						  multiple={true}
						  value={this.state.columns.selected}
						  onChange={this.handleColumnChanges}>
							{this.createColumnOptions()}
						</select>
					</label>
				}
				<br/>
				<br/>
				{
					this.state.selectedTable !== ""
						&&
					<Button type="submit" color="success">Generate Query</Button>
				}
			</form>
		);
	}
}
