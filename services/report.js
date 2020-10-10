const assembleReportUserRequestOptions = body => {
  const now = new Date().toISOString()
  return {
    cloudFilePath:
      'Report/User/' +
      body.reporter +
      '_' +
      body.reportee +
      '_' +
      now +
      '.json',
    body: body,
  }
}

const assembleReportExcuseRequestOptions = body => {
  const now = new Date().toISOString()
  return {
    cloudFilePath: 'Report/Excuse/' + body.reporter + '_' + now + '.json',
    body: body,
  }
}

const assembleResponseWithModelToClient = (storageResBody, userResBody) => {
  return {
    result: 'success',
  }
}

const reportService = {
  assembleReportUserRequestOptions: assembleReportUserRequestOptions,
  assembleReportExcuseRequestOptions: assembleReportExcuseRequestOptions,
  assembleResponseWithModelToClient: assembleResponseWithModelToClient,
}

module.exports = reportService
