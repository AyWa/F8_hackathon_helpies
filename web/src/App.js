import React, { Component } from 'react';
import {Button, Icon, Navbar, NavItem, Row, Col, Card, CardTitle, Collection, CollectionItem} from 'react-materialize'

import Search from './components/search.js';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meetupListData: [
        {
          title: "Korea azure day",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png",
          key: 1234131231237
         
        }, {
          title: "F8 hackathon",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/django-girls-images/django-girls-cover.png",
          key: 1234134231237
        }, {
          title: "American Red Cross",
          img: "https://upload.wikimedia.org/wikipedia/en/7/7f/American_Red_Cross_logo.svg",
          key: 3243134231237
        }, {
          title: "Meals on Wheels",
          img: "https://betterlivesleeds.files.wordpress.com/2016/11/mowlogo.jpg?w=640&h=320",
          key: 3244313231299
        }
      ]
    }
  }
  termSearch(term) {
    this.setState({term: term});
  }
  

  render() {
    const { meetupListData } = this.state;
    const termSearch = _.debounce(term => { this.termSearch(term) }, 500);


    return (
      <div className="App">
        <Navbar brand='Helpies' right>
        <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
        <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem>
      </Navbar>

      <Search onSearchTermChange={termSearch}/>
      <Row>
        <Col s={7} className='grid-example'>
        <Card className='small'
          header={<CardTitle image='https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png'>Card Title</CardTitle>}
          actions={[<a href='#'>This is a Link</a>]}>
          I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.
        </Card>
        </Col>
        <Col s={5} className='grid-example'>
        <Collection>
          {
            meetupListData.map(meetup => {
              return <CollectionItem>{meetup.title}</CollectionItem>
            })
          }
        </Collection>
        
        </Col>
      </Row>
      </div>
    );
  }
}

export default App;
