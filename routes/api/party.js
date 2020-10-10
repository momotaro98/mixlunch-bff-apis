const router = require('express').Router()
const auth = require('../auth')
const partyService = require('../../services/party')
const api_helper = require('../../helpers/api-helper')

const PartyApiBaseUrl = process.env.PARTY_BASEURL

function requestWithAsync(options) {
  return api_helper.requestToServiceApi(options)
}

function cramContentsIntoResponseForClient(
  resToSendToClient,
  resFromServiceApi,
) {
  const resToClient = resFromApi => {
    return resFromApi
  }
  return api_helper.cramContentsIntoResponseForClient(
    resToSendToClient,
    resFromServiceApi,
    resToClient,
  )
}

router.post('/review/member', auth.required, (req, res, next) => {
  // Parse the request from client
  const token = req.headers.authorization
  const body = req.body
  const options = partyService.assembleReviewMemberRequestOptions(
    PartyApiBaseUrl,
    token,
    body,
  )
  console.log('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

module.exports = router
