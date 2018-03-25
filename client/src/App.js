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
        {/* Render the passwords if we have them */}
        {queryResults.length ? (
          <div>
            <h1>Results</h1>
            <ul className="queryResults">
              {/*
                Generally it's bad to use "index" as a key.
                It's ok for this example because there will always
                be the same number of passwords, and they never
                change positions in the array.
              */}
              {queryResults.map((result, index) =>
                <li key={index}>
                  {result}
                </li>
              )}
            </ul>
            <button
              className="more"
              onClick={this.getQueryResults}>
              Get More
            </button>
          </div>
        ) : (
          // Render a helpful message otherwise
          <div>
            <h1>No results :(</h1>
            <button
              className="more"
              onClick={this.getQueryResults}>
              Try Again?
            </button>
          </div>
        )}
        <TableView/>
      </div>
    );
  }
}

export default App;
