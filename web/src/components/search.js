import React, { Component } from 'react';
import { textarea } from 'react-materialize';
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
    // this.props.termSearch(e.target.value);
  }



  render() {
    return (
      <div class="input">
        <textarea placeholder="Search..." onChange={this.inputChange} s={6} />
      </div>
    );
  }
 

}

export default Search;


    // filterSearch(term) {
    //   var data = this.props.meetupListData;
    //   return data.filter(item => {
    //     console.log(this.state.term)
    //     console.log(item.title)
    //     if(term.includes(item.title)) {
    //       console.log('hi')
    //     } else {
    //       console.log('nope')

        // }