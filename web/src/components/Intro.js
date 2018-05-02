import React, { Component } from 'react';
import { Row, Col, Radio, Form } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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

    return (
      <div>
        <Row className="intro">
          <p>Hey :)</p>
          <p>I wanna help meetup as a 
            <FormItem className="radio-selection">
              <RadioGroup>
                <RadioButton value="organizer">Organizer</RadioButton>
                <RadioButton value="staff">Staff</RadioButton>
              </RadioGroup>
            </FormItem>
          </p>
        </Row>
      </div>
    );
  }
}

export default Home;
