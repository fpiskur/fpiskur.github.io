import React, { Component } from 'react';
import TopBar from '../components/TopBar.js';
import TransformersListItems from '../components/TransformersListItems.js';

class OverviewPage extends Component {

  state = {
    transformers: this.props.transformers,
    notFound: false
  }

  UNSAFE_componentWillReceiveProps(props) {   // deprecated!
    // Update state.transformers when getting updated props from Route in App.js
    this.setState({ transformers: [...props.transformers] });
  }

  // Filter the list of transformers according to choosen faction and update state.transformers
  filterList = (faction) => {
    let outputList = this.props.transformers.filter(transformer => transformer.faction === faction);
    if(outputList[0]) {
      this.setState({ transformers: [...outputList] });
    } else {
      this.setState({ transformers: [...this.props.transformers] })
    }
  }

  // Filter the list of transformers according to search term and update state.transformers
  handleSearch = (searchTerm) => {
    let outputList = this.props.transformers.filter(transformer => transformer.name.toLowerCase().startsWith(searchTerm.toLowerCase()));
    if(outputList[0] ) {   // result exists
      this.setState({ transformers: [...outputList], notFound: false });
    } else if (!outputList[0] && !searchTerm) {   // empty search field
      this.setState({ transformers: [...this.props.transformers], notFound: false });
    } else {   // not found
      this.setState({ notFound: true });
    }
  }

  render() {

    return (
      <div className="container">

        <h1>Transformers Overview</h1>
        <hr />

        <TopBar
          factions={this.props.factions}
          filterList={this.filterList}
          handleSearch={this.handleSearch}
        />
        <hr className="mb-0" />
        <TransformersListItems
          transformers={this.state.transformers}
          updateStatus={this.updateStatus}
          notFound={this.state.notFound}
        />

      </div>
    );
  }

}

export default OverviewPage;
