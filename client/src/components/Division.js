import React from "react";
import { Button } from 'reactstrap';
import request from 'superagent';

export default class Division extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			t: {},
			c: {},
			divideeTables: {},
			dividerTables: {},
			divideeColumns: [],
			dividerColumns: [],
			mode: "null"
		}

		//Initialize table names
		let { t, c } = this.state;
		t["team"] = "Team";
		t["players"] = "Players";
		t["champion"] = "Champion";
		t["game"] = "Game";
		t["game_stats"] = "Game statistics";
		t["players_stats"] = "Player statistics";
		t["team_stats"] = "Team statistics";
		t["plays_in"] = "Plays in";

		//Initialize column name
		c["team"] = {attr: ["team_name", "head_coach"]};
		c["players"] = {attr: ["pl_name", "position", "team_name", "rating"]};
		c["champion"] = {attr: ["ch_name", "win_rate", "pick_rate", "ban_rate"]};
		c["game"] = {attr: ["game_id", "team_red", "team_blue", "game_time", "result", "duration", "patch"]};
		c["game_stats"] = {attr: ["game_id", "first_blood", "total_gold_red", "total_gold_blue", "total_champ_kill"]};
		c["players_stats"] = {attr: ["pl_name","games_played","cs_per_min","assists","kda","minutes_played","cs_total","kills","deaths","kill_participation"]};
		c["team_stats"] = {attr: ["team_name","games_played","wins","losses","teamkd","total_kills","total_deaths","total_assists","avg_game_time"]};
		c["plays_in"] = {attr: ["game_id","ch_name","pl_name"]};

		//Bind this to the function you need
		this.handleDividerColumnChanges = this.handleDividerColumnChanges.bind(this);
		this.handleDivideeColumnChanges = this.handleDivideeColumnChanges.bind(this);
		this.handleModeChanges = this.handleModeChanges.bind(this);
		this.handleDivideeTableChanges = this.handleDivideeTableChanges.bind(this);
		this.handleDividerTableChanges = this.handleDividerTableChanges.bind(this);
		this.createTableOptions = this.createTableOptions.bind(this);
		this.createColumnOptions = this.createColumnOptions.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		let queryString = "";
		let { t,c,divideeTables,dividerTables,mode } = this.state;

		if (divideeTables.length <= 0) {
			alert("Please choose at least an attribute to display from.");
			return;
		}
		if (dividerTables.length <= 0) {
			alert("Please choose one or more attributes to compare with.");
			return;
		}
		if (mode === "null") {
			alert("Please choose either all of or none of the attributes in the secondary table should be compared with the primary table.");
			return;
		}
		let divideeAttr = [];
		let selectClause = "select ";
		let fromClause = "from ";
		for (let table in divideeTables) {
			fromClause = fromClause + table + " ";
			let { attr } = divideeTables[table];
			for (let attribute in attr) {
				attribute = table + "." + attribute;
				selectClause = selectClause + attribute + " ";
				divideeAttr.push(attribute);
			}
		}
		queryString = queryString + selectClause + fromClause;

		let dividerAttr = [];
		selectClause = "select ";
		fromClause = "from ";
		if (mode === "none") {
			for (let table in dividerTables) {
				fromClause = fromClause + table + " ";
				let { attr } = dividerTables[table];
				for (let attribute in attr) {
					attribute = table + "." + attribute;
					selectClause = selectClause + attribute + " ";
					dividerAttr.push(attribute);
				}
			}
			if (dividerAttr.length > divideeAttr.length) {
				alert("Secondary table cannot have more attributes than primary table. Please try again.");
				return;
			}
			let whereClause = "where ";
			let hasAppended = false;
			for (let aSec in dividerAttr) {
				for (let aPri in divideeAttr) {
					if (aPri.split(".")[1] === aSec.split(".")[1]) {
						if (hasAppended) {
							whereClause = whereClause + "AND ";
						}
						whereClause = whereClause + aPri + "=" + aSec + " ";
						hasAppended = true;
						break;
					}
				}
			}
			queryString = queryString + "where not exists (" + selectClause + fromClause + whereClause + ")";
		}
		else if (mode === "all") {
			for (let table in dividerTables) {
				let { attr } = dividerTables[table];
				for (let attribute in attr) {
					attribute = table + "." + attribute;
					dividerAttr.push(attribute);
				}
			}
			if (dividerAttr.length > divideeAttr.length) {
				alert("Secondary table cannot have more attributes than primary table. Please try again.");
				return;
			}
			
		}
			
		queryString = queryString + ";";

		//Make the post request
		let that = this;
		request
		.post('/api/query')
		.set('Content-type', 'application/x-www-form-urlencoded')
		.query({query: queryString})
		.end(function(err, res) {
			console.log(res.text);
			that.props.setData(JSON.parse(res.text));
			that.setState({
				queryResults: res,
				headerNames: that.state.divideeColumns
			});
		});
		event.preventDefault();
	}
	handleDivideeTableChanges(event) {
		let table = event.target.value
		const newTables = this.state.divideeTables;
		if (newTables[table] == null) {
			newTables[table] = {attr: []};
		} else {
			delete newTables[table];
		}
		this.setState({divideeTables: newTables});
	}
	handleDividerTableChanges(event) {
		let table = event.target.value;
		const newTables = this.state.dividerTables;
		if (newTables[table] == null) {
			newTables[table] = {attr: []};
		} else {
			delete newTables[table];
		}
		this.setState({dividerTables: newTables});
	}
	handleDividerColumnChanges(event) {
		let value = event.target.value.split(".");
		let table = value[0];
		let attribute = value[1];
		const selectedTables = this.state.dividerTables;
		let selectedColumns = selectedTables[table].attr;
		let index = selectedColumns.indexOf(attribute);
		if (index > -1) {
			delete selectedColumns[index];
		} else {
			selectedColumns.push(attribute);
		}
		this.setState({dividerTables: selectedTables});
	}
	handleDivideeColumnChanges(event) {
		let value = event.target.value.split(".");
		let table = value[0];
		let attribute = value[1];
		const selectedTables = this.state.divideeTables;
		let selectedColumns = selectedTables[table].attr;
		let index = selectedColumns.indexOf(attribute);
		if (index > -1) {
			delete selectedColumns[index];
		} else {
			selectedColumns.push(attribute);
		}
		this.setState({divideeTables: selectedTables});
	}
	handleModeChanges(event) {
		let { value } = event.target;
		this.setState({mode: value});
	}

	createTableOptions(mode) {
		let items = [];
		let { t } = this.state;
		var selectedTables;
		var handler;
		if (mode === "divider") {
			selectedTables = this.state.dividerTables.selected;
			handler = this.handleDividerTableChanges;
		} else {
			selectedTables = this.state.divideeTables.selected;
			handler = this.handleDivideeTableChanges;
		}
		for (let key in t) {
			let v = t[key];
			items.push(<option value={key}>{v}</option>);
		}
		return (
			<select multiple={true} value={selectedTables} onChange={handler}>
				{items}
			</select>
		);
	}
	createColumnOptions(mode) {
		let items = [];
		var columns, selectedTables, handler;
		if (mode === "divider") {
			columns = this.state.dividerColumns;
			selectedTables = this.state.dividerTables;
			handler = this.handleDividerColumnChanges;
		} else {
			columns = this.state.divideeColumns;
			selectedTables = this.state.divideeTables;
			handler = this.handleDivideeColumnChanges;
		}
		let { c } = this.state;
		for (let key in selectedTables) {
			let { attr } = c[key];
			for (let i = 0; i < attr.length; i++) {
				let a = attr[i];
				a = key + "." + a;
				items.push(<option value={a}>{a}</option>);
			}
		}
		return (
			<select multiple={true} value={columns} onChange={handler}>
				{items}
			</select>
		);
	}
	createModeOptions() {
		return (
			<label>
				<select multiple={false} value={this.state.mode} onChange={this.handleModeChanges}>
					<option value={"null"}></option>
					<option value={"all"}>All</option>
					<option value={"none"}>None</option>
				</select>
			</label>
		);
	}
	render() {
		return (
			<form onSubmit={this.handleSumbit}>
				<label>
					<header>From</header>
					{this.createTableOptions("dividee")}
					{this.createColumnOptions("dividee")}
				</label>
				<br/>
				<label>
					<header>that corresponds to</header>
					{this.createModeOptions()}
				</label>
				<br/>
				<label>
					<header>of table</header>
					{this.createTableOptions("divider")}
					{this.createColumnOptions("divider")}
				</label>
				<br/>
				<br/>
				<Button type="submit" outline color="success">Generate Query</Button>
				<br/>
				<br/>
			</form>
		);
	}
}
