/*

0: {score: 0.24019157886505127, part: "nose", position: {…}}
1: {score: 0.29839253425598145, part: "leftEye", position: {…}}
2: {score: 0.3735954165458679, part: "rightEye", position: {…}}
3: {score: 0.41358911991119385, part: "leftEar", position: {…}}
4: {score: 0.41246265172958374, part: "rightEar", position: {…}}
5: {score: 0.27946481108665466, part: "leftShoulder", position: {…}}
6: {score: 0.7600558996200562, part: "rightShoulder", position: {…}}
7: {score: 0.10120641440153122, part: "leftElbow", position: {…}}
8: {score: 0.38479161262512207, part: "rightElbow", position: {…}}
9: {score: 0.02430165559053421, part: "leftWrist", position: {…}}
10: {score: 0.04353919252753258, part: "rightWrist", position: {…}}
11: {score: 0.4085552990436554, part: "leftHip", position: {…}}
12: {score: 0.4109010100364685, part: "rightHip", position: {…}}
13: {score: 0.015650879591703415, part: "leftKnee", position: {…}}
14: {score: 0.017016731202602386, part: "rightKnee", position: {…}}
15: {score: 0.011630046181380749, part: "leftAnkle", position: {…}}
16: {score: 0.01686052791774273, part: "rightAnkle", position: {…}}

*/
import { drawKeyPoints, drawSkeleton } from "./utils";
import React, { Component } from "react";
import * as posenet from "@tensorflow-models/posenet";
import { Flex, Box } from "rebass";
import { Container, Image, Spinner, Alert, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import ExcerciseCard from "./ExerciseCard";
import { isMobile } from "react-device-detect";
import axios from "axios";
import queryString from "query-string";
class Demo extends Component {
  static defaultProps = {
    videoWidth: isMobile ? window.innerWidth : 900,
    videoHeight: isMobile ? 300 : 700,
    flipHorizontal: true,
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    minPoseConfidence: 0.3,
    minPartConfidence: 0.5,
    outputStride: 16,
    imageScaleFactor: isMobile ? 0.5 : 0.75,
    skeletonColor: "#16B2FF",
    skeletonLineWidth: 6,
    loadingText: "Loading...please be patient..."
  };

  constructor(props) {
    super(props, Demo.defaultProps);
    this.state = {
      loading: true,
      goingDown: true,
      bendRemaining: 5,
      bendAngle: 30,
      belowThreshold: false,
      exercises: []
    };
  }

  getCanvas = elem => {
    this.canvas = elem;
  };

  getVideo = elem => {
    this.video = elem;
  };

  async componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    console.log(params);
    axios.post(`http://localhost:8080/api/`, { params }).then(res => {
      const exercises = res.data.message.exercises;
      console.log(exercises);
      this.setState({ exercises: exercises });
    });

    try {
      await this.setupCamera();
    } catch (error) {
      throw new Error(
        "This browser does not support video capture, or this device does not have a camera"
      );
    }

    try {
      this.posenet = await posenet.load({
        architecture: isMobile ? "MobileNetV1" : "ResNet50",
        outputStride: isMobile ? 16 : 32
      });
    } catch (error) {
      throw new Error("PoseNet failed to load");
    }
    this.detectPose();
    this.setState({ loading: false });
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
    }
    const { videoWidth, videoHeight } = this.props;
    const video = this.video;
    console.log(video.width);
    video.width = videoWidth;
    video.height = videoHeight;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: video.width,
        height: video.height
      }
    });
    console.log("a");
    video.srcObject = stream;
    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        resolve(video);
        console.log("b");
      };
    });
  }

  detectPose() {
    const { videoWidth, videoHeight } = this.props;
    const canvas = this.canvas;
    const canvasContext = canvas.getContext("2d");

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    this.poseDetectionFrame(canvasContext);
  }

  poseDetectionFrame(canvasContext) {
    const {
      imageScaleFactor,
      flipHorizontal,
      outputStride,
      minPoseConfidence,
      minPartConfidence,
      videoWidth,
      videoHeight,
      showVideo,
      showPoints,
      showSkeleton,
      skeletonColor,
      skeletonLineWidth
    } = this.props;

    const posenetModel = this.posenet;
    const video = this.video;

    const findPoseDetectionFrame = async () => {
      let poses = [];

      const pose = await posenetModel.estimateSinglePose(video, {
        imageScaleFactor,
        flipHorizontal,
        outputStride
      });
      poses.push(pose);

      canvasContext.clearRect(0, 0, videoWidth, videoHeight);

      if (showVideo) {
        canvasContext.save();
        canvasContext.scale(-1, 1);
        canvasContext.translate(-videoWidth, 0);
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
        canvasContext.restore();
      }

      poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
          if (this.state.exercises.length > 0) {
            const angle = this.calculateAngles(keypoints, canvasContext);
            this.checkAngle(angle);
            this.checkForBody(keypoints);
          }
          if (showPoints) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              canvasContext
            );
          }
          if (showSkeleton) {
            drawSkeleton(
              keypoints,
              minPartConfidence,
              skeletonColor,
              skeletonLineWidth,
              canvasContext
            );
          }
        }
      });
      requestAnimationFrame(findPoseDetectionFrame);
    };
    findPoseDetectionFrame();
  }

  checkAngle(angle) {
    const exercise = this.state.exercises[0];
    if (angle < exercise.objectiveAngle && this.state.goingDown) {
      exercise.count = exercise.count - 1;
      if (exercise.count <= 0) {
        this.setState({
          exercises: [...this.state.exercises.splice(1)],
          goingDown: false
        });
      } else {
        this.setState({
          exercises: [exercise, ...this.state.exercises.splice(1)],
          goingDown: false
        });
      }
    } else if (angle >= exercise.homeAngle) {
      this.setState({ goingDown: true });
    }
  }

  calculateAngles(keypoints, canvas) {
    const rightHip = keypoints[this.state.exercises[0].joints[0]].position;
    const rightShoulder = keypoints[this.state.exercises[0].joints[1]].position;
    const rightKnee = keypoints[this.state.exercises[0].joints[2]].position;

    const angle = this.getAngle(rightShoulder, rightHip, rightKnee);
    canvas.beginPath();
    canvas.arc(rightHip.x, rightHip.y, 20, 0, 2 * Math.PI);
    canvas.stroke();
    canvas.font = "80px Georgia";
    canvas.fillText(angle + "º", rightHip.x + 10, rightHip.y + 10);
    return angle;
  }

  getMidAngle(a, b, c) {
    const numerator = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2);
    const denominator = 2 * a * b;
    return Math.acos(numerator / denominator) * (180 / Math.PI);
  }

  getDistance(x1, y1, x2, y2) {
    const a = Math.pow(x2 - x1, 2);
    const b = Math.pow(y2 - y1, 2);
    return Math.sqrt(a + b);
  }

  getAngle(lim1, lim2, lim3) {
    const a = this.getDistance(lim1.x, lim1.y, lim2.x, lim2.y);
    const b = this.getDistance(lim2.x, lim2.y, lim3.x, lim3.y);
    const c = this.getDistance(lim3.x, lim3.y, lim1.x, lim1.y);

    return Math.round(this.getMidAngle(a, b, c));
  }

  checkForBody(poses) {
    var count = 0;
    const threshold = 0.3;
    poses.map(function(currentelement, index, arrayobj) {
      if (index > 5 && currentelement.score >= threshold) count++;
      // Returns the new value instead of the item
    });
    if (count >= 5) {
      console.log("True");
      return true;
    }
    console.log("False");
    return false;
  }

  render() {
    // if (this.state.exercises.length <= 0) {
    //   window.location.href =
    //     "https://docs.google.com/forms/d/e/1FAIpQLSfp5TiR1C_J6lk2BfyCM8nHu6NVLK-2YE01ua0rxg9Qm-hPvw/viewform?usp=sf_link";
    // }
    return (
      <div>
        {/* <Alert variant="danger">Can't detect your whole body</Alert> */}
        <Container>
          <Row>
            <Image
              id="arrow"
              src={require("../images/Logo_Black.png")}
              width="100px"
              height="auto"
            />
          </Row>
          <Row>
            <Col xs={12} md={8}>
              {this.state.loading && (
                <div>
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                  Loading model...
                </div>
              )}
              <video id="videoNoShow" playsInline ref={this.getVideo} />
              <canvas className="webcam" ref={this.getCanvas} />
            </Col>
            <Col xs={12} md={4}>
              {this.state.exercises.map(d => (
                <ExcerciseCard key={d.name} excersize={d} />
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Demo);
