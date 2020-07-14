const { check, validationResult } = require('express-validator');

const newEntryRules = () => {
  return [
    check('location')
      .not()
      .exists()
      .withMessage('Must specify a valid location')
      .bail()
      .isJSON()
      .withMessage('Must specify a valid location'),
    check('title')
      .not()
      .isEmpty()
      .withMessage('Must specify a title'),
  ]
}

const newEntryValidator = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    next();
  } else {
    let message = '';
    errors.array().map(err => message += `${err.msg}, `)
    return res.status(422).json({
      success: false,
      message,
    })
  }
}

module.exports = Object.freeze({
  newEntryRules,
  newEntryValidator
})