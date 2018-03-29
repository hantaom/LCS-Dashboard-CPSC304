import React from "react";
import {CONSTANTS} from "../TableConstants";
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
		this.handleDivisorTableChanges = this.handleDivisorTableChanges.bind(this);
		this.handleDivisorColumnChanges = this.handleDivisorColumnChanges.bind(this);
		this.handleDividendTableChanges = this.handleDividendTableChanges.bind(this);
		this.handleDividendColumnChanges = this.handleDividendColumnChanges.bind(this);
		this.handleModeChanges = this.handleModeChanges.bind(this);
		this.createTableOptions = this.createTableOptions.bind(this);
		this.createDivisorColumnOptions = this.createDivisorColumnOptions.bind(this);
		this.createDividendColumnOptions = this.createDividendColumnOptions.bind(this);
	}

	handleSubmit(event) {
		let queryString = this.buildQuery();
		if (queryString === undefined) {
			queryString = "select * from players";
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
			fromClause = fromClause + table + " ";
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

	handleDividendTableChanges(event) {
		const { value } = event.target;
		const newTables = this.state.dividendTables;
		let index = newTables.current.indexOf(value);
		if (index > -1) {
			delete newTables[value];
			delete newTables.current[index];
		} else {
			newTables.current.push(value);
			newTables[value] = value;
		}
		this.setState({dividendTables: newTables});
	}
	handleDivisorTableChanges(event) {
		const { value } = event.target;
		const newTables = this.state.divisorTables;
		let index = newTables.current.indexOf(value);
		if (index > -1) {
			delete newTables[value];
			delete newTables.current[index];
		} else {
			newTables.current.push(value);
			newTables[value] = value;
		}
		this.setState({divisorTables: newTables});
	}
	handleDividendColumnChanges(event) {
		const { value } = event.target;
		//value is "table.attribute"
		const newColumns = this.state.dividendColumns;
		let index = newColumns.current.indexOf(value);
		if (index > -1) {
			delete newColumns[value];
			delete newColumns.current[index];
		} else {
			newColumns.current.push(value);
			newColumns[value] = value;
		}
		this.setState({dividendColumns: newColumns});
	}
	handleDivisorColumnChanges(event) {
		const { value } = event.target;
		//value is "table.attribute"
		const newColumns = this.state.divisorColumns;
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
	handleModeChanges(event) {
		this.setState({mode: event.target.value});
	}

	createTableOptions() {
		let items = [];
		let { tables } = this.state;
		for (let value in tables) {
			items.push(<option key={value} value={value}>{value}</option>);
		}
		return items;
	}
	createDividendColumnOptions() {
		let items = [];
		let { dividendTables,dividendColumns,tables } = this.state;
		const newTables = dividendTables;
		const newColumns = dividendColumns;
		for (let i = 0; i < newTables.current.length; i++) {
			let table = newTables.current[i];
			if (table == null) {
				continue;
			}
			const array = tables[table].attr;
			for (let j = 0; j < array.length; j++) {
				let attribute = array[j];
				attribute = table + "." + attribute;
				items.push(<option key={i} value={attribute}>{attribute}</option>);
			}
		}
		return items;
	}
	createDivisorColumnOptions() {
		let items = [];
		let { divisorTables,divisorColumns,tables } = this.state;
		const newTables = divisorTables;
		const newColumns = divisorColumns;
		for (let i = 0; i < newTables.current.length; i++) {
			let table = newTables.current[i];
			if (table == null) {
				continue;
			}
			const array = tables[table].attr;
			for (let j = 0; j < array.length; j++) {
				let attribute = array[j];
				attribute = table + "." + attribute;
				items.push(<option key={i} value={attribute}>{attribute}</option>);
			}
		}
		return items;
	}
	createModeOptions() {
		let items = [];
		items.push(<option key="null" value="null"></option>);
		items.push(<option key="all" value="all">all of</option>);
		items.push(<option key="none" value="none">none of</option>);
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
					  onChange={this.handleDividendTableChanges}
					>
						{this.createTableOptions()}
					</select>
					<select
					  multiple={true}
					  value={this.state.dividendColumns.current}
					  onChange={this.handleDividendColumnChanges}
					>
						{this.createDividendColumnOptions()}
					</select>
				</label>
				<br/>
				<br/>
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
				<br/>
				<br/>
				<label>
					<header>the table below</header>
					<select
					  multiple={true}
					  value={this.state.divisorTables.current}
					  onChange={this.handleDivisorTableChanges}
					>
						{this.createTableOptions()}
					</select>
					<select
					  multiple={true}
					  value={this.state.divisorColumns.current}
					  onChange={this.handleDivisorColumnChanges}
					>
						{this.createDivisorColumnOptions()}
					</select>
				</label>
				<br/>
				<Button type="submit" color="success">Generate Query</Button>
				<br/>
				<br/>
			</form>
		);
	}
}
