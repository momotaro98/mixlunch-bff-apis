const router = require('express').Router()
const auth = require('../auth')
const userService = require('../../services/user')
const partyService = require('../../services/party')
const api_helper = require('../../helpers/api-helper')

const UserApiBaseUrl = process.env.USER_BASEURL
const PartyApiBaseUrl = process.env.PARTY_BASEURL

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
    userService.assembleResponseWithModelToClient,
  )
}

router.get('/', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const uid = req.uid
  const userOptions = userService.assembleGetRequestOptions(
    UserApiBaseUrl,
    uid,
    token,
  )
  const partyOptions = partyService.assembleGetIsReviewDoneRequestOptions(
    PartyApiBaseUrl,
    uid,
    token,
  )
  console.log('Request options to be sent to service api:')
  console.dir(userOptions)

  async function cram(
    resToSendToClient,
    resFromUserService,
    resFromPartyService,
  ) {
    // Check if the response is an error or not, and then handle it if error
    let isError

    // User
    let userResBody
    ;[
      userResBody,
      resToSendToClient,
      isError,
    ] = api_helper.handleErrorStatusFromServiceApi(
      resToSendToClient,
      resFromUserService,
    )
    if (isError) {
      console.log('Error: got error from service api. The response:')
      console.dir(resFromUserService)
      return resToSendToClient
    }

    // Party
    let partyResBody
    ;[
      partyResBody,
      resToSendToClient,
      isError,
    ] = api_helper.handleErrorStatusFromServiceApi(
      resToSendToClient,
      resFromPartyService,
    )
    if (isError) {
      console.log('Error: got error from service api. The response:')
      console.dir(resFromPartyService)
      return resToSendToClient
    }

    // Regular case response handling
    console.log('got regular response of user schedule service api:')
    console.dir(userResBody)
    console.log('got regular response of party service api:')
    console.dir(partyResBody)

    const resBodyToClient = await api_helper.assembleMultiResponsesWithModelToClient(
      [userResBody, partyResBody],
    )
    resToSendToClient.status(200).json(resBodyToClient)
    return resToSendToClient
  }

  api_helper
    .multiRequestsWithAsync([userOptions, partyOptions])
    .then(responsesFromServiceApis => {
      const resFromUserServiceApi = responsesFromServiceApis[0]
      const resFromPartyServiceApi = responsesFromServiceApis[1]
      res = cram(res, resFromUserServiceApi, resFromPartyServiceApi)
    })
})

router.get('/:user_id', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const user_id = req.params.user_id
  const options = userService.assembleGetPublicRequestOptions(
    UserApiBaseUrl,
    user_id,
    token,
  )
  console.log('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

router.post('/register', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const uid = req.uid
  const body = req.body
  const options = userService.assembleRegisterRequestOptions(
    UserApiBaseUrl,
    uid,
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
