import React from "react";
import request from "superagent";


export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                value: '',
                result: ''
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.getQueryResults();
        event.preventDefault();
    }

    getQueryResults() {
        let that = this;
        request
            .post('/api/query')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .query({query: this.buildQuery()})
            .end(function (err, res) {
                console.log(res.text);
                that.setState({queryResults: res.text})
            });
    };

    buildQuery() {
        // Builds a query from forms or whatever

        // temporarily returning generic query
        return `SELECT * FROM player_stats WHERE UPPER(pl_name) LIKE UPPER('%${this.state.value}%');`;
    };


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"/>
                <table className="result" value={this.state.result}></table>
            </form>
        );
    }
}

