const assert = require('chai').assert
const userService = require('../services/user')

describe('Tests for userService assembleRegisterRequestOptions', () => {
  it('assembleRegisterRequestOptions should always add user_id into body from client.', () => {
    // Arrange
    const baseUrl = 'https://example.com/api/v1/user/'
    const uid = 'uid'
    const token = 'token'
    const body = { name: 'Johan Smith' }
    // Act
    const options = userService.assembleRegisterRequestOptions(
      baseUrl,
      uid,
      token,
      body,
    )
    // Assert
    assert.strictEqual(options.method, 'POST')
    assert.strictEqual(options.url, baseUrl + 'register')
    assert.strictEqual(options.headers.Authorization, 'Bearer ' + token)
    assert.strictEqual(options.body.user_id, uid) // Main assert
  })
})
