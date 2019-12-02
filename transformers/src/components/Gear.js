import React, { Component } from 'react';

class Gear extends Component {

  render() {
    if (this.props.gear && this.props.gear.length) {
      return (
        <div>
          {this.props.gear.map((item) => (
            <span key={item} className="badge badge-pill badge-secondary mr-1">{item}
              <button
                type="button"
                className="btn btn-link ml-1 p-0 text-white"
                style={{ lineHeight: 1, textDecoration: 'none' }}
                onClick={this.props.deleteGearItem.bind(this, this.props.gear.indexOf(item))}
              >&times;</button>
            </span>
          ))}
        </div>
      );
    } else {
      return (
        <div><span className="text-muted">Inventory empty</span></div>
      );
    }

  }

}

export default Gear;
