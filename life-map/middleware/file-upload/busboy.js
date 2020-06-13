const Busboy = require('busboy');

/**
 * Middleware function to parse files, include this middleware for any endpoint that 
 * requires file upload
 */
function busboy(req, res, next) {
  try {
    let bus = new Busboy({ headers: req.headers });
    // On file upload completion
    bus.on('finish', () => {
      // files will now be available in req.files
      const files = req.files;
      const fileArr = [];
      // req.files is initially a nested object, convert it into an array of File objects 
      // for easier handling
      for (const file in files) {
        if (files.hasOwnProperty(file)) {
          fileArr.push(files[file]);
        } 
      }
      req.files = fileArr;
      next();
    })
    req.pipe(bus);
  } catch(err) {
    console.log(err);
    console.log('No file uploaded');
    // if error, likely means no file detected, just skip
    next();
  }

}

module.exports = busboy;