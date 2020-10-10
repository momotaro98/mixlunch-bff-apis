const router = require('express').Router()
const auth = require('../auth')
const userService = require('../../services/user')
const reportService = require('../../services/report')
const api_helper = require('../../helpers/api-helper')
const fb_helper = require('../../helpers/firebase-helper')

const UserApiBaseUrl = process.env.USER_BASEURL

async function requestReportUserWithAsync(storageOptions, userOptions) {
  const promiseWaitingForStorageResult = fb_helper.requestToStorageService(
    storageOptions,
  )
  const promiseWaitingForUserResult = api_helper.requestToServiceApi(
    userOptions,
  )
  return Promise.all([
    promiseWaitingForStorageResult,
    promiseWaitingForUserResult,
  ])
}

async function cramReportUserContentsIntoResponseForClient(
  resToSendToClient,
  resFromStorageService,
  resFromUserService,
) {
  let isError

  // Storage service
  console.log(resFromStorageService)
  const storageResBody = resFromStorageService

  // User service
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

  console.log('got regular response of Storage service api:')
  console.dir(storageResBody)
  console.log('got regular response of User service api:')
  console.dir(userResBody)

  const resBodyToClient = await reportService.assembleResponseWithModelToClient(
    storageResBody,
    userResBody,
  )
  resToSendToClient.status(200).json(resBodyToClient)
  return resToSendToClient
}

router.post('/user', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const body = req.body

  const storageOptions = reportService.assembleReportUserRequestOptions(body)
  console.log('Got report user request:')
  console.dir(storageOptions)

  const userOptions = userService.assembleAddBlockRequestOptions(
    UserApiBaseUrl,
    token,
    body,
  )
  console.log('Request options to be sent to service api:')
  console.dir(userOptions)

  requestReportUserWithAsync(storageOptions, userOptions).then(
    responseFromServiceApis => {
      const resFromStorageService = responseFromServiceApis[0]
      const resFromUserService = responseFromServiceApis[1]
      cramReportUserContentsIntoResponseForClient(
        res,
        resFromStorageService,
        resFromUserService,
      ).then(response => {
        res = response
      })
    },
  )
})

async function requestReportExcuseWithAsync(storageOptions) {
  return fb_helper.requestToStorageService(storageOptions)
}

async function cramReportExcuseContentsIntoResponseForClient(
  resToSendToClient,
  resFromServiceApi,
) {
  // Storage service
  console.log(resFromServiceApi)
  const storageResBody = resFromServiceApi
  const resBodyToClient = await reportService.assembleResponseWithModelToClient(
    storageResBody,
    null,
  )
  resToSendToClient.status(200).json(resBodyToClient)
  return resToSendToClient
}

router.post('/excuse', auth.required, (req, res, next) => {
  const body = req.body

  const storageOptions = reportService.assembleReportExcuseRequestOptions(body)
  console.log('Got report excuse request:')
  console.dir(storageOptions)

  requestReportExcuseWithAsync(storageOptions).then(responseFromStorage => {
    cramReportExcuseContentsIntoResponseForClient(
      res,
      responseFromStorage,
    ).then(response => {
      res = response
    })
  })
})

module.exports = router
