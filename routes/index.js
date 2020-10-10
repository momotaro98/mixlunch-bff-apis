var router = require('express').Router()
var admin = require('../services/firebase-admin')

router.use('/v1', require('./api'))

router.post('/sessionLogin', (req, res) => {
  console.log('request to /sessionLogin')
  const idToken = req.body.idToken.toString()
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      sessionCookie => {
        console.log('login process succeeded')
        console.log('sessionCookie:', sessionCookie)
        // send session cookie to the front
        res.end(JSON.stringify(sessionCookie))
      },
      error => {
        console.log('login process failed')
        console.log(error)
        res.status(401).send('UNAUTHORIZED REQUEST!')
      },
    )
})

router.get('/healthcheck', (req, res) => {
  console.log('Got healthcheck request')
  res.status(200).send('Mixlunch BFF is alive.')
})

module.exports = router
