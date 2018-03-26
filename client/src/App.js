import React, { Component } from 'react';
import './App.css';
import TableView from "./components/TableView";
import request from 'superagent';

class App extends Component {
  // Initialize state

  constructor(props) {
    super(props);
    this.state = { queryResults: {hello: "WORLD"} };
  }

  // Fetch Query Results
  componentDidMount() {
    this.getQueryResults();
  }

  // Get the results of the query
  getRequestCall = () => {
    // Get the query results
    fetch('/api/temp')
      .then(res => res.json())
      .then(queryResults => this.setState({ queryResults }))
  }

  getQueryResults = () => {
    let that = this;
    request
    .post('/api/query')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .query({ query: 'SELECT * FROM PLAYERS;'})
    .end(function(err, res){
      console.log(res.text);
      that.setState( {queryResults: res.text })
    }); 
  }

  render() {
    const { queryResults } = this.state;
    return (
      <div className="App">
        <h1> LCS Dashboard - NEW CHANGE!!!!!! </h1>
          <div>
            <h1>LCS Dashboard</h1>
            <pre>
              {JSON.stringify(queryResults)}
            </pre>
            <button
              className="more"
              onClick={this.getQueryResults}
              >
              See Stats
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
