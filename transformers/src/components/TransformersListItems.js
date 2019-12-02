import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TransformerStatus from './TransformerStatus.js';
import autobotsLogo from '../images/autobots-logo.png';
import decepticonsLogo from '../images/decepticons-logo.png';

class TransformersListItems extends Component {

  state = {
    transformers: this.props.transformers
  }

  UNSAFE_componentWillReceiveProps(props) {   // deprecated!
    // Update state.transformers when getting updated props from OverviewPage.js
    this.setState({ transformers: props.transformers })
  }

  // Handle status update from TransformerStatus.js
  updateStatus = (status, id) => {
    fetch(`https://my-json-server.typicode.com/fpiskur/transformers-api/transformers/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: status })
    })
    .then(response => response.json())
    .then(json => {
      this.updateState(json)
    })
    .catch(error => console.error('Error: ', error));
  }

  // Update state.transformers after status change
  updateState = (transformer) => {
    let transformers = [...this.props.transformers];
    transformers[transformer.id].status = transformer.status;
    this.setState({ transformers: transformers })
  }

  render() {
    let { transformers } = this.state;
    let logo = {
      'Autobots': autobotsLogo,
      'Decepticons': decepticonsLogo
    };

    if(this.props.notFound) {
      return (
        <div className="text-center py-3">Sorry, no results</div>
      )
    } else {
      return (
        transformers.map(transformer => (
          <div key={transformer.id} className="row py-3 border-bottom">
            <div className="col-3 col-sm-1 d-flex align-items-center justify-content-center order-1">
              <div className="pb-3 pb-sm-0">
                <img
                  src={logo[transformer.faction]}
                  style={{ width: '30px', height: '30px' }}
                  data-toggle="tooltip"
                  title={transformer.faction}
                  alt={transformer.faction}
                />
              </div>
            </div>

            <div className="col-6 col-sm-4 col-md-3 offset-3 offset-sm-0 d-flex align-items-center order-3 order-sm-2">
              <TransformerStatus
              id={transformer.id}
              status={transformer.status}
              updateStatus={this.updateStatus}
            />
            </div>

            <div className="col-9 col-sm-5 col-md-6 order-2 order-sm-3">
              <div>{transformer.name}</div>
              <div style={{ lineHeight: 1 }}>
                <small className="text-muted">
                  { transformer.vehicleGroup } / { transformer.vehicleType } / { transformer.vehicleModel }
                </small>
              </div>
              <div style={{ lineHeight: 1 }}>
                <small className="text-muted">gear:&nbsp;
                  {Boolean(transformer.gear[0]) ? transformer.gear.join(', ') : <span>Inventory empty</span>}
                </small>
              </div>
              <div className="d-block d-sm-none w-100 mb-3"></div>
            </div>

            <div className="col-3 col-sm-2 d-flex align-items-center justify-content-end order-4">
              <div className="d-flex justify-content-end">
                <Link type="button" className="btn btn-outline-secondary" to={`edit/${transformer.id}`}>Edit</Link>
              </div>
            </div>
          </div>
        ))
      );
    }

  }

}

export default TransformersListItems;
