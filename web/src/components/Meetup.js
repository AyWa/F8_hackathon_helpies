import React, { Component } from 'react';
import {Input} from 'react-materialize'
import { Card, Col, Row, Icon } from 'antd';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetupId: "",
      meetupList: [{
          id: 1,
          title: "Korea azure day",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png"
        }, {
          id: 2,
          title: "F8 hackathon",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/django-girls-images/django-girls-cover.png"
        }
      ],
      meetupDetail: {},
    }
  }

  componentDidMount() {
    const meetupId = this.props.match.params.id;
    const {meetupList} = this.state;
    const meetupDetail = meetupList.find(d => d.id == meetupId);

    this.setState({meetupDetail})
  }
  render() {
    const {meetupDetail} = this.state;
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
        
      </div>
    );
  }
}

export default Search;
