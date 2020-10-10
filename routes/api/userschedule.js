var router = require('express').Router()
var auth = require('../auth')
var userScheduleService = require('../../services/userschedule')
var api_helper = require('../../helpers/api-helper')

// Retrieve environment variables
const UserScheduleApiBaseUrl = process.env.USERSCHEDULE_BASEURL

function requestWithAsync(options) {
  return api_helper.requestToServiceApi(options)
}

function cramContentsIntoResponseForClient(
  resToSendToClient,
  resFromServiceApi,
) {
  return api_helper.cramContentsIntoResponseForClient(
    resToSendToClient,
    resFromServiceApi,
    userScheduleService.assembleResponseWithModelToClient,
  )
}

router.get('/:date', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const uid = req.uid
  const date = req.params.date
  const beginDT = date + 'T00:00:00Z'
  const endDT = date + 'T23:59:59.999Z'

  const options = userScheduleService.assembleGetRequestOptions(
    UserScheduleApiBaseUrl,
    uid,
    token,
    beginDT,
    endDT,
  )

  console.log('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

router.post('/', auth.required, (req, res, next) => {
  // Parse the request from client
  const uid = req.uid
  const token = req.headers.authorization
  const body = req.body

  const options = userScheduleService.assembleAddRequestOptions(
    UserScheduleApiBaseUrl,
    uid,
    token,
    body,
  )

  console.dir('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

router.post('/update', auth.required, (req, res, next) => {
  // Parse the request from client
  const uid = req.uid
  const token = req.headers.authorization
  const body = req.body

  const options = userScheduleService.assembleUpdateRequestOptions(
    UserScheduleApiBaseUrl,
    uid,
    token,
    body,
  )

  console.dir('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

router.post('/delete/:date', auth.required, (req, res, next) => {
  // Parse the request from client
  const uid = req.uid
  const token = req.headers.authorization
  const date = req.params.date + 'T00:00:00Z'

  const options = userScheduleService.assembleDeleteRequestOptions(
    UserScheduleApiBaseUrl,
    uid,
    token,
    date,
  )

  console.dir('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

module.exports = router
