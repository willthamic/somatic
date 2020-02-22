import React from "react";
import { Text, Link, Flex, Box, Image, Heading } from "rebass";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
const StartButton = styled(Button)`
  color: #ffffff;
  background: #00c0ff;
  outline-color: black;
  font-family: IBM Plex Sans;
`;

const SignUpButton = styled(Button)`
  color: #000;
  // background: #0097e2;
  outline-color: black;
  width:100%
  font-family: IBM Plex Sans;
  font-weight: 600
`;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentDidMount() {
    window.analytics.page("Form");
  }

  onPressStart = () => {
    window.analytics.track("Pressed start on landing");
    this.props.history.push(
      `/demo/knees?age=${this.state.age}&feet=${this.state.height1}&inches=${this.state.height2}&sex=${this.state.sex}&weight=${this.state.weight}`
    );
  };

  onPressSignUp = () => {
    window.analytics.track("Pressed sign up on landing");
    // this.props.history.push("/demo/knees");
  };

  handleFormChange = e => {
    const { id, value } = e.target;
    this.setState({ [e.target.id]: value });
  };

  render() {
    return (
      <div>
        <Container>
          <br height={10}></br>
          <Row>
            <Col sm={10}>
              <Image
                src={require("../images/Logo_Black.png")}
                width="100px"
                height="auto"
              />
            </Col>
            <Col sm={2}>
              <SignUpButton
                mr={2}
                variant="outline"
                onClick={() => this.onPressSignUp()}
              >
                Sign Up
              </SignUpButton>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Heading
                marginTop={10}
                marginBottom={20}
                fontSize={6}
                fontWeight="bold"
                color="#FFF"
                fontFamily="IBM Plex Sans"
              >
                Test
              </Heading>
              <form>
                <p>What is your age?</p>
                <input
                  id="age"
                  placeholder="Age"
                  type="text"
                  name="name"
                  onChange={this.handleFormChange}
                />
                <p>What is your height (in feet and inches)?</p>
                <input
                  id="height1"
                  placeholder="ft"
                  type="text"
                  name="name"
                  onChange={this.handleFormChange}
                />
                <input
                  id="height2"
                  placeholder="in"
                  type="text"
                  name="name"
                  onChange={this.handleFormChange}
                />
                <p>What is your sex?</p>
                <select id="sex" name="sex" onChange={this.handleFormChange}>
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Nonbinary">Nonbinary</option>
                </select>
                <p>What is your weight (in pounds)?</p>
                <input
                  id="weight"
                  placeholder="lbs"
                  type="text"
                  name="name"
                  onChange={this.handleFormChange}
                />
                <br></br>
              </form>
              <Link marginTop={150} to="/">
                <StartButton
                  mr={2}
                  variant="outline"
                  onClick={() => this.onPressStart()}
                >
                  Demo
                </StartButton>
              </Link>
            </Col>
            {/* <Col sm={6}>
              <motion.div
                className="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ opacity: { duration: 0.2 } }}
              >
                <Image
                  src={require("../images/illustrationssomatic3x.jpg")}
                  width="auto"
                  height="auto"
                />
              </motion.div>
            </Col> */}
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Form);
