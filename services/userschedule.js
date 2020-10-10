const api_helper = require('../helpers/api-helper')

const translateServiceApiResToBffRes = userSchedule => {
  const translationErrorMessage = 'Translation error'

  // Bff response elements to generate
  const start =
    'from_date_time' in userSchedule
      ? userSchedule.from_date_time
      : translationErrorMessage
  const end =
    'to_date_time' in userSchedule
      ? userSchedule.to_date_time
      : translationErrorMessage
  const tags =
    `tags` in userSchedule ? userSchedule.tags : translationErrorMessage
  const location =
    `location` in userSchedule ? userSchedule.location : translationErrorMessage

  const returnElms = [start, end, tags, location]
  const hasError = returnElms.some(elm => {
    return elm === translationErrorMessage
  })
  if (hasError) {
    console.log(
      'Error: User Schedule Service Api res => Bff res translation failed. User Schedule service res:',
    )
    console.dir(userSchedule)
  }
  return returnElms.concat([hasError])
}

// assembleResponseWithModelToClient makes response to frontend side based on API specification.
var assembleResponseWithModelToClient = responseBodyFromServiceApi => {
  if (!responseBodyFromServiceApi.user_schedules) {
    return api_helper.assembleErrorResponseToFrontend(null)
  }
  if (responseBodyFromServiceApi.user_schedules.length === 0) {
    return {}
  }
  const specifiedUserSchedule = responseBodyFromServiceApi.user_schedules[0]
  // For now, userschedule get endpoint returns only one schedule due to Mixlunch app specification.
  const [start, end, tags, location, hasError] = translateServiceApiResToBffRes(
    specifiedUserSchedule,
  )
  if (hasError) {
    return api_helper.assembleErrorResponseToFrontend(null)
  }
  return {
    start: start,
    end: end,
    tags: tags,
    location: location,
  }
}

var assembleGetRequestOptions = (baseUrl, uid, token, beginDT, endDT) => {
  const url = baseUrl + uid + '/' + beginDT + '/' + endDT // http://domain.com/v1/userschedule/{user_id}/{YYYY-mm-DDTHH:MM:SSZ}/{YYYY-mm-DDTHH:MM:SSZ}
  return api_helper.assembleGetRequestOptions(token, url)
}

var assembleAddRequestOptions = (baseUrl, uid, token, cltBody) => {
  const url = baseUrl + uid + '/'
  const body = {
    from_date_time: cltBody.start_datetime,
    to_date_time: cltBody.end_datetime,
    tag_ids: cltBody.tag_ids,
    location: cltBody.location,
  }
  return api_helper.assemblePostRequestOptions(token, url, body)
}

var assembleUpdateRequestOptions = (baseUrl, uid, token, cltBody) => {
  const url = baseUrl + 'update/' + uid + '/'
  const body = {
    from_date_time: cltBody.start_datetime,
    to_date_time: cltBody.end_datetime,
    tag_ids: cltBody.tag_ids,
    location: cltBody.location,
  }
  return api_helper.assemblePostRequestOptions(token, url, body)
}

var assembleDeleteRequestOptions = (baseUrl, uid, token, date) => {
  const url = baseUrl + 'delete/' + uid + '/'
  const body = {
    date: date,
  }
  return api_helper.assemblePostRequestOptions(token, url, body)
}

const userScheduleService = {
  assembleResponseWithModelToClient: assembleResponseWithModelToClient,
  assembleGetRequestOptions: assembleGetRequestOptions,
  assembleAddRequestOptions: assembleAddRequestOptions,
  assembleUpdateRequestOptions: assembleUpdateRequestOptions,
  assembleDeleteRequestOptions: assembleDeleteRequestOptions,
  translateServiceApiResToBffRes: translateServiceApiResToBffRes,
}

module.exports = userScheduleService
