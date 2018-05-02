import React, { Component } from 'react';
import {Button, Icon, Navbar, NavItem, Row, Col, Card, CardTitle, Collection, CollectionItem} from 'react-materialize'

import firebase from 'firebase';
import Search from './components/search.js'
import {provider, auth} from './client';


import logo from './static/img/helpies.svg';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      meetupListData: [
        {
          title: "Korea azure day",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png"
        }, {
          title: "F8 hackathon",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/django-girls-images/django-girls-cover.png"
        }
      ]
    }
    
  }

  async login() {
    const { user } = this.state;
    console.log("hi");

    const result = await auth().signInWithPopup(provider)
    this.setState({user: result.user});
  }

  async logout() {
    const { user } = this.state;

    await auth().signOut()
    this.setState({user: null});
  }

  async componentWillMount() {
    const user = await auth().onAuthStateChanged();
    if(user) this.setState({user})
  }

  render() {
    const { meetupListData, user } = this.state;
    console.log(user);
    return (
      <div className="App">
        <Navbar brand='Helpies' right>
          <img src={logo}/>
          <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
          {user ?
            <NavItem><img src={user.photoURL}/> {user.displayName}</NavItem> : 
            <NavItem onClick={this.login.bind(this)}>Login with Facebook</NavItem>
          }
        </Navbar>
      <Search />
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
              return (
                <CollectionItem>
                  <img src={meetup.img} style={{width: '170px', display: 'inline-block'}}/>
                  {meetup.title}
                </CollectionItem>
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
