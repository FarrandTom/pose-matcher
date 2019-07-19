
// Start of instance mode

// create new p5 object containing all variables and functions
// associated with sketch
// instead of storing global y, x, setup and draw
//in a global namespace we're gona put everything in
// myp5 object. sketch is a variable that will be our
// template for creating p5 sketch
// include all variables, setup and draw functions
 var sketch = function(p){
 p.video;
 p.poseNet;
 p.skeletons = [];
 p.poses = [];
 p.filePicker;
 p.uploadImg;

 p.setup = function() {
 p.createCanvas(600, 450).parent('canvasContainer');

 p.video = p.createCapture(VIDEO); // might be an issue here so potentially p.VIDEO
 p.video.size(p.width, p.height);

// Create a new poseNet method with a single detection
 p.poseNet = p.ml5.poseNet(p.video);
// This sets up an event that fills the global variable "poses"
// with an array every time new poses are detected

 p.snapshot = p.select('#addPhoto');
 p.snapshot.mousePressed(function() {
      p.submitRequest(p.poses);
  });

 p.poseNet.on('pose', function (p.results) { // again may have issues here
  p.poses = p.results;
})
// Hide the video element, and just show the canvas
 p.video.hide();

// For when a new picture is uploaded to the website.
// This watches the filePicker element, if there is a change it populates
// the form with the poses array.
 p.filePicker = p.select('#filePicker');
 p.filePicker.changed(classifyUpload); // may have issues here too
 }
 p.draw = function() {
p.image(p.video, 0, 0, p.width, p.height);

// We can call both functions to draw all keypoints and the skeletons
p.drawKeypoints();
p.drawSkeleton();
}
}

 var myp5_1 = new p5(sketch);

function classifyUpload() {
    myp5_1.files;
    myp5_1.files = myp5_1.filePicker.elt.files;

    if (myp5_1.files.length) {
      myp5_1.reader = new FileReader();

      myp5_1.reader.onload = function(e) {
        uploadImg = createImg(e.target.result, uploadImgReady);
        uploadImg.hide();
      };

      myp5_1.reader.readAsDataURL(myp5_1.files[0]);
    }
};

// when the image is ready, then load up poseNet
function uploadImgReady(){
  // assign poseNet
  uploadPoseNet = myp5_1.ml5.poseNet(uploadModelReady);
  // This sets up an event that listens to 'pose' events
  uploadPoseNet.on('pose', function (myp5_1.results) {
      const formName = select('#formName').elt.value;
      const poseName = select('#poseName').elt.value;
      const imgData = myp5_1.uploadImg.elt.src;

      const formatNames = formName.toLowerCase().replace(' ', '_');
      const formatPoseName = poseName.toLowerCase().replace(' ', '_');
      const databaseID = formatNames + '_' + formatPoseName;

      myp5_1.uploadPoses = myp5_1.results;

      fullData = {'_id': databaseID,
                  'name': formName,
                  'pose': formatPoseName,
                  'array': uploadPoses,  // Note: the uploadPoses still need to be processed to the 52-float vector form.
                  'imgData': imgData}

      request = $.ajax({
                    type: "post",
                    url: "/upload_image",
                    data: JSON.stringify(fullData),
                    dataType: 'JSON',
                    contentType: 'application/json'
                });

      // Callback handler that will be called on success
      request.done(function (response){
        const name = response['documentArray']['name'];
        const pose = response['documentArray']['pose'];

        document.getElementById("documentAddedFeedback").innerHTML = name +"'s " + pose + " added to Cloudant!";
        document.getElementById("uploadForm").reset();
      });
  });
}

// when poseNet is ready, do the detection
function uploadModelReady() {
  uploadPoseNet.singlePose(myp5_1.uploadImg)
}

// Submits an Ajax request to the backend server.
function submitRequest(myp5_1.results) {
    request = $.ajax({
        type: "post",
        url: "/poses",
        data: JSON.stringify(myp5_1.results),
        dataType: 'JSON',
        contentType: 'application/json'
    });

// Callback handler that will be called on success
request.done(function (response){
    buffer = response[1];

    player_name = response[0]['Name'];
    score = response[0]['Score'];

    full_b64 = "data:image/png;base64," + buffer;

    document.getElementById("result_image").src= full_b64;
  //  document.getElementById("result_image").src= createCanvas (100,100);
  //background(full_b64);
    document.getElementById("Name").innerHTML = "Name: " + player_name;
    document.getElementById("Score").innerHTML = "Score: " + round(100-((score*10)*100)) + "%";
    });
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(224, 26, 58);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(224, 26, 58);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
