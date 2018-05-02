import React, { Component } from 'react';
import {Button, Navbar, NavItem, Row, Col, Card, CardTitle, Collection, CollectionItem} from 'react-materialize'
import { NavLink, Route, Switch } from "react-router-dom";
import { Layout, Icon, Menu } from "antd";

import firebase from 'firebase';
import Search from './components/search.js'
import Form from './components/Form.js'
import Home from './components/Home.js'
import Intro from './components/Intro.js'
import Meetups from './components/Meetups.js'
import Meetup from './components/Meetup.js'
import {provider, auth} from './client';


import logo from './static/img/helpies.svg';

const { Header, Content, Footer } = Layout;


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      meetupList: [{
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
    const { meetupList, user } = this.state;
    console.log(user);
    return (
      <div className="App">
      <Layout>
        <Header>
          <img src={logo} className="logo" alt="logo" /><span>for organizers</span>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            {/* 
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
            */}
            <li className="login-box">
              {user ?
                <div><img src={user.photoURL}/> {user.displayName}</div> : 
                <div className="button-facebook" onClick={this.login.bind(this)}>Login with Facebook</div>
              }
            </li>
          </Menu>
        </Header>
        <Content>
          <Switch>
            <Route exact path="/meetup/create" component={Form}/>
            <Route exact path="/meetup/:id" component={Meetup}/>
            <Route exact path="/meetup" component={Meetups}/>
            <Route exact path="/home" component={Home}/>
            <Route exact path="/" component={Intro}/>
          </Switch>
        </Content>
        <Footer>
          Helpies ©2018 Created in F8 hackathon
          <a href="https://github.com/milooy/noote/"><Icon type="github" /></a>
        </Footer>
      </Layout>


    {/*
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
    */}
      </div>
    );
  }
}

export default App;
