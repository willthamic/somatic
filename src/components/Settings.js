import React from "react";
import { Text, Button, Flex, Image, Card } from "rebass";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

class Settings extends React.Component {
  render() {
    return (
      <div>
        <Flex>
          <Card width={[256, 256]} mx="auto" onClick={console.log("Test")}>
            <Image src={require("../images/back.png")} />
            <Text>Back</Text>
          </Card>
        </Flex>
      </div>
    );
  }
}

export default withRouter(Settings);
