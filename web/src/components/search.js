import React, { Component } from 'react';
import { Input } from 'react-materialize';
import _ from 'lodash'; 

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
      _.debounce(meetupListData.forEach(meetup => {
        if(element === term) {
          console.log('tre');
        } else {
          console.log('fal')
        }
      }), 500);
    }


  }


  

  render() {
    return (
      <div>
        <Input placeholder="Search..." onChange={this.inputChange} s={6} label="q" />
      </div>
    );
  }
}

export default Search;
