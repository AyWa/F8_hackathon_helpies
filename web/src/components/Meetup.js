import React, { Component } from 'react';
import {Input} from 'react-materialize'
import { Card, Col, Row, Icon, List, Avatar } from 'antd';

import {database} from '../client';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetupId: "",
      meetupList: [
        {
          id: 1,
          title: "Korea azure day",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png"
        }, {
          id: 2,
          title: "F8 hackathon",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/django-girls-images/django-girls-cover.png"
        }, {
          id: 3,
          title: "American Red Cross",
          img: "https://upload.wikimedia.org/wikipedia/en/7/7f/American_Red_Cross_logo.svg"
        }, {
          id: 4,
          title: "Meals on Wheels",
          img: "https://betterlivesleeds.files.wordpress.com/2016/11/mowlogo.jpg?w=640&h=320"
        }, {
          id: 5,
          title: "Tutoring",
          img: "https://uwaylc.org/get/files/image/galleries/Reader-Tutor-Mentor.png"
        }, {
          id: 6,
          title: "Earth Day",
          img: "https://liferaftgroup.org/wp-content/uploads/2015/04/volunteer.jpg"
        }
      ],
      meetupDetail: {},
      userList: [],
    }
  }

  componentDidMount() {
    const meetupId = this.props.match.params.id;
    const {meetupList} = this.state;
    const meetupDetail = meetupList.find(d => d.id == meetupId);

    this.setState({meetupDetail})
    // database.ref("users").once('name').then(snapshot => {
    //   var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
    //   console.log(username)
    // });
    var foo = database.ref("users").on('value', snapshot => {
      console.log("hi", Object.values(snapshot.val()));
      this.setState({userList: Object.values(snapshot.val())});
    });
    
  }
  render() {
    const {meetupDetail, userList} = this.state;
    return (
      <div>
      <Card style={{marginTop: "2.3rem"}}>
        <div className="meetup-info-box">
          <div className="meetup-img">
            <img src={meetupDetail.img} />
          </div>
          <div className="meetup-info">
            <div className="meetup-title">{meetupDetail.title}</div>
            <div className="meetup-venue">@Facebook Korea</div>
            <div className="meetup-time">
              <Icon type="clock-circle-o" />
              <div>Wednesday, May 2, 2018<br/>
              5:00 PM to 8:30 PM</div>
            </div>
            <div className="meetup-time">
              <Icon type="smile-o" />
              <div>26 people attended</div>
            </div>
          </div>
        </div>
        <div className="meetup-hashtag">
          <span>#DataScience</span>
          <span>#DevOps</span>
        </div>
      </Card>

      <div class="fb-customerchat" 
        // messenger_app_id="2106514809580301" 
        page_id="1001394340017755"
        // color="blue"
        // size="standard"
        >
      </div>

      <div className="sub-header">Members who selected</div>
      <Card style={{marginTop: "2.3rem"}}>
        <List
          itemLayout="horizontal"
          dataSource={userList.filter(d => ['Jay', 'Roy', 'Marc'].indexOf(d.name) >= 0)}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.picture || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />}
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.introduction}
              />
              <div className="location list-item">@{item.location}</div>
              <div className="job list-item">{item.role}</div>
            </List.Item>
          )}
        />
      </Card>
      <div className="sub-header">Members who applied</div>
      <Card style={{marginTop: "2.3rem"}}>
        <List
        itemLayout="horizontal"
        dataSource={userList}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.picture || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />}
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.introduction || "Hello~"}
            />
            <div>content</div>
          </List.Item>
        )}
      />
      </Card>
      </div>
    );
  }
}

export default Search;
