import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import OverviewPage from './pages/OverviewPage.js';
import AddNewPage from './pages/AddNewPage.js';
import EditPage from './pages/EditPage.js';

class App extends Component {

  state = {
    isLoaded: false,
    error: null,
    factions: [],
    vehicleTypes: [],
    transformers: []
  }

  componentDidMount() {
    // Fetch data from JSON server
    fetch('https://my-json-server.typicode.com/fpiskur/transformers-api/db')
      .then(res =>  {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error: Server communication failed. Response not 'OK'.");
        } 
      })
      .then(json => {
        this.setState({
          isLoaded: true,
          factions: json.factions,
          vehicleTypes: json.vehicleTypes,
          transformers: json.transformers
        })
      })
      .catch(error => this.setState({ error: error }));
  }

  // Update transformers state sent from AddNewPage or EditPage
  updateTransformersList = (updatedTransformers) => {
    this.setState({ transformers: [...updatedTransformers] });
  }

  render() {
    
    let {isLoaded, error, factions, vehicleTypes, transformers} = this.state;

    if (error) {
      return <p className="alert alert-danger" role="alert">{error.message}</p>;
    }

    if(!isLoaded) {
      return <div className="text-center" style={{ marginTop: 'calc(100vh / 2 - 3em)' }}>Loading...</div>
    } else {
      return (
        <Router>
          <div className="py-4">
            <Route exact path="/" render={(props) => (
              <OverviewPage {...props}
                factions={factions}
                transformers={transformers}
              />
            )} />
            <Route exact path="/add-new" render={(props) => (
              <AddNewPage {...props}
                factions={factions}
                vehicleTypes={vehicleTypes}
                transformers={transformers}
                updateTransformersList={this.updateTransformersList}
              />
            )} />
            <Route exact path="/edit/:id" render={(props) => (
              <EditPage {...props}
                factions={factions}
                transformers={transformers}
                vehicleTypes={vehicleTypes}
                updateTransformersList={this.updateTransformersList}
              />
            )} />
          </div>
        </Router>
      );
    }
  }

}

export default App;
