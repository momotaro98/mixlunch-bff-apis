// const assert = require("chai").assert;
// const partyService = require('../services/party');
//
// describe('Tests for partyService assembleGetRequestOptions', () => {
//   it('assembleGetRequestOptions should return correct options based on the specification of the backend API.', () => {
//     // Arrange
//     const baseUrl = 'https://example.com/api/v1/party/';
//     const uid = 'uid';
//     const token = 'token';
//     const beginDT = '2014-10-10T04:50:40Z';
//     const endDT = '2019-10-11T04:50:40Z';
//     // Act
//     let options = partyService.assembleGetRequestOptions(baseUrl, uid, token, beginDT, endDT);
//     // Assert
//     assert.strictEqual(options.method, 'GET');
//     assert.strictEqual(options.url, baseUrl + uid + '/' + beginDT + '/' + endDT);
//     assert.strictEqual(options.headers.Authorization, 'Bearer ' + token);
//   });
// });
