import React, { Component } from 'react';
import { Redirect } from 'react-router';
import TransformerForm from '../components/TransformerForm.js';

class EditPage extends Component {

  state = {
    redirect: false
  }

  // Initial values for the TransformerForm
  editInit = {
    // Vehicles
    availableVehicleTypes: [],
    availableVehicleModels: [],
    typesDisabled: false,
    modelsDisabled: false,
    // Transformer
    name: '',
    status: '',
    faction: '',
    gear: [],
    vehicleGroup: '',
    vehicleType: '',
    vehicleModel: '',
    id: ''
  }

  // PUT edited transformer to JSON server
  saveChanges = (preparedData) => {
    let transformers = [...this.props.transformers];
    let transformerKey = this.getTransformerKey(preparedData, transformers);
    transformers[transformerKey] = preparedData;   // mutating a list to keep the order of transformers (and TransformerStatus working)

    fetch(`https://my-json-server.typicode.com/fpiskur/transformers-api/transformers/${preparedData.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...preparedData })
    })
    .then(response => response.json())
    .then(json => {
      this.setState({ redirect: true });
      this.props.updateTransformersList(transformers); 
    })
    .catch(error => console.error('Error: ID not found on fake server'));
  }

  // Return index position of transformer in allTransformers
  getTransformerKey = (transformer, allTransformers) => {
    for (let i = 0; i < allTransformers.length; i++) {
      if (allTransformers[i].id === transformer.id) {
        return i;
      }
    }
    return null;
  }

  UNSAFE_componentWillMount() {   // deprecated!
    // get transformer data from TransformersListItem and update editInit
    let transformerId = Number(this.props.match.params.id);
    let [transformer] = this.props.transformers
                     .filter(transformer => transformer.id === transformerId);
    this.editInit = { ...transformer };
  }

  render() {

    let { redirect } = this.state;
    if(redirect) {
      return <Redirect to='/' />
    }

    return (
      <div className="container">
        <h1 className="d-inline-block">Edit Transformer</h1>
        <hr/>

        <TransformerForm
          factions={this.props.factions}
          vehicleTypes={this.props.vehicleTypes}
          init={this.editInit}
          method={this.saveChanges}
          submitText="Save Changes"
        />

      </div>
    );
  }
}

export default EditPage;
