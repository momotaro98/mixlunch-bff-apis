const admin = require('../services/firebase-admin')

const authUser = (req, res, next) => {
  console.log('Verification process starts')
  const sessionCookie = req.headers.authorization || ''
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  if (sessionCookie === '') {
    console.log('There is no sessionCookies')
    res.status(403).send('no sessionCookies')
  } else {
    console.log('There is a sessionCookie.')
    console.log('sessionCookie:', sessionCookie)
  }
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(decodedClaims => {
      console.log('Verification succeeded')

      // Pass uid to bottom routes by assigning them to the request
      console.log('decodedClaims.uid is below')
      req.uid = decodedClaims.uid
      console.log(req.uid)

      next()
    })
    .catch(error => {
      console.log('Verification failed')
      console.log(error)
      res.status(403).send('Not verified')
    })
}

const auth = {
  required: authUser,
}

module.exports = auth
