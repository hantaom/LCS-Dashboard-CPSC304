import React from "react";
import request from "superagent";
import {CONSTANTS} from "../TableConstants";
import { Button } from 'reactstrap';

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColumns: {},
            selectedTable: '',
            displayColumns: [],
            displaySelectedColumns: [],
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
        let that = this;
        request
            .post('/api/query')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .query({ query: that.buildQuery()})
            .end(function(err, res){
                console.log(res.text);
                that.setState({
                    queryResults: res,
                    headerNames: that.state.displaySelectedColumns
                });
            });
        event.preventDefault();
    }

    createTableOptions() {
        let items = [];
        let tables = CONSTANTS.TABLE_NAMES;

        tables.forEach(table => {
            items.push(<option key={table} value={table}>{table}</option>);
        });

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

        console.log(items);

        return items;
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <header>Table:</header>
                    <select multiple={true} value={this.state.tableNames} onChange={this.handleTableChanges}>
                        {this.createTableOptions()}
                    </select>
                </label>
                <br/>
                <br/>

                <label>
                    <header>Please select data from table:</header>
                    <select multiple={true} value={this.state.displaySelectedColumns} onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                </label>
                <br/>
                <br/>
                <Button type="submit" outline color="primary">Generate Query</Button>
            </form>
        );
    }
}