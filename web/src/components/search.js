import React, { Component } from 'react';
import {Input} from 'react-materialize';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    };
    this.inputChange = this.inputChange.bind(this);

  }
  inputChange(e){
    this.setState({term: e.target.value});
    // console.log('input', this.state.term)
  }

  render() {
    return (
      <div>
        <Input placeholder="Search..." onChange={this.inputChange} s={6} label="Search for volunteers!" />
      </div>
    );
  }
}

export default Search;
