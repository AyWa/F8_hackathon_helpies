import React, { Component } from 'react';
import {Input} from 'react-materialize'

class Search extends Component {
  render() {
    return (
      <div>
        <Input placeholder="Search..." s={6} label="q" />
      </div>
    );
  }
}

export default Search;
