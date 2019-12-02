import React, { Component } from 'react';

class VehicleSelectList extends Component {

  render() {
    return (
      <div className="col-12 mb-3">
        <select
          className={"form-control custom-select " + this.props.vehicleClass }
          defaultValue={this.props.default}
          onChange={this.props.method}
          disabled={this.props.disabled}
          required
        >
          <option hidden value="">{this.props.dropDownPlaceholder}</option>
          {this.props.optionsList.map(vehicleProp => (
            <option key={vehicleProp.toString()} value={vehicleProp}>{ vehicleProp }</option>
          ))};
        </select>
      </div>
    );
  }

}

export default VehicleSelectList;
