import React, { Component } from 'react';
import './App.css';
import TableView from "./components/TableView";
import request from 'superagent';
import Selection from "./components/Selection";
import Join from "./components/Join"

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
  };

  getQueryResults = () => {
    let that = this;
    request
    .post('/api/query')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .query({ query: that.buildQuery()})
    .end(function(err, res){
      console.log(res.text);
      that.setState( {queryResults: res.text })
    }); 
  };

  buildQuery = () => {
    // Builds a query from forms or whatever

      // temporarily returning generic query
      return 'SELECT * FROM PLAYERS;';
  };

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
            <h1>Selection Queries</h1>
            <Selection/>
            <h1>Join Queries</h1>
            <Join/>
            <br/>
          </div>
      </div>
    );
  }
}

export default App;
