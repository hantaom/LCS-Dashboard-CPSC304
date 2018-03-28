import React from "react";
import {CONSTANTS} from "../TableConstants";
import TableView from "./TableView";
import request from "superagent";
import { Button } from "reactstrap";

export default class Division extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tables: {},
			divisorTables: {current: []},
			dividendTables: {current: []},
			divisorColumns: {current: []},
			dividendColumns: {current: []},
			mode: "null"
		}
		let tables = this.state.tables;
		tables["team"] = {attr: ["team_name","head_coach"]};
		tables["players"] = {attr: ["pl_name","position","team_name","rating"]};
		tables["champion"] = {attr: ["ch_name","win_rate","pick_rate","ban_rate"]};
		tables["game"] = {attr: ["game_id","team_red","team_blue","game_time","result","duration","patch"]};
		tables["game_stats"] = {attr: ["game_id","first_blood","total_gold_red","total_gold_blue","total_champ_kill"]};
		tables["player_stats"]= {attr: ["pl_name","games_played","cs_per_min","assists","kda","minutes_played","cs_total","kills","deaths","kill_participation"]};
		tables["team_stats"] = {attr: ["team_name","games_played","wins","total_deaths","total_assists","avg_game_time"]};
		tables["plays_in"] = {attr: ["game_id","ch_name","pl_name"]};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.buildQuery = this.buildQuery.bind(this);
		this.buildDivisorClause = this.buildDivisorClause.bind(this);
		this.handleTableChanges = this.handleTableChanges.bind(this);
		this.handleColumnChanges = this.handleColumnChanges.bind(this);
		this.handleModeChanges = this.handleModeChanges.bind(this);
		this.createTableOptions = this.createTableOptions.bind(this);
		this.createColumnOptions = this.createColumnOptions.bind(this);
	}

	handleSubmit(event) {
		let queryString = this.buildQuery();
		if (queryString === undefined) {
			return;
		}
		let that = this;
		request.post('/api/query')
			.set('Content-type', 'application/x-www-form-urlencoded')
			.query({query: queryString})
			.end(function(err, res) {
				that.props.setData(JSON.parse(res.text));
				that.setState({
					queryResults: res,
					headerNames: that.state.dividendColumns.current
				});
			});
		event.preventDefault();
	}
	buildQuery() {
		let divisorClause = this.buildDivisorClause(); //select+from+where
		console.log(divisorClause);
		let { dividendTables,divisorTables,dividendColumns,mode } = this.state;
		let selectClause = "select distinct ";
		let fromClause = "from ";
		let selectAppended = false;
		let fromAppended = false;
		for (let table in dividendTables) {
			if (table === "current") {
				continue;
			}
			if (fromAppended) {
				fromClause = fromClause + ",";
			}
			fromClause = fromClause + table + " ";
			fromAppended = true;
		}
		selectAppended = false;
		for (let attribute in dividendColumns) {
			if (attribute === "current") {
				continue;
			}
			if (selectAppended) {
				selectClause = selectClause + ",";
			}
			selectClause = selectClause + attribute + " ";
			selectAppended = true;
		}
		let queryString = selectClause + fromClause + "where not exists (";
		if (mode === "null") {
			return undefined;
		}
		if (mode === "all") {
			fromClause = "from ";
			let fromAppended = false;
			for (let table in divisorTables) {
				if (!dividendTables.include(table)) {
					if (fromAppended) {
						fromClause = fromClause + ",";
					}
					fromClause = fromClause + table + " ";
					fromAppended = true;
				}
			}
			queryString = queryString + divisorClause.selectClause + fromClause + "except ";
		}
		divisorClause = divisorClause.selectClause + divisorClause.fromClause + divisorClause.whereClause;
		queryString = queryString + divisorClause + ");"
		console.log(queryString);
		return queryString;
	}
	buildDivisorClause() {
		let { divisorTables,divisorColumns,dividendColumns } = this.state;
		let selectClause = "select distinct ";
		let fromClause = "from ";
		let whereClause = "where ";
		
		let fromAppended = false;
		for (let table in divisorTables) {
			if (table === "current") {
				continue;
			}
			if (fromAppended) {
				fromClause = fromClause + ",";
			}
			fromClause = fromClause + table;
			fromAppended = true;
		}
		let whereAppended = false;
		let selectAppended = false;
		for (let aSec in divisorColumns) {
			if (aSec === "current") {
				continue;
			}
			let found = false;
			for (let aPri in dividendColumns) {
				if (aPri === "current") {
					continue;
				}
				//if divisor and dividend has common attribute
				if (aSec.split(".")[1] === aPri.split(".")[1]) {
					if (whereAppended) {
						whereClause = whereClause + "and ";
					}
					whereClause = whereClause + aSec+"="+aPri;
					whereAppended = true;
					found = true;
					break;
				}
			}
			if (!found) {
				if (selectAppended) {
					selectClause = selectClause + ",";
				}
				selectClause = selectClause + aSec + " ";
				selectAppended = true;
			}
		}
		return { selectClause, fromClause, whereClause };
	}

	handleTableChanges(event) {
		const { id, value } = event.target;
		let { dividendTables, divisorTables } = this.state;
		if (event.id === "dividend") {
			const newTables = dividendTables;
			let index = newTables.current.indexOf(value);
			if (index > -1) {
				delete newTables.current[index];
			} else {
				newTables.current.push(value);
			}
			this.setState({dividendTables: newTables});
		} else {
			const newTables = divisorTables;
			let index = newTables.current.indexOf(value);
			if (index > -1) {
				delete newTables.current[index];
			} else {
				newTables.current.push(value);
			}
			this.setState({divisorTables: newTables});
		}
	}
	handleColumnChanges(event) {
		const { id, value } = event.target;
		//value is "table.attribute"
		let { dividendColumns, divisorColumns } = this.state;
		if (event.id === "dividend") {
			const newColumns = dividendColumns;
			let index = newColumns.current.indexOf(value);
			if (index > -1) {
				delete newColumns[value];
				delete newColumns.current[index];
			} else {
				newColumns.current.push(value);
				newColumns[value] = value;
			}
			this.setState({dividendColumns: newColumns});
		} else {
			const newColumns = divisorColumns;
			let index = newColumns.current.indexOf(value);
			if (index > -1) {
				delete newColumns[value];
				delete newColumns.current[index];
			} else {
				newColumns.current.push(value);
				newColumns[value] = value;
			}
			this.setState({divisorColumns: newColumns});
		}
	}
	handleModeChanges(event) {
		this.setStatus({mode: event.target.value});
	}

	createTableOptions() {
		let items = [];
		let { tables } = this.state;
		for (let key in tables) {
			items.push(<option value={key}>{key}</option>);
		}
		return items;
	}
	createColumnOptions(mode) {
		let items = [];
		let { divisorTables, dividendTables,divisorColumns,dividendColumns,tables } = this.state;
		if (mode === "divisor") {
			const newTables = divisorTables;
			const newColumns = divisorColumns;
			newColumns.current = [];
			for (let table in newTables.current) {
				const array = tables[table].attr;
				for (let attribute in array) {
					attribute = table + "." + attribute;
					newColumns.current.push(attribute);
					items.push(<option value={attribute}>{attribute}</option>);
				}
			}
			this.setState({divisorColumns: newColumns});
			return items;
		} else {
			const newTables = dividendTables;
			const newColumns = dividendColumns;
			newColumns.current = [];
			for (let table in newTables.current) {
				const array = tables[table].attr;
				for (let attribute in array) {
					attribute = table + "." + attribute;
					newColumns.current.push(attribute);
					items.push(<option value={attribute}>{attribute}</option>);
				}
			}
			this.setState({dividendColumns: newColumns});
			return items;
		}
	}
	createModeOptions() {
		let items = [];
		items.push(<option value="null"></option>);
		items.push(<option value="all">all of</option>);
		items.push(<option value="none">none of</option>);
		return items;
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					<header>From</header>
					<select
					  multiple={true}
					  value={this.state.dividendTables.current}
					  onChange={this.handleTableChanges}
					>
						{this.createTableOptions()}
					</select>
					<select
					  id="dividend"
					  multiple={true}
					  value={this.state.dividendColumns.current}
					  onChange={this.handleColumnChanges}
					>
						{this.createColumnOptions("dividend")}
					</select>
				</label>
				<label>
					<header>that corresponds to</header>
					<select
					  multiple={false}
					  value={this.state.mode}
					  onChange={this.handleModeChanges}
					>
						{this.createModeOptions()}
					</select>
				</label>
				<label>
					<header>the table below</header>
					<select
					  multiple={true}
					  value={this.state.divisorTables.current}
					  onChange={this.handleTableChanges}
					>
						{this.createTableOptions()}
					</select>
					<select
					  id="divisor"
					  multiple={true}
					  value={this.state.divisorColumns.current}
					  onChange={this.handleColumnChanges}
					>
						{this.createColumnOptions("divisor")}
					</select>
				</label>
				<Button type="submit" color="success">Generate Query</Button>
			</form>
		);
	}
}
