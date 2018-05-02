import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meetupList: [{
          id: 1,
          title: "Korea azure day",
          img: "https://s3.ap-northeast-2.amazonaws.com/festa-temp/saturday-azure-live-1805-images/saturday-azure-live-1805-cover.png"
        }, {
          id: 2,
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
        <div className="header">My meetups</div>
        <Row gutter={16}>
          {
            meetupList.map(meetup => {
              return (
                <Col span={8}>
                  <Link to={`/meetup/${meetup.id}/`}>
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={meetup.img} />}
                  >
                    <Card.Meta
                      title={meetup.title}
                      description="www.instagram.com"
                    />
                  </Card>
                  </Link>
                </Col>
              ) 
            })
          }
        </Row>
      </div>
    );
  }
}

export default Home;
