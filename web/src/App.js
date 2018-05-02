import React, { Component } from 'react';
import {Button, Icon, Navbar, NavItem, Row, Col, Card, CardTitle, Collection, CollectionItem} from 'react-materialize';

import Search from './components/search';
import MeetupList from './components/meetupList';

import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meetupListData: [
        {
          title: "Korea azure day",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png"
        }, {
          title: "F8 hackathon",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/django-girls-images/django-girls-cover.png"
        }, {
          title: "American Red Cross",
          img: "https://upload.wikimedia.org/wikipedia/en/7/7f/American_Red_Cross_logo.svg"
        }, {
          title: "Meals on Wheels",
          img: "https://betterlivesleeds.files.wordpress.com/2016/11/mowlogo.jpg?w=640&h=320"
        }, {
          title: "Tutoring",
          img: "https://uwaylc.org/get/files/image/galleries/Reader-Tutor-Mentor.png"
        }, {
          title: "Earth Day",
          img: "https://liferaftgroup.org/wp-content/uploads/2015/04/volunteer.jpg"
        }
      ]
    }
  }

  render() {
    const { meetupListData } = this.state;
    var Img = "https://betterlivesleeds.files.wordpress.com/2016/11/mowlogo.jpg?w=640&h=320";
    return (
      <div className="App">
        <Navbar brand='Helpies' right>
        <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
        <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem>
      </Navbar>
      <Search />
      <MeetupList />
      <Row>
        <Col s={7} className='grid-example'>
        <Card className='small'
          header={<CardTitle 
            image='https://betterlivesleeds.files.wordpress.com/2016/11/mowlogo.jpg?w=440&h=220'>Card Title</CardTitle>}
          actions={[<a href='#'>This is a Link</a>]}>
          I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.
        </Card>
        </Col>
        <Col s={5} className='grid-example'>
        <CollectionItem>
          {
            meetupListData.map(meetup => {
              return (
                <Card>{meetup.title} 
                  <div class="card-image">
                    <img src={meetup.img}/>
                  </div>
                </Card>
              )
            })
          }
        </CollectionItem>
        
        </Col>
      </Row>
      </div>
    );
  }
}

export default App;
