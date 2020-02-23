// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");

var cors = require("cors");
app.use(cors());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post("/", function(req, res) {
  const { age, feet, inches, sex, weight } = req.body.params;
  const height = getHeightInches(feet, inches);
  if (checkAge(age)) {
    res.json({
      message: {
        exercises: [
          {
            name: "Hands to Toes",
            description:
              "Keeping everything below your hip stationery, bend your foward",
            orientation: "Point the right side of your body towards the camera",
            joints: [12, 6, 14],
            objectiveAngle: getAngle(age, 120),
            homeAngle: 165,
            count: getReps(age, height, weight, 5)
          },
          {
            name: "Right Knee to Chest",
            description:
              "Move your knees to your chest while you lie on your back",
            orientation: "Point the right side of your body towards the camera",
            joints: [14, 16, 12],
            objectiveAngle: getAngle(age, 120),
            homeAngle: 170,
            count: getReps(age, height, weight, 5)
          }
        ]
      }
    });
  }
});

function checkAge(age) {
  if (age >= 18) {
    return true;
  } else {
    return false;
  }
}

function getReps(age, height, weight, reps) {
  if (age >= 60) {
    reps = reps - 1;
  }
  if (height >= 77) {
    reps = reps - 1;
  }
  if (weight >= 250) {
    reps = reps - 1;
  }
  return reps;
}

function getAngle(age, angle) {
  if (age >= 60) {
    return Math.floor(angle * 1.1);
  } else {
    return angle;
  }
}

function getHeightInches(feet, inches) {
  return feet * 12 + inches;
}

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " + port);
