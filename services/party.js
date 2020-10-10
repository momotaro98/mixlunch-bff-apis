const api_helper = require('../helpers/api-helper')

const translateServiceApiResToBffRes = async party => {
  const translationErrorMessage = 'Translation error'

  const party_id =
    'party_id' in party ? party.party_id : translationErrorMessage
  const start =
    'start_from' in party ? party.start_from : translationErrorMessage
  const end = 'end_to' in party ? party.end_to : translationErrorMessage
  const roomId =
    'chat_room_id' in party ? party.chat_room_id : translationErrorMessage
  const members = 'members' in party ? party.members : translationErrorMessage
  const tags = 'tags' in party ? party.tags : translationErrorMessage

  const returnElms = [party_id, start, end, roomId, members, tags]
  const hasError = returnElms.some(elm => {
    return elm === translationErrorMessage
  })
  if (hasError) {
    console.log(
      'Error: Party Service Api res => Bff res translation failed. Party service res:',
    )
    console.dir(party)
  }
  return returnElms.concat([hasError])
}

const assembleGetRequestOptions = (baseUrl, uid, token, beginDT, endDT) => {
  const url = baseUrl + uid + '/' + beginDT + '/' + endDT // http://domain.com/v1/party/{user_id}/{YYYY-mm-DDTHH:MM:SSZ}/{YYYY-mm-DDTHH:MM:SSZ}
  return api_helper.assembleGetRequestOptions(token, url)
}

const assembleReviewMemberRequestOptions = (baseUrl, token, body) => {
  const url = baseUrl + 'review/member' // http://domain.com/v1/party/review/member
  return api_helper.assemblePostRequestOptions(token, url, body)
}

const assembleGetIsReviewDoneRequestOptions = (baseUrl, uid, token) => {
  const url = baseUrl + 'review/done/' + uid // http://domain.com/v1/party/review/done/user-id
  return api_helper.assembleGetRequestOptions(token, url)
}

const partyService = {
  translateServiceApiResToBffRes: translateServiceApiResToBffRes,
  assembleGetRequestOptions: assembleGetRequestOptions,
  assembleReviewMemberRequestOptions: assembleReviewMemberRequestOptions,
  assembleGetIsReviewDoneRequestOptions: assembleGetIsReviewDoneRequestOptions,
}

module.exports = partyService
