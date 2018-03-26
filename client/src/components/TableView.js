import 'react-table/react-table.css'
import React from "react";
import ReactTable from "react-table";


export default class TableView extends React.Component {

constructor(props) {
    super(props);
}
    componentDidMount(){
    const{data} = this.props;
    }

render()
    {
        var headerNames = {pl_name: "Summoner Name", kda: "KDA", kills: "Kills (Total)", deaths: "Deaths (Total)", assists: "Assists (Total)",
            kill_participation: "Kill Participation", cs_per_min: "CPSM", cs_total: "CS (Total)", minutes_played: "Minutes Played", games_played: "Games Played",
            rating: "Rating", position: "Position", team_name: "Team Name", ch_name: "Champion Name", win_rate: "Win Rate", pick_rate: "Pick Rate",
            ban_rate: "Ban Rate", game_id: "Game ID", team_red: "Team Red", team_blue: "Team Blue", time: "Date", result: "Result", duration: "Duration",
            patch: "Patch Version", first_blood: "First Blood", total_gold_red: "Total Gold (Red)", total_gold_blue: "Total Gold (Blue)", total_champ_kills: "Total Kills (Champions)",
            head_coach: "Head Coach", wins: "Wins", losses: "Losses", teamkd: "Team KDA", total_kills: "Total Kills", total_deaths: "Total Deaths", total_assists: "Total Assists",
            avg_game_time: "Average Game Time"
        };
        var stats = {"id":45,"name":"Impact","position":"toplane","playerSlug":"impact","team":"TL","gamesPlayed":20,
        "kda":3.6285714285714286,"kills":38,"deaths":35,"assists":89,"killParticipation":0.6684210526315789,"csPerMin":8.513325012847808,
        "cs":5798,"minutesPlayed":681,"teamSlug":"team-liquid", "rating":9};
        var summoners = stats["stats"];
        var summonerMap = {};
        var columns = {columns:[]};
        if(stats){
            Object.keys(summoners).forEach((key) => {
                summonerMap[key] = summoners[key];
            })
        }
        // Populate columns with proper headers
        {
            Object.keys(summonerMap[0]).forEach((key) => {
            console.log(key);
            if(headerNames[key]) {
                columns["columns"].push({Header: headerNames[key], accessor: key});
            }
            })
        }
        console.log(summoners);
        console.log(summonerMap);
        console.log(columns);
        return (
            <div>
                <ReactTable
                    columns={columns["columns"]}
                    defaultPageSize={10}
                    data = {summoners}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }
}

