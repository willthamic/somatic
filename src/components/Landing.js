import React from "react";
import { Text, Link, Flex, Box, Image, Heading } from "rebass";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
const StartButton = styled(Button)`
  color: #ffffff;
  background: #00C0FF;
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

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    window.analytics.page("Landing");
  }

  onPressStart = () => {
    window.analytics.track("Pressed start on landing");
    this.props.history.push("/Form");
  };

  onPressSignUp = () => {
    window.analytics.track("Pressed sign up on landing");
    // this.props.history.push("/demo/knees");
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
            <Col sm={6}>
              <Heading marginTop={150} marginBottom={20} fontSize={6} fontWeight="bold" color="#1C243C" fontFamily="IBM Plex Sans">
                Physical therapy <br />
                anywhere, anytime.
              </Heading>
              <Link to="/" >
                <StartButton
                  mr={2}
                  variant="outline"
                  onClick={() => this.onPressStart()}
                >
                  Try It
                </StartButton>
              </Link>
            </Col>
            <Col sm={6}>
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Landing);
