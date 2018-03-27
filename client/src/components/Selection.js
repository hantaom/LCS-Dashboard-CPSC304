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

            // Where states
            whereConditions: [],
            whereFormStates: [],

            whereOptions: []
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
            selectedColumns: {},
            displayColumns: [],
            displaySelectedColumns: []
        });
    }

    columnChangeHelper(newColumns, eventValue) {
        if (newColumns[eventValue]) {
            delete newColumns[eventValue];
        } else {
            newColumns[eventValue] = eventValue;
        }

        let newColumnsArray = [];

        Object.keys(newColumns).forEach(key => {
            newColumnsArray.push(newColumns[key]);
        });

        return newColumnsArray;
    }

    handleColumnChanges(event) {
        let newColumns = this.state.selectedColumns;
        let eventValue = event.target.value;

        let newColumnsArray = this.columnChangeHelper(newColumns, eventValue);

        this.setState({displaySelectedColumns: newColumnsArray});
    }

    handleWhereColumnStates(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.selectedCondition = value;

        whereFormStates[id] = state;

        this.setState({whereFormStates: whereFormStates});

        // let newColumnsArray = this.columnChangeHelper(newColumns, eventValue);
    }

    handleWhereColumnChanges(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.selectedColumn = value;
        this.setState({whereFormStates: whereFormStates});

    }

    handleWhereInputChanges(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.inputtedValue = value;
        this.setState({whereFormStates: whereFormStates});
    }

    deleteWhereOption(event) {
        let forms = this.state.whereFormStates;
        let id = event.target.id;
        forms.splice(id, 1);
        this.setState({whereFormStates: forms});
    }

    buildQuery() {
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
            .query({query: that.buildQuery()})
            .end(function (err, res) {
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

    // WHERE

    createWhereOption(event) {
        let newWhereForm = this.state.whereFormStates;
        let conjunction = event.target.value;
        let i = newWhereForm.length;
        let that = this;

        newWhereForm[i] = {
            conjunction: conjunction,
            selectedColumn: "",
            selectedCondition: "",
            inputtedValue: ""
        };
        let element = [];
        for (let i = 0; i < newWhereForm.length; i++) {
            element.push(<li className="whereClauses" id={i}>
                <select id={i} value={that.state.whereFormStates[i].selectedColumn}
                        onChange={that.handleWhereColumnChanges.bind(that)}>
                    {that.createColumnOptions()}xcx ccx
                </select>
                <select id={i} value={that.state.whereFormStates[i].selectedCondition}
                        onChange={that.handleWhereColumnStates.bind(that)}>
                    <option key="lt" value="<">Less</option>
                    <option key="gt" value=">">Greater</option>
                    <option key="eq" value="=">Equal</option>
                    <option key="leq" value="<=">LessEq</option>
                    <option key="geq" value=">=">GreaterEq</option>
                </select>
                <input id={i} type="text" value={that.state.whereFormStates[i].inputtedValue}
                       onChange={that.handleWhereInputChanges.bind(that)}/>
            </li>);
        }

        this.setState({whereFormStates: newWhereForm});


    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <h3>Table:</h3>
                    <select multiple={true} value={this.state.tableNames} onChange={this.handleTableChanges}>
                        {this.createTableOptions()}
                    </select>
                </label>
                <br/>
                <br/>

                <label>
                    <h3>Please select data from table:</h3>
                    <select multiple={true} value={this.state.displaySelectedColumns}
                            onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                </label>

                <label>
                    <h3>Please create conditions:</h3>
                    {this.state.whereFormStates.map((formState, i) => (
                        <div className="whereClauses" id={i}>
                            <select id={i} value={formState.selectedColumn}
                                    onChange={this.handleWhereColumnChanges.bind(this)}>
                                {this.createColumnOptions()}
                            </select>
                            <select id={i} value={formState.selectedCondition}
                                    onChange={this.handleWhereColumnStates.bind(this)}>
                                <option key="lt" value="<">Less</option>
                                <option key="gt" value=">">Greater</option>
                                <option key="eq" value="=">Equal</option>
                                <option key="leq" value="<=">LessEq</option>
                                <option key="geq" value=">=">GreaterEq</option>
                            </select>
                            <input id={i} type="text" value={formState.inputtedValue}
                                   onChange={this.handleWhereInputChanges.bind(this)}/>
                            <button type="button" value="delete" id={i} onClick={this.deleteWhereOption.bind(this)}>Delete</button>

                        </div>))}
                </label>
                <br/>
                <button type="button" value="AND" onClick={this.createWhereOption.bind(this)}>Add AND condition</button>
                <button type="button" value="OR" onClick={this.createWhereOption.bind(this)}>Add OR condition</button>
                <br/>
                <input type="submit" value="Generate Query"/>
                <Button type="submit" outline color="primary">Generate Query</Button>
            </form>
        );
    }
}