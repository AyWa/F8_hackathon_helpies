import React, { Component } from 'react';
import {Button, Icon, Navbar, NavItem, Row, Col, Card, CardTitle, Collection, CollectionItem} from 'react-materialize'

import Search from './components/search.js';
import logo from './logo.svg';
import './App.css';

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

  render() {
    const { meetupListData } = this.state;
   


    return (
      <div className="App">
        <Navbar brand='Helpies' right>
          <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
          <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem>
        </Navbar>

      <Search meetupListData={this.state.meetupListData}/>
      <Row>
        <Col s={7} className='grid-example'>
        <Card className='card large'
          header={<CardTitle image='https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png'></CardTitle>}
          actions={[<a href='https://www.google.com'>Sign up!</a>]}>
          <p>We are looking for volunteers for the month of May!</p>
          <p>Please feel free to visit our Facebook Page to learn more about us</p>
          
          
        </Card>
        </Col>
        <Col s={5} className='grid-example'>
        <Collection>
          {
            meetupListData.map(meetup => {
              return (
                <div class="card tiny">
                  <CollectionItem class="card horizontal">{meetup.title}
                    <div class="card-image">
                      <img src={meetup.img}/>
                    </div>
                  </CollectionItem>
                </div>
              )
               
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
