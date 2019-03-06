let img;
let poseNet;
let dropzone;
let poses = [];

function setup() {
    dropzone = select('#dropzone');
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unhighlight);
    dropzone.drop(gotFile, unhighlight);
}

function gotFile(file) {
    // Set poses.length to 0 so that the draw loop is triggered.
    poses.length = 0;

    img = createImg(file.data, imageReady);
    img.hide();
}

function highlight() {
    dropzone.style('background-color', '#ccc');
}

function unhighlight() {
    dropzone.style('background-color', '#fff');
}

// when the image is ready, then load up the image dimensions and poseNet
function imageReady(){
    // set some options
    let options = {
        imageScaleFactor: 0.9,
        minConfidence: 0.1
    }

    let request;
    let buffer;
    let full_b64;

    let player_name;
    let score;

    // Getting the original dimensions of the image
    og_width = img.width;
    og_height = img.height;
    // Calculating the scaled and resized height and width of the image.
    // All images maintain a fixed width.
    aspect_ratio = og_height / og_width;
    
    width = 360;
    height = aspect_ratio * width;

    // The width and heigh ratios are used to scale the drawing of the keypoints
    // and skeletion. 
    width_ratio = width / og_width;
    height_ratio = height / og_height;

    // Canvas to draw image, and keypoints + skeletion onto.
    createCanvas(width, height);

    img.hide(); // hide the image in the browser
    frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case

    // assign poseNet
    poseNet = ml5.poseNet(modelReady, options);
    // This sets up an event that listens to 'pose' events
    poseNet.on('pose', function (results) {
        poses = results;
        
        request = $.ajax({
                type: "post",
                url: "/poses",
                data: JSON.stringify(results),
                dataType: 'JSON',
                contentType: 'application/json'
            });

        // Callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){
            // Log a message to the console
            buffer = response[1];
            player_name = response[0]['Name'];
            score = response[0]['Score'];

            full_b64 = "data:image/png;base64," + buffer;
            createP(player_name);
            createP(score);
            createImg(full_b64);

        });
    });
}

// when poseNet is ready, do the detection
function modelReady() {
     
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet.singlePose(img)
}

function draw() {
    if (poses.length > 0) {
        image(img, 0, 0, width, height);
        drawSkeleton(poses);
        drawKeypoints(poses);

        // Need to get a more efficient way of rendering new images
        // noLoop(); // stop looping when the poses are estimated
    }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x * width_ratio), round(keypoint.position.y * height_ratio), 8, 8);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x * width_ratio, partA.position.y * height_ratio, 
                 partB.position.x * width_ratio, partB.position.y * height_ratio);
        }
    }
}