const Cloudant = require('@cloudant/cloudant');
const cfenv = require('cfenv');
const fs = require('fs');
const mime = require('mime');

// Loading local VCAP parameters to allow connection to Cloudant database
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log('Loaded local VCAP credentials!');
} catch (e) {}

const appEnvOpts = vcapLocal ? {vcap: vcapLocal} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

// Connect to our Cloudant instance using the local credentials
// To use env variables (i.e. app is deployed into the cloud) see below:
// https://github.com/IBM-Cloud/get-started-node/blob/master/server.js
cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

// Connect to the database we will use.
pro_golfers_db = cloudant.db.use('pro_golfers')

// Setting constants
const image_name = 'sung_hyun_park_setup'
const filepath = 'public/data/' + image_name + '.png';


// get the mimetype
const filemime = mime.getType(filepath);

fs.readFile(filepath, function(err, data) {
    if (!err) {
      pro_golfers_db.attachment.insert(image_name, image_name + '_image', data, filemime,
        { rev: "1-303a13fb154d81b22086f5afd80c592b" }, function(err, body) {
          if (!err) {
            console.log(body);
          } else {
            console.log(err);
          }
      });
    } else {
        console.log(err);
    }
  });
