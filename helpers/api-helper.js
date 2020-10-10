const request = require('request')
const helper = require('./helper')

const requestToServiceApi = options => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) throw new Error(error) // Issue: We don't handle system errors response from service API.
      const res = {
        statusCode: response.statusCode,
        body: body,
      }
      resolve(res)
    })
  })
}

const multiRequestsWithAsync = async multiOptions => {
  var promisesFromServices = []
  multiOptions.forEach(option => {
    const promiseResult = requestToServiceApi(option)
    promisesFromServices.push(promiseResult)
  })
  return Promise.all(promisesFromServices)
}

const handleResponseBodyFromServiceApi = response => {
  // [なぜ if (helper.isType('String', response.body)) をするのか]
  // requestモジュールが返すbodyがGETリクエストではString,
  // POSTリクエストではobject という違いがあるため。
  // 本当にその違いが出るのかはrequestモジュールの
  // ソースを読んで確認すると良さそうではあるがしていない。
  // Link: https://www.npmjs.com/package/request
  let resBody
  if (helper.isType('String', response.body)) {
    try {
      resBody = JSON.parse(response.body)
    } catch {
      resBody = {
        message: response.body,
      }
    }
  } else {
    resBody = response.body
  }
  return resBody
}

// assembleErrorResponseToFrontend makes an error response to frontend side based on API specification.
const assembleErrorResponseToFrontend = objectWhichHasAnErrorMessage => {
  if (!objectWhichHasAnErrorMessage || !objectWhichHasAnErrorMessage.message) {
    return {
      message: 'Internal server error',
    }
  }
  const message = objectWhichHasAnErrorMessage.message
  return {
    message: message,
  }
}

const handleErrorStatusFromServiceApi = (
  resToSendToClient,
  resFromServiceApi,
) => {
  // Handle irregular response from service api
  if (resFromServiceApi.length < 1) {
    resToSendToClient.status(500).end('Internal server error')
    return ['', resToSendToClient, true]
  }

  // Make response body objects
  const responseBodyFromServiceApi = api_helper.handleResponseBodyFromServiceApi(
    resFromServiceApi,
  )

  // Success response from API
  if (
    resFromServiceApi.statusCode >= 200 &&
    resFromServiceApi.statusCode < 300
  ) {
    return [responseBodyFromServiceApi, resToSendToClient, false] // isError is false
  }

  // Handle just 400 error
  if (resFromServiceApi.statusCode === 400) {
    // ビジネス的エラーを意味する400(ちょうど)が返るとき、
    // Service APIのメッセージをそのままクライアントへ返す。
    const responseToClient = api_helper.assembleErrorResponseToFrontend(
      responseBodyFromServiceApi,
    )
    resToSendToClient.status(400).json(responseToClient)
    return [responseBodyFromServiceApi, resToSendToClient, true]
  }

  // 400(ちょうど)以外が返ったとき、クライアントには500番でInternal Server Errorとして返す。
  const resToClient = api_helper.assembleErrorResponseToFrontend(null)
  resToSendToClient.status(500).json(resToClient)
  return [responseBodyFromServiceApi, resToSendToClient, true]
}

const cramContentsIntoResponseForClient = (
  resToSendToClient,
  resFromServiceApi,
  assembleResponseWithModelToClient,
) => {
  // Error handling
  let isError
  let resBody
  ;[
    resBody,
    resToSendToClient,
    isError,
  ] = api_helper.handleErrorStatusFromServiceApi(
    resToSendToClient,
    resFromServiceApi,
  )
  if (isError) {
    console.log('Error: got error from service api. The response:')
    console.dir(resFromServiceApi)
    return resToSendToClient
  }

  // Regular case response handling
  console.log('got regular response:')
  console.dir(resBody)
  const responseToClient = assembleResponseWithModelToClient(resBody)
  resToSendToClient.status(200).json(responseToClient)
  return resToSendToClient
}

const assembleGetRequestOptions = (token, url) => {
  return {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token,
    },
    form: false,
  }
}

const assemblePostRequestOptions = (token, url, body) => {
  return {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    json: true,
    body: body,
  }
}

const assembleMultiResponsesWithModelToClient = responses => {
  let merged = {}
  responses.forEach(res => {
    merged = { ...merged, ...res }
  })
  return merged
}

const api_helper = {
  requestToServiceApi: requestToServiceApi,
  multiRequestsWithAsync: multiRequestsWithAsync,
  handleResponseBodyFromServiceApi: handleResponseBodyFromServiceApi,
  assembleErrorResponseToFrontend: assembleErrorResponseToFrontend,
  handleErrorStatusFromServiceApi: handleErrorStatusFromServiceApi,
  cramContentsIntoResponseForClient: cramContentsIntoResponseForClient,
  assembleGetRequestOptions: assembleGetRequestOptions,
  assemblePostRequestOptions: assemblePostRequestOptions,
  assembleMultiResponsesWithModelToClient: assembleMultiResponsesWithModelToClient,
}

module.exports = api_helper
