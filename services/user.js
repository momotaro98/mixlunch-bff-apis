const api_helper = require('../helpers/api-helper')

const assembleResponseWithModelToClient = responseBodyFromServiceApi => {
  return responseBodyFromServiceApi
}

const assembleGetRequestOptions = (baseUrl, uid, token) => {
  const url = baseUrl + uid // http://domain.com/v1/user/{user_id}
  return api_helper.assembleGetRequestOptions(token, url)
}

const assembleGetPublicRequestOptions = (baseUrl, uid, token) => {
  const url = baseUrl + 'public/' + uid // http://domain.com/v1/user/public/{user_id}
  return api_helper.assembleGetRequestOptions(token, url)
}

const assembleRegisterRequestOptions = (baseUrl, uid, token, body) => {
  const url = baseUrl + 'register' // http://domain.com/v1/user/register
  body.user_id = uid // Add user_id
  return api_helper.assemblePostRequestOptions(token, url, body)
}

const assembleAddBlockRequestOptions = (baseUrl, token, body) => {
  const url = baseUrl + 'block' // http://domain.com/v1/user/block
  const reqBody = {
    blocker: body.reporter,
    blockee: body.reportee,
  }
  return api_helper.assemblePostRequestOptions(token, url, reqBody)
}

const userService = {
  assembleResponseWithModelToClient: assembleResponseWithModelToClient,
  assembleGetRequestOptions: assembleGetRequestOptions,
  assembleGetPublicRequestOptions: assembleGetPublicRequestOptions,
  assembleRegisterRequestOptions: assembleRegisterRequestOptions,
  assembleAddBlockRequestOptions: assembleAddBlockRequestOptions,
}

module.exports = userService
