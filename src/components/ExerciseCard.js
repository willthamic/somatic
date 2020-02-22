import React from "react";
import { Card, Heading, Text } from "rebass";

export default class ExcerciseCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card backgroundColor="#e4e4e4" marginBottom={10} padding={20}>
        <div>
          <Heading>{this.props.excersize.name}</Heading>
          <Text marginTop={10}>{this.props.excersize.description}</Text>
          <Text>{this.props.excersize.orientation}</Text>
          <Heading color="#16B2FF" fontWeight={600} marginTop={10}>{this.props.excersize.count} Remaining</Heading>
        </div>
      </Card>
    );
  }
}
