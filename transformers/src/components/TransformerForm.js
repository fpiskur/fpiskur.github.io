import React, { Component } from 'react';
import VehicleSelectList from '../components/VehicleSelectList.js';
import GearForm from '../components/GearForm.js';

class TransformerForm extends Component {

  state = {
    // Vehicles
    availableVehicleTypes: this.props.init.availableVehicleTypes,
    availableVehicleModels: this.props.init.availableVehicleModels,
    typesDisabled: this.props.init.typesDisabled,
    modelsDisabled: this.props.init.modelsDisabled,
    // Input values
    name: this.props.init.name,
    status: this.props.init.status,
    faction: this.props.init.faction,
    gear: this.props.init.gear,
    vehicleGroup: this.props.init.vehicleGroup,
    vehicleType: this.props.init.vehicleType,
    vehicleModel: this.props.init.vehicleModel,
    id: this.props.init.id
  }

  UNSAFE_componentWillMount() {   // deprecated!
    // Update state of vehicle properties from props
    let availableVehicleTypes = this.getUniqueVehicleTypes(this.state.vehicleGroup);
    let availableVehicleModels = this.getUniqueVehicleModels(this.state.vehicleType);
    this.setState({
      availableVehicleTypes: availableVehicleTypes,
      availableVehicleModels: availableVehicleModels,
      vehicleType: this.props.init.vehicleType,
      vehicleModel: this.props.init.vehicleModel
    });
  }

  getUniqueVehicleGroups() {
    return [...new Set(this.props.vehicleTypes.map(vehicle => vehicle.group))];
  }

  getUniqueVehicleTypes(vehicleGroup) {
    let allGroupTypes = this.props.vehicleTypes.filter(selectedType => selectedType.group === vehicleGroup)
                                           .map(vehicle => vehicle.type);
    return [...new Set(allGroupTypes)];
  }

  getUniqueVehicleModels(vehicleType) {
    return this.props.vehicleTypes.filter(selectedModel => selectedModel.type === vehicleType)
                                  .map(vehicle => vehicle.model);
  }

  handleNameChange = (e) => {
    let {value} = e.target;
    this.setState({ name: value });
  }

  handleStatusChange = (e) => {
    let {value} = e.target;
    this.setState({ status: value });
  }

  handleFactionChange = (e) => {
    let {value} = e.target;
    this.setState({ faction: value });
  }

  handleGroupChange = (e) => {
    let {value} = e.target;
    let uniqueVehicleTypes = this.getUniqueVehicleTypes(value);

    this.setState({
      availableVehicleTypes: uniqueVehicleTypes,
      availableVehicleModels: [],
      typesDisabled: false,
      modelsDisabled: true,
      vehicleGroup: value
    });
  }

  handleTypeChange = (e) => {
    let {value} = e.target;
    let uniqueVehicleModels = this.getUniqueVehicleModels(value);

    this.setState({
      availableVehicleModels: uniqueVehicleModels,
      modelsDisabled: false,
      vehicleType: value
    });
  }

  handleModelChange = (e) => {
    let {value} = e.target;
    this.setState({ vehicleModel: value });
  }

  // Give required elements :invalid style to mimic Firefox's :-moz-ui-invalid
  checkValidation = (e) => {
    document.querySelectorAll("[required]").forEach(element =>  {
      element.classList.add('required')
    });
  }

  // Prevent from submitting a form on "Enter"
  handleEnterKey = (e) => {
    let code = e.keyCode || e.which;
    if(code === 13) {
        e.preventDefault();
    }
  }

  updateGear = (newGearItems) => {
    let fullList = [...new Set(this.state.gear.concat(newGearItems))]
    this.setState({ gear: fullList });
  }

  deleteGearItem = (index) => {
    this.setState(state => ({ gear: state.gear.filter(item => state.gear.indexOf(item) !== index) }));
  }

  // Collect data from state and pass it to method() in AddNewPage or EditPage
  submitTransformer = (e) => {
    e.preventDefault()
    let data = this.state;
    let allowed = [ 'name', 'status', 'faction', 'gear', 'vehicleGroup', 'vehicleType', 'vehicleModel', 'id' ];
    let prepared = Object.keys(data)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    this.props.method({...prepared});
  };

  render() {

    let { factions } = this.props;

    return (

        <form onSubmit={this.submitTransformer}>
          <div className="row my-5">
            <div className="col-12 col-md-7 col-lg-6">
              <div className="row form-group">
                <div className="col-12 col-md-3">
                  <label htmlFor="name">Name: <abbr title="Required">*</abbr></label>
                </div>
                <div className="col-12 col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                    onKeyPress={this.handleEnterKey}
                    required
                  />
                </div>
              </div>

              <div className="row form-group">
                <div className="col-12 col-md-3">
                  <label htmlFor="status">Status: <abbr title="Required">*</abbr></label>
                </div>
                <div className="col-12 col-md-9">
                  <select
                    className="form-control custom-select"
                    id="status"
                    value={this.state.status}
                    onChange={this.handleStatusChange}
                  >
                    <option value="OK">OK</option>
                    <option value="INJURED">INJURED</option>
                    <option value="MIA">MIA</option>
                  </select>
                </div>
              </div>

              <div className="row form-group">
                <div className="col-12 col-md-3">
                  <label htmlFor="faction">Faction: <abbr title="Required">*</abbr></label>
                </div>
                <div className="col-12 col-md-9">
                  <select
                    className="form-control custom-select"
                    id="faction"
                    value={this.state.faction}
                    onChange={this.handleFactionChange}
                    required
                  >
                    <option hidden value=""> -- choose faction -- </option>
                    {factions.map(faction => (
                      <option key={faction.id} value={faction.name}>{ faction.name }</option>
                    ))};
                  </select>
                </div>
              </div>

              <GearForm gear={this.state.gear} addGearItems={this.updateGear} deleteGearItem={this.deleteGearItem} />
            </div>

            <div className="col-12 col-md-5 col-lg-6">
              <div className="row form-group">
                <fieldset className="w-100">
                  <div className="col-12 mb-3" style={{ height: '38px' }}>
                    <legend><small>Vehicle properties <abbr title="Required">*</abbr></small></legend>
                  </div>

                  <VehicleSelectList
                    dropDownPlaceholder = " -- vehicle group -- "
                    optionsList = {this.getUniqueVehicleGroups()}
                    disabled = {false}
                    method = {this.handleGroupChange}
                    default = {this.state.vehicleGroup}
                  />

                  <VehicleSelectList
                    dropDownPlaceholder = " -- vehicle type -- "
                    optionsList = {this.state.availableVehicleTypes}
                    disabled = {this.state.typesDisabled}
                    method = {this.handleTypeChange}
                    default = {this.state.vehicleType}
                  />

                  <VehicleSelectList
                    dropDownPlaceholder = " -- vehicle model -- "
                    optionsList = {this.state.availableVehicleModels}
                    disabled = {this.state.modelsDisabled}
                    method = {this.handleModelChange}
                    default = {this.state.vehicleModel}
                  />

                </fieldset>
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary btn-lg" onClick={this.checkValidation}>{this.props.submitText}</button>
            </div>
          </div>

        </form>

    );

  }

}

export default TransformerForm;
