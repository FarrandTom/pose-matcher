var express = require('express');
var l2norm = require( 'compute-l2norm' );
var bodyParser = require('body-parser');
var Cloudant = require('@cloudant/cloudant');

var app = express();
var server = app.listen(3000);

// Here we are configuring express to use body-parser as middle-ware.
// This is so we can handle POST requests. 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serving static files from the public directory
app.use(express.static('public'));

// Loading local VCAP parameters to allow connection to Cloudant database
var vcapLocal;



justin_rose_setup = [ 0.17970555707549749,
  0.09236892609229846,
  0.19049598104784266,
  0.0859152670886969,
  0.18144193426798524,
  0.08386886339411645,
  0.16432168459447394,
  0.06289070948871929,
  0.16880480191818856,
  0.06895996584044545,
  0.14077852641182892,
  0.09600220110292149,
  0.128904290872096,
  0.10342838392798122,
  0.12204716634023208,
  0.16777081340533315,
  0.12000816959904793,
  0.17064071417678334,
  0.13255993648104336,
  0.2228372227880349,
  0.13289191600526182,
  0.22383787261607413,
  0.04420532616356833,
  0.18518281835265474,
  0.05947606779363721,
  0.1879432879369498,
  0.07949649755336884,
  0.2820087428268034,
  0.08685021588348672,
  0.2791258718156044,
  0.08097705830905186,
  0.3652642949162878,
  0.07365678990129503,
  0.37633378116507293,
  0.9520760774612427,
  0.13378602266311646,
  0.9283162355422974,
  0.055756017565727234,
  0.9794830083847046,
  0.5682874917984009,
  0.8706150650978088,
  0.45390671491622925,
  0.9562039375305176,
  0.7583954930305481,
  0.6249509453773499,
  0.6855019927024841,
  0.8791465163230896,
  0.3744296133518219,
  0.708235502243042,
  0.5363864302635193,
  0.7279551029205322,
  11.193432167172432 ]

// poseVector1 and poseVector2 are 52-float vectors composed of:
// Values 0-33: are x,y coordinates for 17 body parts in alphabetical order
// Values 34-51: are confidence values for each of the 17 body parts in alphabetical order
// Value 51: A sum of all the confidence values
// Again the lower the number, the closer the distance
function weightedDistanceMatching(poseVector1, poseVector2) {
  let vector1PoseXY = poseVector1.slice(0, 34);
  let vector1Confidences = poseVector1.slice(34, 51);
  let vector1ConfidenceSum = poseVector1.slice(51, 52);

  let vector2PoseXY = poseVector2.slice(0, 34);

  // First summation
  let summation1 = 1 / vector1ConfidenceSum;

  // Second summation
  let summation2 = 0;
  for (let i = 0; i < vector1PoseXY.length; i++) {
    let tempConf = Math.floor(i / 2);
    let tempSum = vector1Confidences[tempConf] * Math.abs(vector1PoseXY[i] - vector2PoseXY[i]);
    summation2 = summation2 + tempSum;
  }

  return summation1 * summation2;
}


app.post('/poses', (req, res) => {
  keypoints = req.body[0]['pose']['keypoints']

  var point;
  var xy_array = [];
  var confidence_array = [];

  for (point in keypoints) {
    x_position = keypoints[point]['position']['x'];
    y_position = keypoints[point]['position']['y'];

    xy_array.push(x_position);
    xy_array.push(y_position);

    single_confidence = keypoints[point]['score'];
    confidence_array.push(single_confidence);
  };

  // Normalising the xy keypoint array using the L2 (euclidean) norm
  var norm = l2norm(xy_array);
  var norm_xy_array = xy_array.map(function(element) {
    return element/norm;
  });

  confidence_sum = confidence_array.reduce((a, b) => a + b, 0);
  confidence_array.push(confidence_sum);

  var final_array = norm_xy_array.concat(confidence_array);

  var result = weightedDistanceMatching(final_array, justin_rose_setup);
  console.log(result);

  res.send('Got a POST request')
})