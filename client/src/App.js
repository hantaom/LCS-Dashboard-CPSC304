import React, { Component } from 'react';
import './App.css';
import TableView from "./components/TableView";

class App extends Component {
  // Initialize state
  // state = { passwords: []}
  state = { queryResults: []}
  

  // Fetch passwords after first mount
  componentDidMount() {
    // this.getPasswords();
    this.getQueryResults();
  }

  getPasswords = () => {
    // Get the passwords and store them in state
    fetch('/api/passwords')
      .then(res => res.json())
      .then(passwords => this.setState({ passwords }));
  }

  // Get the results of the query
  getQueryResults = () => {
    // Get the passwords and store them in state
    fetch('/api/query')
      .then(res => res.json())
      .then(queryResults => this.setState({ queryResults }));
  }

  render() {
    // const { passwords } = this.state;
    const { queryResults } = this.state;

    return (
      <div className="App">
        <h1> LCS Dashboard </h1>
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
