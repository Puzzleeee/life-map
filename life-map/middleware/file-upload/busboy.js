const Busboy = require('busboy');

/**
 * Middleware function to parse files, include this middleware for any endpoint that 
 * requires file upload
 */
function busboy(req, res, next) {
  let bus = new Busboy({ headers: req.headers });
  console.log("reached busboy middleware");
  // On file upload completion
  bus.on('finish', () => {
    console.log('Upload completed!');

    // files will now be available in req.files
    const file = req.files;
    next();
  })
  req.pipe(bus);
}

module.exports = busboy;