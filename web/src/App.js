import React, { Component } from 'react';
import {Button, Icon, Navbar, NavItem, Row, Col, Card, CardTitle, Collection, CollectionItem, CardPanel} from 'react-materialize';

import Search from './components/search';
// import MeetupList from './components/meetupList';

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
    };
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
      
      <Row>
        <Col s={7} className='grid-example'>
        <Card className='teal lighten-4 black-text'
          header={<CardTitle className="black-text"
            image='https://betterlivesleeds.files.wordpress.com/2016/11/mowlogo.jpg?w=440&h=220'><h5>Seeking for volunteers!</h5></CardTitle>}
          actions={[<a href='#'>Learn more about us!</a>]}>
          <p>Time: Tuesdays and Thursdays 7:00 PM</p>
          <p>Location: 1 Hacker Way, Menlo Park, CA 94025</p>
          
          
        </Card>
        </Col>
        <Col s={5} className='grid-example'>
        <CollectionItem>
          {
            meetupListData.map(meetup => {
              return (
                <Col s={12} m={7}>
                  <CardPanel className="small teal lighten-4 black-text">{meetup.title} 
                    <div className="small card-image">
                      <img src={meetup.img}/>
                    </div>
                  </CardPanel>
                </Col>
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
