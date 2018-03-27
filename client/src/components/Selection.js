import React from "react";
import request from "superagent";
import {CONSTANTS} from "../TableConstants";
import {Button} from 'reactstrap';

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColumns: {},
            selectedTable: '',
            displayColumns: [],
            displaySelectedColumns: [],

            whereFormStates: []
            /**
             * whereFormStates[i] = {
                conjunction: conjunction,
                selectedColumn: "",
                selectedCondition: "",
                inputtedValue: ""
                };
             */
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
        let whereQuery = this.state.whereFormStates;
        let WHERE = "";

        whereQuery.map((query, i) => {
            if (i !== 0) {
                WHERE += " " + query.conjunction
            }

            WHERE += " " + query.selectedColumn + " " + query.selectedCondition + " " + "\'" + query.inputtedValue + "\'";

        });

        selectedColumns = selectedColumns.length > 0 ? selectedColumns : '*';

        let query = `SELECT ${selectedColumns} FROM ${selectedTable}`;

        if (WHERE !== "") {
            query += " WHERE" + WHERE;
        }

        console.log(query);

        return query + ";";
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

        if (i === 0) {
            conjunction = "";
        }

        newWhereForm[i] = {
            conjunction: conjunction,
            selectedColumn: "",
            selectedCondition: "",
            inputtedValue: ""
        };

        this.setState({whereFormStates: newWhereForm});
    }

    render() {
        const button = this.state.whereFormStates.length > 0 ? (
            <div>
                <Button type="button" outline color="secondary" value="AND" onClick={this.createWhereOption.bind(this)}>Add
                    AND condition</Button>
                <Button type="button" outline color="secondary" value="OR" onClick={this.createWhereOption.bind(this)}>Add
                    OR condition</Button>
            </div>
        ) : (
            <Button type="button" outline color="secondary" value="OR" onClick={this.createWhereOption.bind(this)}>Add
                Condition</Button>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <h5>Table:</h5>
                    <select multiple={true} value={this.state.tableNames} onChange={this.handleTableChanges}>
                        {this.createTableOptions()}
                    </select>
                </label>
                <br/>
                <br/>
                {this.state.selectedTable !== '' &&
                <label>
                    <h5>Please select data from table:</h5>
                    <select multiple={true} value={this.state.displaySelectedColumns}
                            onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                </label>
                }
                <br/>
                <br/>
                {this.state.whereFormStates.length > 0 &&
                <label>
                    <h5>Add your conditions:</h5>
                    {this.state.whereFormStates.map((formState, i) => (
                        <div className="whereClauses" id={i}>
                            <div>{formState.conjunction}</div>
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
                            <button type="button" value="delete" id={i}
                                    onClick={this.deleteWhereOption.bind(this)}>Delete
                            </button>

                        </div>))}
                </label>
                }
                <br/>
                <br/>
                {button}
                <Button type="submit" outline color="primary">Generate Query</Button>
            </form>
        );
    }
}