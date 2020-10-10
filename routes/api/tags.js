var router = require('express').Router()
var auth = require('../auth')
const tagsService = require('../../services/tags')
const api_helper = require('../../helpers/api-helper')

// Retrieve environment variables
const TagsApiBaseUrl = process.env.TAGS_BASEURL

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
    tagsService.assembleResponseWithModelToClient,
  )
}

router.get('/', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const uid = req.uid
  const tagTypeId = tagsService.TagType.All
  const options = tagsService.assembleGetRequestOptions(
    TagsApiBaseUrl,
    uid,
    token,
    tagTypeId,
  )
  console.log('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

router.get('/:tt', auth.required, (req, res, next) => {
  const token = req.headers.authorization
  const uid = req.uid
  const tagTypeName = req.params.tt
  const tagTypeId = tagsService.tellTagTypeIdFromName(tagTypeName)
  const options = tagsService.assembleGetRequestOptions(
    TagsApiBaseUrl,
    uid,
    token,
    tagTypeId,
  )
  console.log('Request options to be sent to service api:')
  console.dir(options)
  requestWithAsync(options).then(responseFromServiceApi => {
    res = cramContentsIntoResponseForClient(res, responseFromServiceApi)
  })
})

module.exports = router
