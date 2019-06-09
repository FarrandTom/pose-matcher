const express = require('express');
const l2norm = require( 'compute-l2norm' );
const bodyParser = require('body-parser');
const Cloudant = require('@cloudant/cloudant');
const cfenv = require('cfenv');

const app = express();
const server = app.listen(3000);
var similarity = require( 'compute-cosine-similarity' );

// Here we are configuring express to use body-parser as middle-ware.
// This is so we can handle POST requests.
app.use(bodyParser.urlencoded({ extended: false }));

// If you wish to upload larger images to the backend then adjust the limit below
// However, be aware that the Cloudant database will only accept a certain size of
// request.
app.use(bodyParser.json({limit: '10mb'}));

// Serving static files from the public directory
app.use(express.static('public'));

// Loading local VCAP parameters to allow connection to Cloudant database
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log('Loaded local VCAP credentials!');
} catch (e) {}

// Assigning the loaded VCAP parameters to variables.
const appEnvOpts = vcapLocal ? {vcap: vcapLocal} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

// Connect to our Cloudant instance using the local credentials
// To use env variables (i.e. if you deploy the app into the cloud) see below:
// https://github.com/IBM-Cloud/get-started-node/blob/master/server.js
cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

// Connect to the database we will use.

// cloudant_db = cloudant.db.use('pro_golfers')
 cloudant_db = cloudant.db.use('new_db')

// cosine distance to match poses based on different lines in the skeletons

function cosineDistanceMatching(poseVector1, poseVector2) {

// compare leftShoulder to leftHip line:
// leftShoulder: x = poseVector[10], y = poseVector[11]
// leftHip: x = poseVector[22], y = poseVector[23]

let vector1LeftBack = [poseVector1[10]-poseVector1[22], poseVector1[11]-poseVector1[23]]
let vector2LeftBack = [poseVector2[10]-poseVector2[22], poseVector2[11]-poseVector2[23]]
let leftShoulder_leftHip = similarity(vector1LeftBack, vector2LeftBack);
//let LeftBack = similarity(vector1LeftBack, vector2LeftBack);

// compare rightShoulder to rightHip line:
// rightShoulder: x = poseVector[12], y = poseVector[13]
// rightHip: x = poseVector[24], y = poseVector[25]

let vector1RightBack = [poseVector1[12]-poseVector1[24], poseVector1[13]-poseVector1[25]]
let vector2RightBack = [poseVector2[12]-poseVector2[24], poseVector2[13]-poseVector2[25]]
let rightShoulder_rightHip = similarity(vector1RightBack, vector2RightBack);

// compare rightShoulder to leftShoulder line:
// rightShoulder: x = poseVector[12], y = poseVector[13]
// leftShoulder: x = poseVector[10], y = poseVector[11]

let vector1Torso = [poseVector1[12]-poseVector1[10], poseVector1[13]-poseVector1[11]]
let vector2Torso = [poseVector2[12]-poseVector2[10], poseVector2[13]-poseVector2[11]]
let rightShoulder_leftShoulder = similarity(vector1Torso, vector2Torso);

// compare rightHip to leftHip line:
// rightHip: x = poseVector[24], y = poseVector[25]
// leftHip: x = poseVector[22], y = poseVector[23]

let vector1Hips = [poseVector1[24]-poseVector1[22], poseVector1[25]-poseVector1[23]]
let vector2Hips = [poseVector2[24]-poseVector2[22], poseVector2[25]-poseVector2[23]]
let rightHip_leftHip = similarity(vector1Hips, vector2Hips);

let Back = 0.5*rightHip_leftHip + 0.5*rightShoulder_leftShoulder + rightShoulder_rightHip + leftShoulder_leftHip;

// compare rightHip to rightKnee line:
// rightHip: x = poseVector[24], y = poseVector[25]
// rightKnee: x = poseVector[28], y = poseVector[29]

let vector1RightLeg = [poseVector1[24]-poseVector1[28], poseVector1[25]-poseVector1[29]]
let vector2RightLeg = [poseVector2[24]-poseVector2[28], poseVector2[25]-poseVector2[29]]
let rightHip_rightKnee = similarity(vector1RightLeg, vector2RightLeg); //could multiply by keypoint confidence
// values in here

// compare leftHip to leftKnee line:
// leftHip: x = poseVector[22], y = poseVector[23]
// leftKnee: x = poseVector[26], y = poseVector[27]

let vector1LeftLeg = [poseVector1[22]-poseVector1[26], poseVector1[23]-poseVector1[27]]
let vector2LeftLeg = [poseVector2[22]-poseVector2[26], poseVector2[23]-poseVector2[27]]
let leftHip_leftKnee = similarity(vector1LeftLeg, vector2LeftLeg);

// compare leftAnkle to leftKnee line:
// leftAnkle: x = poseVector[30], y = poseVector[31]
// leftKnee: x = poseVector[26], y = poseVector[27]

let vector1LeftAnkle = [poseVector1[30]-poseVector1[26], poseVector1[31]-poseVector1[27]]
let vector2LeftAnkle = [poseVector2[30]-poseVector2[26], poseVector2[31]-poseVector2[27]]
let leftAnkle_leftKnee = similarity(vector1LeftAnkle, vector2LeftAnkle);

// compare rightAnkle to rightKnee line:
// rightAnkle: x = poseVector[32], y = poseVector[33]
// rightKnee: x = poseVector[28], y = poseVector[29]

let vector1RightAnkle = [poseVector1[32]-poseVector1[28], poseVector1[33]-poseVector1[29]]
let vector2RightAnkle = [poseVector2[32]-poseVector2[28], poseVector2[33]-poseVector2[29]]
let rightAnkle_rightKnee = similarity(vector1RightAnkle, vector2RightAnkle);

let Legs = rightAnkle_rightKnee + rightHip_rightKnee + leftAnkle_leftKnee + leftHip_leftKnee

// compare leftShoulder to leftElbow line:
// leftShoulder: x = poseVector[10], y = poseVector[11]
// leftElbow: x = poseVector[14], y = poseVector[15]

let vector1LeftArm = [poseVector1[10]-poseVector1[14], poseVector1[11]-poseVector1[15]]
let vector2LeftArm = [poseVector2[10]-poseVector2[14], poseVector2[11]-poseVector2[15]]
let leftShoulder_leftElbow = similarity(vector1LeftArm, vector2LeftArm);


// compare rightShoulder to rightElbow line:
// rightShoulder: x = poseVector[12], y = poseVector[13]
// rightElbow: x = poseVector[16], y = poseVector[17]

let vector1RightArm = [poseVector1[12]-poseVector1[16], poseVector1[13]-poseVector1[17]]
let vector2RightArm = [poseVector2[12]-poseVector2[16], poseVector2[13]-poseVector2[17]]
let rightShoulder_rightElbow = similarity(vector1RightArm, vector2RightArm);

// compare rightWrist to rightElbow line:
// rightWrist: x = poseVector[20], y = poseVector[21]
// rightElbow: x = poseVector[16], y = poseVector[17]

let vector1RightForearm = [poseVector1[20]-poseVector1[16], poseVector1[21]-poseVector1[17]]
let vector2RightForearm = [poseVector2[20]-poseVector2[16], poseVector2[21]-poseVector2[17]]
let rightWrist_rightElbow = similarity(vector1RightForearm, vector2RightForearm);

// compare leftShoulder to leftElbow line:
// leftWrist: x = poseVector[18], y = poseVector[19]
// leftElbow: x = poseVector[14], y = poseVector[15]

let vector1LeftForearm = [poseVector1[18]-poseVector1[14], poseVector1[19]-poseVector1[15]]
let vector2LeftForearm = [poseVector2[18]-poseVector2[14], poseVector2[19]-poseVector2[15]]
let leftWrist_leftElbow = similarity(vector1LeftForearm, vector2LeftForearm);

Arms = leftShoulder_leftElbow + leftWrist_leftElbow + rightShoulder_rightElbow + rightWrist_rightElbow
let Body = Back + Legs + Arms
return [Body,
        rightShoulder_rightHip,
        rightShoulder_leftShoulder,
        rightHip_leftHip,
        rightHip_rightKnee,
        leftHip_leftKnee,
        leftAnkle_leftKnee,
        rightAnkle_rightKnee,
        leftShoulder_leftElbow,
        rightShoulder_rightElbow,
        rightWrist_rightElbow,
        leftWrist_leftElbow ];
}

// poseVector1 and poseVector2 are 52-float vectors composed of:
// Values 0-33: are x,y coordinates for 17 body parts in alphabetical order
// Values 34-50: are confidence values for each of the 17 body parts in alphabetical order
// Value 51: A sum of all the confidence values
// Again the lower the number, the closer the distance

// function weightedDistanceMatching(poseVector1, poseVector2) {
//   let vector1PoseXY = poseVector1.slice(0, 34);
//   let vector1Confidences = poseVector1.slice(34, 51);
//   let vector1ConfidenceSum = poseVector1.slice(51, 52);
//
//   let vector2PoseXY = poseVector2.slice(0, 34);
//
//   // First summation
//   let summation1 = 1 / vector1ConfidenceSum;
//
//   // Second summation
//   let summation2 = 0;
//   for (let i = 0; i < vector1PoseXY.length; i++) {
//     let tempConf = Math.floor(i / 2);
//     let tempSum = vector1Confidences[tempConf] * Math.abs(vector1PoseXY[i] - vector2PoseXY[i]);
//     summation2 = summation2 + tempSum;
//   }
//
//   return summation1 * summation2;
// }

// Iterating over the results_array and returning the name of the document
// which has the lowest score (a.k.a the closest match to the uploaded document)
// out of all the documents within the database.
 // function minValueFromResults(results_array, min_value) {
 //   for (var entry in results_array) {
 //     if (results_array[entry]['Score'] === min_value) {
 //       matching_name = results_array[entry];
 //       return matching_name;
 //     }
 //   }
 // }

function maxValueFromResults(results_array, max_value) {
  console.log(results_array)
  for (var entry in results_array) {
    if (results_array[entry]['Score'] === max_value) {
      matching_name = results_array[entry];
      return matching_name;
    }
  }
}

// Wrangling the uploaded documents array to be of the same form
// as the documents stored within the database.
function formatPoseArray(keypoints) {
  let point;
  let xy_array = [];
  let confidence_array = [];

  let norm;
  let norm_xy_array;

  for (point in keypoints) {
    x_position = keypoints[point]['position']['x'];
    y_position = keypoints[point]['position']['y'];

    xy_array.push(x_position);
    xy_array.push(y_position);

    single_confidence = keypoints[point]['score'];
    confidence_array.push(single_confidence);
  };

  // Normalising the xy keypoint array using the L2 (euclidean) norm
   norm = l2norm(xy_array);
   norm_xy_array = xy_array.map(function(element) {
     return element/norm;
   });
  //
   confidence_sum = confidence_array.reduce((a, b) => a + b, 0);
   confidence_array.push(confidence_sum);
  //
   new_array = norm_xy_array.concat(confidence_array);
//  new_array = xy_array; // delete this line and uncomment above to normalise
  // unneccesary for cosine distance
  return new_array;
}


app.post('/poses', (req, res) => {
  let new_array;

  let results_array = [];
  let scores_array = [];
  let doc_array = [];
  let matching_name = '';
  let successful_response;

  keypoints = req.body[0]['pose']['keypoints']
  new_array = formatPoseArray(keypoints);

  cloudant_db.list({ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        doc_array = doc['doc']['array'];

//        compared_score = weightedDistanceMatching(new_array, doc_array);
        compared_score = cosineDistanceMatching(new_array, doc_array);

        results_array.push({
          'id': doc['id'],
          'Score': compared_score[0],
          'Name': doc['doc']['name'],
          'rightShoulder_rightHip': compared_score[1],
          'rightShoulder_leftShoulder': compared_score[2],
          'rightHip_leftHip': compared_score[3],
          'rightHip_rightKnee': compared_score[4],
          'leftHip_leftKnee': compared_score[5],
          'leftAnkle_leftKnee': compared_score[6],
          'rightAnkle_rightKnee': compared_score[7],
          'leftShoulder_leftElbow': compared_score[8],
          'rightShoulder_rightElbow': compared_score[9],
          'rightWrist_rightElbow': compared_score[10],
          'leftWrist_leftElbow': compared_score[11]
          });

        scores_array.push(compared_score[0]);
        });
      }

    //  const min_value = Math.min.apply(Math, scores_array);
      const max_value = Math.max.apply(Math, scores_array);
    //  matching_name = minValueFromResults(results_array, min_value);
      matching_name = maxValueFromResults(results_array, max_value);
      console.log(matching_name);

      cloudant_db.attachment.get(matching_name['id'], matching_name['id'] + '_image', function(err, body) {
        if (!err) {
          successful_response = [matching_name, body.toString('base64')];
          res.send(successful_response);
        } else {
          console.log(err);
        }
      });
    });
});

// Uploading new pose arrays to the database.
function insertDocument(document, response) {
    cloudant_db.insert(document, function(err, body){
      if (err) {
        console.log('[cloudant_db.insert]', err.message);
        response.send({ message: 'Unable to insert the document array!'});
      } else {
        response.send({ message: 'Successfully added your document array!',
                        documentArray: document})
      }
    });
  }

// Uploading new image attachments to the database.
function addAttachment(id, bufferImgData, contentType, response) {
  cloudant_db.get(id).then((body) => {
    let revID = body['_rev'];
    cloudant_db.attachment.insert(id, id + '_image', bufferImgData, contentType,
    { rev: revID }, function(err, body) {
      if (!err) {
        console.log(body);
      } else {
        console.log(err);
      }
    });
  });
};

// Route for adding new documents to the database.
// Allowing you to populate your own database of custom images rapidly.
app.post('/upload_image', (req, res) => {
  const id = req.body['_id'];
  const name = req.body['name'];
  const pose = req.body['pose'];
  const keypoints = req.body['array'][0]['pose']['keypoints'];
  const imgData = req.body['imgData'];

  // Getting the content type so that it is correctly appended to the cloudant document
  const contentType = imgData.match(/image\/(png|gif|jpeg)/);

  // Must replace the meta data included at the start of the base64 string by the browser
  // This is not used by node, and therefore causes it to corrupt the image.
  const strippedImgData = imgData.replace(/^data:image\/(png|gif|jpeg);base64,/,'');

  // Getting the pose classification into the correct format.
  let newArray = formatPoseArray(keypoints);

  // Converting our base64 encoded data to buffer- the datatype Cloudant uses
  // as well as the other open source DB implementations (couchDB etc.)
  var bufferImgData = Buffer.from(strippedImgData, 'base64');

  document = {'_id': id,
              'name': name,
              'pose': pose,
              'array': newArray}

  console.log(id);
  cloudant_db.get(id, function(err, body) {
    if (!err) {
      // Update the revision ID of our document to reflect the one already
      // stored in Cloudant.
      document._rev = body['_rev'];

      // Using the updated revision ID we can add the new document.
      insertDocument(document, res);
      addAttachment(id, bufferImgData, contentType[0], res);
    } else {
      // The document does not exist, therefore insert it.
      insertDocument(document, res);
      addAttachment(id, bufferImgData, contentType[0], res);
    }
  })
});
