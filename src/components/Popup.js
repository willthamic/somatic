import React from "react";
import { Card, Heading, Text } from "rebass";

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card backgroundColor="#7a7a7a" margin={10} padding={10}>
        {this.props.excersize.count > 0 && (
          <div>
            <Heading>{this.props.excersize.name}</Heading>
            <Text>{this.props.excersize.description}</Text>
            <Text>{this.props.excersize.orientation}</Text>
            <Heading>{this.props.excersize.count} Remaining</Heading>
          </div>
        )}
      </Card>
    );
  }
}
