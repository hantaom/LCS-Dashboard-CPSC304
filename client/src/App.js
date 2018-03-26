import React, { Component } from 'react';
import './App.css';
import TableView from "./components/TableView";

class App extends Component {
  // Initialize state
  state = { queryResults: []}

  // Fetch Query Results
  componentDidMount() {
    this.getQueryResults();
  }

  // Get the results of the query
  getQueryResults = () => {
    // Get the query results
    fetch('/api/query')
      .then(res => res.json())
      .then(queryResults => this.setState({ queryResults }))
  }

  render() {
    // const { passwords } = this.state;
    const { queryResults } = this.state;
    console.log(queryResults);
    return (
      <div className="App">
        <h1> LCS Dashboard - NEW CHANGE!!!!!! </h1>
          <div>
            <h1>LCS Dashboard</h1>
            <button
              className="more"
              onClick={this.getQueryResults}
              >
              See Stats
            </button>
            <TableView/>
          </div>
        )}
      </div>
    );
  }
}

export default App;
