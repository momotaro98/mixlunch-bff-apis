var admin = require('firebase-admin')

// Retrieve environment variables
const ServiceAccountFilePath = process.env.FIREBASE_SERVICEACCOUNT_FILEPATH
const DatabaseURL = process.env.FIREBASE_DATABASE_URL
const StorageURL = process.env.FIREBASE_STORAGE_URL

const serviceAccount = require(ServiceAccountFilePath)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DatabaseURL,
  storageBucket: StorageURL,
})

module.exports = admin
