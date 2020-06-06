const AWS = require('aws-sdk');

const aws = () => {
  let modules = {};

  const s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_SECRET,
    Bucket: process.env.BUCKET_NAME
  })

  modules.upload = async (file) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.name,
      Body: file.data
    };
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          reject ({
            success: false,
            message: 'Failed to upload to aws',
            err: err
          })
        } else {
          console.log('File successfully uploaded');
          resolve ({
            success: true,
            message: 'File uploaded to aws successfully',
            err: null
          })
        }
      });
    })
  };

  return Object.freeze(modules);
}

module.exports = aws();