import React from "react";
import request from "superagent";
import {CONSTANTS} from "../TableConstants";

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColumns: {},
            selectedTable: '',
            displayColumns: [],
            displaySelectedColumns: []
        };

        // Bind this to the function you need
        this.handleTableChanges = this.handleTableChanges.bind(this);
        this.handleColumnChanges = this.handleColumnChanges.bind(this);
        this.createColumnOptions = this.createColumnOptions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    // Functions for handling the state changes
    handleTableChanges(event) {
        let tableSelected = event.target.value;
        this.setState({
            selectedTable: tableSelected,
            displayColumns: [],
            displaySelectedColumns: [],
            selectedColumns: {}
        });
    }

    handleColumnChanges(event) {
        const newColumns = this.state.selectedColumns;

        if (newColumns[event.target.value]) {
            delete newColumns[event.target.value];
        } else {
            newColumns[event.target.value] = event.target.value;
        }

        let newColumnsArray = [];

        Object.keys(newColumns).forEach(key => {
            newColumnsArray.push(newColumns[key]);
        });

        console.log(newColumnsArray);

        this.setState({displaySelectedColumns: newColumnsArray});
    }

    buildQuery = () => {
        let selectedTable = this.state.selectedTable;
        let selectedColumns = this.state.displaySelectedColumns.toString();

        selectedColumns = selectedColumns.length > 0 ? selectedColumns : '*';

        return `SELECT ${selectedColumns} FROM ${selectedTable};`;
    };

    handleSubmit(event) {
        console.log("hello");
        let that = this;
        request
            .post('/api/query')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .query({ query: that.buildQuery()})
            .end(function(err, res){
                console.log(res.text);
                that.setState( {queryResults: res.text })
            });
        event.preventDefault();
    }

    createTableOptions() {
        let items = [];
        let tables = CONSTANTS.TABLE_NAMES;

        for (let i = 0; i <= tables.length - 1; i++) {
            // Dynamically set the options for tables
            items.push(<option value={tables[i]}>{tables[i]}</option>);
        }

        return items;
    }

    createColumnOptions() {
        let selectedTable = this.state.selectedTable;
        let columns = CONSTANTS.TABLES[selectedTable];

        let items = [];

        if (!columns) return;

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
                    Please select any restrictions:
                    <select multiple={true} value={this.state.displaySelectedColumns} onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                </label>
                <br/>
                <input type="submit" value="Generate Query"/>
            </form>
        );
    }
}