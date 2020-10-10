var router = require('express').Router()

router.use('/calendar', require('./calendar'))
router.use('/schedule', require('./userschedule'))
router.use('/tags', require('./tags'))
router.use('/user', require('./user'))
router.use('/party', require('./party'))
router.use('/report', require('./report'))

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message
        return errors
      }, {}),
    })
  }
  return next(err)
})

module.exports = router
