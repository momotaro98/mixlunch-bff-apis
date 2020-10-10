const assert = require('chai').assert
const api_helper = require('../helpers/api-helper')

describe('Tests for api_helper assembleErrorResponseToFrontend', () => {
  it('assembleErrorResponseToFrontend should return a response with error message when response from backend api is error response', () => {
    // Arrange
    const message = 'error message'
    const code = 400
    const resBody = {
      message: message,
      code: code,
    }
    // Act
    const response = api_helper.assembleErrorResponseToFrontend(resBody)
    // Assert
    assert.strictEqual(response.message, message)
    assert.strictEqual(response.code, undefined)
  })
  it('assembleErrorResponseToFrontend should return a response with "Internal server error" when it takes String type', () => {
    // Arrange
    const resBody = 'No page found\n'
    // Act
    const response = api_helper.assembleErrorResponseToFrontend(resBody)
    // Assert
    assert.strictEqual(response.message, 'Internal server error')
  })
  it('assembleErrorResponseToFrontend should return a response with "Internal server error" when it takes null', () => {
    // Arrange
    const resBody = null
    // Act
    const response = api_helper.assembleErrorResponseToFrontend(resBody)
    // Assert
    assert.strictEqual(response.message, 'Internal server error')
  })
})
