const api_helper = require('../helpers/api-helper')

const TagType = {
  All: 0,
  Interest: 1,
  Skill: 2,
}

// This method returns tagType ID as 0(All) when the taken arg name doesn't match any tag types.
const tellTagTypeIdFromName = tagTypeName => {
  if (tagTypeName === null || tagTypeName === '') {
    return TagType.All
  }
  const tagTypeStrLower = tagTypeName.toLowerCase()
  if (tagTypeStrLower === 'interest') {
    return TagType.Interest
  } else if (tagTypeStrLower === 'skill') {
    return TagType.Skill
  }
  return TagType.All
}

const assembleResponseWithModelToClient = responseBodyFromServiceApi => {
  return {
    tags: responseBodyFromServiceApi,
  }
}

const assembleGetRequestOptions = (baseUrl, uid, token, tagTypeId) => {
  const url = baseUrl + tagTypeId // http://domain.com/v1/tags/{tagTypeId}
  return api_helper.assembleGetRequestOptions(token, url)
}

const tagsService = {
  TagType: TagType,
  tellTagTypeIdFromName: tellTagTypeIdFromName,
  assembleResponseWithModelToClient: assembleResponseWithModelToClient,
  assembleGetRequestOptions: assembleGetRequestOptions,
}

module.exports = tagsService
