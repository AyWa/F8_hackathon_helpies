import React, { Component } from 'react';
import { Row, Col } from 'antd';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    const {meetupList} = this.state;
    console.log({meetupList})
    return (
      <div>
        <Row>
          <Col xs={12} sm={16}>Col</Col>
          <Col xs={12} sm={8}>
            <div>
              {
                meetupList.map(meetup => {
                  return (
                    <div className="card">
                      <img src={meetup.img} style={{width: '170px', display: 'inline-block'}}/>
                      {meetup.title}
                    </div>
                  ) 
                })
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
