# Pose Matcher
Create your own pose matching application with a custom dataset!

The Pose Matcher application allows you to quickly get started with pose estimation deep learning technology- running in your browser. You can quickly build a custom dataset of photographs which are then compared against images taken using your webcam. The application will return the closest match, based upon the similarity of the poses in each picture.

Before you begin uploading your own custom photos you will need a database to store them. The application is currently setup to use a Cloudant database sitting on IBM Cloud. This README will guide you through setting up a new database for free, and connecting it to Pose Matcher.

## 1. Creating a Cloudant Instance
Visit the [IBM Cloud](https://cloud.ibm.com), and login or sign up. The account you create will be able to access a selection of free services- dubbed "Lite plans".

Next, click the Catalog tab and search "Cloudant". 

Create a "Lite" Cloudant instance and select "Get Started".

## 2. Getting the Credentials
You will now need to authenticate the Pose Matcher application with your newly created Cloudant database. To do so we will use the "Service Credentials" provided by Cloudant. The credentials act as Cloudant's passport- allowing it to verify itself as belonging to your account, and laying out how other services can communicate to it.

You will access your credentials from the "Service Credentials" tab of the Cloudant instance you are now the proud owner of. 

Screenshot

Now, select and copy your credentials- pasting them into a notepad or clipboard if you would like.

Screenshot

## 3. Pulling It All Together
