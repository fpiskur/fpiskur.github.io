import React, { Component } from 'react';

class TransformerStatus extends Component {

  state = { status: this.props.status }

  // Call updateStatus() from TransformersListItems.js and pass selected status and transformer id
  handleStatusChange = (e) => {
    let status = e.target.value;
    let id = this.props.id;
    this.props.updateStatus(status, id);
  }

  UNSAFE_componentWillReceiveProps(props) {   // deprecated!
    // Update state.status when getting updated props from TransformersListItems.js
    this.setState({ status: props.status })
  }

  render() {

    return (
      <select className="form-control custom-select" value={this.state.status} onChange={this.handleStatusChange}>
        <option value="OK">OK</option>
        <option value="INJURED">INJURED</option>
        <option value="MIA">MIA</option>
      </select>
    );

  }

}

export default TransformerStatus;
