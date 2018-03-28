import React from "react";
import request from "superagent";
import {CONSTANTS} from "../TableConstants";
import {Button} from 'reactstrap';

export default class Update extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColumn: '',
            selectedTable: '',
            newValue: '',

            whereFormStates: []
            /*
             whereFormStates[i] = {
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

    /* HANDLE FUNCTIONS */

    handleSubmit(event) {
        let that = this;
        request
            .post('/api/query')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .query({query: that.buildQuery()})
            .end(function (err, res) {
                if (err) throw err;

                console.log(res.text);
                that.props.setData(JSON.parse(res.text));
                that.setState({
                    queryResults: res,
                    headerNames: [that.state.selectedColumn]
                });
            });
        event.preventDefault();
    }

    handleTableChanges(event) {
        let tableSelected = event.target.value;
        this.setState({
            selectedTable: tableSelected,
            selectedColumn: '',
        });
    }

    handleColumnChanges(event) {
        let newColumn = this.state.selectedColumn;
        let eventValue = event.target.value;

        this.setState({selectedColumn: eventValue});
    }

    handleValueInput(event) {
        let newValue = event.target.value;
        this.setState({newValue: newValue});
    }

    handleWhereColumnStates(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.selectedCondition = value;

        whereFormStates[id] = state;

        this.setState({whereFormStates: whereFormStates});
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
        let selectedColumn = this.state.selectedColumn;
        let newValue = this.state.newValue;
        let whereQuery = this.state.whereFormStates;
        let WHERE = "";

        whereQuery.map((query, i) => {
            if (i !== 0) {
                WHERE += " " + query.conjunction
            }

            WHERE += " " + query.selectedColumn + " " + query.selectedCondition + " " + "\'" + query.inputtedValue + "\'";

        });

        let query = `UPDATE ${selectedTable} SET ${selectedColumn} = \'${newValue}\'`;

        if (WHERE !== "") {
            WHERE = " WHERE" + WHERE;
            query += WHERE;
        }

        console.log(query);

        return query + ";";
    };


    /* CREATE OPTIONS */

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
            let column = columns[i].split('.')[1];
            items.push(<option value={column}>{column}</option>);
        }

        console.log(items);

        return items;
    }

    createWhereOption(event) {

        if (this.state.selectedTable === '') return;

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
                    <h5>Choose a table to Alter:</h5>
                    <select value={this.state.tableNames} onChange={this.handleTableChanges}>
                        {this.createTableOptions()}
                    </select>
                </label>
                <br/>
                <br/>
                {this.state.selectedTable !== '' &&
                <label>
                    <h5>Choose a column to Update</h5>
                    <select value={this.state.selectedColumn}
                            onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                </label>
                }
                <br/>
                <br/>
                {this.state.selectedColumn !== '' &&
                <label>
                    <h5>Set new value</h5>
                    <input value={this.state.newValue}
                           onChange={this.handleValueInput.bind(this)}>
                    </input>
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
                            <Button outline color="danger" type="button" value="delete" id={i}
                                    onClick={this.deleteWhereOption.bind(this)}>Delete
                            </Button>

                        </div>))}
                </label>
                }
                <br/>
                <br/>
                {this.state.selectedTable !== '' &&
                <div>
                    {button}
                    <Button type="submit" color="success">Generate Query</Button>
                </div>
                }

            </form>
        );
    }
}