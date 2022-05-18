const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Data is here", file)
    cb(null, 'uploads/userprofile')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})



exports.uploadFile = multer({
  storage: storage

});


exports.uploadFileToSSS = (file) => {

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: Date.now() + file.name,
    Body: file.data,
    ContentType: 'image/jpeg'
  };

  return s3.upload(params).promise();

}
exports.uploadSVGFileToSSS = (file) => {

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: Date.now() + file.name,
    Body: file.data,
    ContentType: 'image/svg+xml'
  };

  return s3.upload(params).promise();

}