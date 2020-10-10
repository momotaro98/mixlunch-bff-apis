const fs = require('fs')
const tmp = require('tmp')
const admin = require('../services/firebase-admin')

const requestToStorageService = options => {
  const cloudFilePath = options.cloudFilePath
  const body = options.body

  var promise

  tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err

    try {
      const bucket = admin.storage().bucket()

      fs.writeFile(path, JSON.stringify(body), err => {
        if (err) throw err
      })

      promise = bucket.upload(path, {
        destination: cloudFilePath,
        metadata: { contentType: 'application/json' },
      })
    } finally {
      cleanupCallback()
    }
  })

  return promise
}

const fb_helper = {
  requestToStorageService: requestToStorageService,
}

module.exports = fb_helper
