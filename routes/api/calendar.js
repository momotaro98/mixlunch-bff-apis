const router = require('express').Router()
const auth = require('../auth')
const userScheduleService = require('../../services/userschedule')
const partyService = require('../../services/party')
const calendarService = require('../../services/calendar')
const api_helper = require('../../helpers/api-helper')

// Retrieve environment variables
const UserScheduleApiBaseUrl = process.env.USERSCHEDULE_BASEURL
const PartyApiBaseUrl = process.env.PARTY_BASEURL

async function cramContentsIntoResponseForClient(
  resToSendToClient,
  year_month,
  resFromUserScheduleService,
  resFromPartyService,
) {
  // Check if the response is an error or not, and then handle it if error
  let isError

  // User Schedule
  let userScheduleResBody
  ;[
    userScheduleResBody,
    resToSendToClient,
    isError,
  ] = api_helper.handleErrorStatusFromServiceApi(
    resToSendToClient,
    resFromUserScheduleService,
  )
  if (isError) {
    console.log('Error: got error from service api. The response:')
    console.dir(resFromUserScheduleService)
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
  console.dir(userScheduleResBody)
  console.log('got regular response of party service api:')
  console.dir(partyResBody)

  const resBodyToClient = await calendarService.assembleResponseWithModelToClient(
    year_month,
    userScheduleResBody,
    partyResBody,
  )
  resToSendToClient.status(200).json(resBodyToClient)
  return resToSendToClient
}

router.get('/:year_month', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const uid = req.uid
  const year_month = req.params.year_month
  const [beginDT, endDT] = calendarService.provideBeginAndEndDateTime(
    year_month,
  )

  const userScheduleOptions = userScheduleService.assembleGetRequestOptions(
    UserScheduleApiBaseUrl,
    uid,
    token,
    beginDT,
    endDT,
  )
  console.log('User Schedule Service options to request to backend server')
  console.dir(userScheduleOptions)

  const partyOptions = partyService.assembleGetRequestOptions(
    PartyApiBaseUrl,
    uid,
    token,
    beginDT,
    endDT,
  )
  console.log('Party Service options to request to backend server')
  console.dir(partyOptions)

  api_helper
    .multiRequestsWithAsync([userScheduleOptions, partyOptions])
    .then(responsesFromServiceApis => {
      const resFromUserScheduleServiceApi = responsesFromServiceApis[0]
      const resFromPartyServiceApi = responsesFromServiceApis[1]
      cramContentsIntoResponseForClient(
        res,
        year_month,
        resFromUserScheduleServiceApi,
        resFromPartyServiceApi,
      ).then(response => {
        res = response
      })
    })
})

module.exports = router
