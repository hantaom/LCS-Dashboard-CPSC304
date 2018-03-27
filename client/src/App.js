import React, { Component } from 'react';
import './App.css';
import TableView from "./components/TableView";
import request from 'superagent';
import Selection from "./components/Selection";
import Join from "./components/Join"
import Delete from "./components/Delete"
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';

class App extends Component {
  // Initialize state

  constructor(props) {
    super(props);
    this.state = { queryResults: {hello: "WORLD"},
                   activeTab: '1'
                  };
    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
        <h1 className="title"> LCS Dashboard </h1>
          <div className="contentBody">
            <Nav tabs>
              <NavItem>
                <NavLink
                  onClick={() => { this.toggle('1'); }}
                  >
                  Selection Queries
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => { this.toggle('2'); }}
                >
                  Join Queries
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => { this.toggle('3'); }}
                >
                  Deletion Queries
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
               <Row>
                <Col sm="12">
                  <h4>Selection Queries</h4>
                  <Selection/>
                </Col>
               </Row>
              </TabPane>
              <TabPane tabId="2">
               <Row>
                <Col sm="12">
                  <h4>Join Queries</h4>
                  <Join/>
                </Col>
               </Row>
              </TabPane>
              <TabPane tabId="3">
               <Row>
                <Col sm="12">
                  <h4>Deletion Queries</h4>
                  <Delete/>
                </Col>
               </Row>
              </TabPane>
            </TabContent>
            <br/>
          </div>
          <TableView/>
      </div>
    );
  }
}

export default App;
