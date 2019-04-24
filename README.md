![alt text](https://github.com/FarrandTom/pose-matcher/blob/master/readme-images/lady_walking.png "Lady Walking Icon")

# Pose Matcher
Create your own pose matching application with a custom dataset!

The Pose Matcher application allows you to quickly get started with pose estimation deep learning technology- running in your browser. You can quickly build a custom dataset of photographs which are then compared against images taken using your webcam. The application will return the closest match, based upon the similarity of the poses in each picture.

Before you begin uploading your own custom photos you will need a database to store them. The application is currently setup to use a Cloudant database sitting on IBM Cloud. This README will guide you through setting up a new database for free, and connecting it to Pose Matcher.

## 1. Creating a Cloudant Instance
Visit the [IBM Cloud](https://cloud.ibm.com), and login or sign up. The account you create will be able to access a selection of free services- dubbed "Lite plans".

Next, click the Catalog tab and search "Cloudant". 

![alt text](https://github.com/FarrandTom/pose-matcher/blob/master/readme-images/cloudant_in_catalog.png "Cloudant in Catalog")

Create a "Lite" Cloudant instance. Your new Cloudant instance should look like the below. 

![alt text](https://github.com/FarrandTom/pose-matcher/blob/master/readme-images/cloudant_landing_page.png "Cloudant landing page")

NOTE: Cloudant provides a nice UI if you click on "Launch Cloudant Dashboard", from which you can manage your databases and documents. The [Cloudant docs](https://cloud.ibm.com/docs/services/Cloudant?topic=cloudant-overview#overview) provide more info!

## 2. Getting the Credentials
You will now need to authenticate the Pose Matcher application with your newly created Cloudant database. To do so we will use the "Service Credentials" provided by Cloudant. The credentials act as Cloudant's passport- allowing it to verify itself as belonging to your account, and laying out how other services can communicate to it.

You will access your credentials from the "Service Credentials" tab of the Cloudant instance you are now the proud owner of. 

![alt text](https://github.com/FarrandTom/pose-matcher/blob/master/readme-images/service_credentials_tab.png "Service credentials tab")

Now, select and copy your credentials- pasting them into a notepad or clipboard if you would like.

![alt text](https://github.com/FarrandTom/pose-matcher/blob/master/readme-images/service_credentials_landing_page.png "Service credentials landing page")

## 3. Pulling It All Together
You will now create a `vcap-local.json` file which will store your Cloudant credentials. To begin with, clone this repository. 

`git clone https://github.com/FarrandTom/pose-matcher`

Now create a new file titled `vcap-local.json` in the application's root directory (the same directory as this README). Finally, paste the credentials you copied earlier into this new empty file. Your VCAP file should now look like the following fake credentials:

```
{
    "services": {
      "cloudantNoSQLDB": [
        {
          "credentials": {
            "apikey": "on_ByVJKTtZBpp9dRDupcpk59xuCidO5xV5_cYfm550w",
            "host": "6281henw-ak10-9185-ae8e-bb3f187hk7025-bluemix.cloudantnosqldb.appdomain.cloud",
            "iam_apikey_description": "Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:cloudantnosqldb:eu-gb:a/ce8cf6a45e150b00765de8a3331a8f7a:06eecbd2-0b82-4740-9215-be8da079ec25::",
            "iam_apikey_name": "auto-generated-apikey-on_ByVJKTtZBpp9dRDupcpk59xuCidO5xV5_cYfm550w",
            "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
            "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/ce8cf6a45e150b00765de8a3331a8f7a::serviceid:ServiceId-2d9e80bf-72cb-4a77-937e-57757202d89e",
            "password": "2ea0da2171f5066a3ce0b117ccee4b3f8062d27799606c55abaf7b4f328204aa",
            "port": 443,
            "url": "https://6281henw-ak10-9185-ae8e-bb3f187hk7025-bluemix:2ea0da2171f5066a3ce0b117ccee4b3f8062d27799606c55abaf7b4f328204aa@06281henw-ak10-9185-ae8e-bb3f187hk7025-bluemix.cloudantnosqldb.appdomain.cloud",
            "username": "6281henw-ak10-9185-ae8e-bb3f187hk7025-bluemix"
          },
          "label": "cloudantNoSQLDB"
        }
      ]
    }
  }
```

You can now run `npm start` in the main directory of the application. (If you do not have node.js click [here](https://nodejs.org/en/) to install it). This will launch the Pose Matcher into your browser. You can then use the "Create your own dataset" function to upload .jpg and .png files to your Cloudant database. Capturing your pose will then return the closest match to the photo you have just taken with your webcam. 

![alt text](https://github.com/FarrandTom/pose-matcher/blob/master/readme-images/app_screenshot.png "App screenshot")

### I hope you enjoy tinkering, and please share anything you create!
