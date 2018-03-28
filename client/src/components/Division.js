import React from "react";
import { Button } from 'reactstrap';

export default class Division extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			t: {},
			c: {},
			divideeTables: {},
			dividerTables: {},
			selectedColumns: {selected: []},
			divideeColumns: [],
			dividerColumns: [],
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
		c["team"] = ["team_name", "head_coach"];
		c["players"] = ["pl_name", "position", "team_name", "rating"];
		c["champion"] = ["ch_name", "win_rate", "pick_rate", "ban_rate"];
		c["game"] = ["game_id", "team_red", "team_blue", "game_time", "result", "duration", "patch"];
		c["game_stats"] = ["game_id", "first_blood", "total_gold_red", "total_gold_blue", "total_champ_kill"];
		c["players_stats"] = ["pl_name","games_played","cs_per_min","assists","kda","minutes_played","cs_total","kills","deaths","kill_participation"];
		c["team_stats"] = ["team_name","games_played","wins","losses","teamkd","total_kills","total_deaths","total_assists","avg_game_time"];
		c["plays_in"] = ["game_id","ch_name","pl_name"];

		//Bind this to the function you need
		this.handleDividerColumnChanges = this.handleDivisorColumnChanges.bind(this);
		this.handleDivideeColumnChanges = this.handleDiviseeColumnChanges.bind(this);
		this.handleModeChanges = this.handleModeChanges.bind(this);
		this.handleDivideeTableChanges = this.handleDiviseeTableChanges.bind(this);
		this.handleDividerTableChanges = this.handleDivisorTableChanges.bind(this);
		this.createTableOptions = this.createTableOptions.bind(this);
		this.createColumnOptions = this.createColumnOptions.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleDivideeTableChanges(event) {
		const newTables = this.state.divideeTables;
		if (newTables[event.target.value] == null) {
			newTables[event.target.value] = {attr: []};
		} else {
			delete newTables[event.target.value];
		}
	}
	handleDividerTableChanges(event) {
	}
	handleSubmit() {
	}
	handleDividerColumnChanges(event) {
	}
	handleDivideeColumnChanges(event) {
	}
	handleModeChanges(event) {
	}
	createTableOptions(mode) {
		let items = [];
		let { t } = this.state;
		var selectedTables;
		var handler;
		if (mode === "divider") {
			selectedTables = this.state.dividerTables.selected;
			handler = this.handleDividerColumnChanges;
		} else {
			selectedTables = this.state.divideeTables.selected;
			handler = this.handleDivideeColumnChanges;
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
		let { t,c } = this.state;
		for (let key in t) {
			let array = [];
			const attr = c[key];
			for (let i = 0; i < attr.length; i++) {
				array.push(key + "." + attr[i]);
			}
			if (selectedTables[key] == null) {
				columns = columns.concat(array);
			} else {
				columns = columns.filter( function(e1) {
					return !array.includes(e1);
				});
			}
		}
		for (let i = 0; i < columns.length; i++) {
			items.push(<option value={columns[i]}>{columns[i]}</option>);
		}
		return (
			<select multiple={true} value={columns.selected} onChange={handler}>
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
				<Button type="submit" outline color="primary">Generate Query</Button>
				<br/>
				<br/>
			</form>
		);
	}
}
