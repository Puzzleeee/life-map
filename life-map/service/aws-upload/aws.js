const AWS = require('aws-sdk');

const aws = () => {
  let modules = {};

  const s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_SECRET,
    Bucket: process.env.BUCKET_NAME
  })

  /**
   * Function to upload a file to AWS S3
   * @param {File} file File to be uploaded
   * @return {Object} awsResponse Object containing information regarding AWS's response
   * @return {boolean} awsResponse.success Whether the upload was successful
   * @return {string} awsResponse.message Message describing the response
   * @return {Error} awsResponse.err Error generated, null if none
   */
  modules.upload = async (file) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.name,
      Body: file.data
    };
    return s3bucket.upload(params).promise()
      .then(() => {
        console.log('File successfully uploaded');
        resolve ({
          success: true,
          message: 'File uploaded to aws successfully',
          err: null
        })
      }).catch((err) => {
        console.log(err);
        reject ({
          success: false,
          message: 'Failed to upload to aws',
          err: err
        })
      });
  };

  /**
   * Function to retrieve a file from AWS S3
   * @param {string} fileName Name of the file to retrieve
   * @return {Object} awsResponse Object containing information regarding AWS's response
   * @return {boolean} awsResponse.success Whether the retrival was successful
   * @return {string} awsResponse.message Message describing the response
   * @return {string} awsResponse.data The temporary signed url generated to access the file, null if request failed
   * @return {Error} awsResponse.err Error generated, null if none
   */
  modules.retrieve = async (fileName) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName
    }
    return new Promise((resolve, reject) => {
      try {
        const url = s3bucket.getSignedUrl('getObject', params);
        resolve({
          success: true,
          message: 'Image retrieved successfully',
          data: url,
          err: null
        })
      } catch (err) {
        console.log(err);
        reject({
          success: false,
          message: 'Image unable to be retrieved',
          data: null,
          err: err
        })
      }
    });
  }

  return Object.freeze(modules);
}

module.exports = aws();