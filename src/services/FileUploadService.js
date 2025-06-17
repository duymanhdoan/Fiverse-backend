const fs = require('fs');
const path = require("path");
const extract = require('extract-zip')
require('dotenv').config()
const Utils = require("../utils");

var AWS = require('aws-sdk');
        // Set the region
AWS.config.update({region: 'ap-southeast-1'});

AWS.config.update({accessKeyId: process.env.BUCKET_ACCESS_KEY, secretAccessKey: process.env.BUCKET_SECRET_KEY});

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2016-11-28'});

const uploadZip = async (req, res) => {
    if (req.files) {
        // Configure the file stream and obtain the upload parameters
        let file = req.files.file
        let filename = file.name
        const folderName = filename.substring(0, filename.lastIndexOf("."))
        const dirPath = `./src/tmp/${filename}`
        const folderPath = `./src/tmp/${folderName}`
        file.mv(dirPath, err => {
          console.log("err: ", err)
          const folder = './src/tmp';
          const absolutePath = path.resolve(folder)

          try {
             extract(dirPath, { dir: absolutePath }).then(() => {
              console.log('Extraction complete')

              walkSync(folderPath, async (filePath) => {
                let bucketPath = `${req.body.fileType}/${folderName}/${filePath.substring(folderPath.length - 1)}`.split("\\").join("/");
                console.log("bucketPath", bucketPath)
                let params = {
                  Bucket: process.env.BUCKET_NAME,
                  Key: bucketPath,
                  Body: fs.readFileSync(filePath)
                };
                try {
                  await s3.putObject(params).promise();
                  console.log(`Successfully uploaded ${bucketPath} to s3 bucket`);
                } catch (error) {
                  console.error(`error in uploading ${bucketPath} to s3 bucket`);
                  throw new Error(`error in uploading ${bucketPath} to s3 bucket`);
                }
              });

             }).then(() => {
              fs.unlink(dirPath, (err) => {
              if (err) throw err;
              console.log(`successfully ${dirPath}`);
            })
              fs.rmdir(folderPath, { recursive: true, force: true }, (err) => {
              if (err) throw err;
              console.log(`successfully ${folderPath}`);
            })
          })

          } catch (err) {
           console.log("error: ", err)
          }

        })
        res.send({url: `https://fiverse-bucket-test.s3.ap-southeast-1.amazonaws.com/scorm/${folderName}/res/index.html`})
    }
    else
        res.send("no file to upload")
}
module.exports.uploadZip = uploadZip;


const uploadFile = async (req, res) => {
  let file = req.files.file
  let filename = file.name
  let uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: '',
    Body: ''
  };
    uploadParams.Body = file.data;
    uploadParams.Key = `${req.body.fileType}/${filename}`;
    // call S3 to retrieve upload file to specified bucket
    s3.putObject(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    res.send({url: `https://fiverse-bucket-test.s3.ap-southeast-1.amazonaws.com/video/${filename}`})

  });
}
module.exports.uploadFile = uploadFile;

const walkSync = (currentDirPath, callback) => {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
};

const uploadFileCourse = async (req) => {
  // req body
  let file = req.files.file
  let courseFolder = req.body["course_name"] ? Utils.slugName(req.body["course_name"]) : "";
  let sectionFolder = req.body["section_name"] ? Utils.slugName(req.body["section_name"]) : "";
  let contentFolder = req.body["content_name"] ? Utils.slugName(req.body["content_name"]) : "";
  let reqFileName = req.body["file_name"] ? Utils.slugName(req.body["file_name"]) + "-" : "";

  let fileNameSplit = file.name.split(".");
  let filename = reqFileName + Date.now() + "." + fileNameSplit[fileNameSplit.length - 1];
  let uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: '',
    Body: ''
  };
  uploadParams.Body = file.data;
  let path = `uploads/${courseFolder}`;
  if (sectionFolder !== "") {
    path += `/${sectionFolder}`;
  }
  if (contentFolder !== "") {
    path += `/${contentFolder}`;
  }
  path += `/${filename}`;
  uploadParams.Key = path;
  // call S3 to retrieve upload file to specified bucket
  s3.putObject(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
  });
  return path;
}

module.exports.uploadFileCourse = uploadFileCourse;
