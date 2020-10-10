const assert = require('chai').assert
const tagsService = require('../services/tags')

describe('Tests for tagsService tellTagTypeIdFromName', () => {
  it('tellTagTypeIdFromName should return 1 if the name is "INtereSt".', () => {
    // Arrange
    const tagTypeName = 'INtereSt'
    // Act
    const tagTypeId = tagsService.tellTagTypeIdFromName(tagTypeName)
    // Assert
    assert.strictEqual(tagTypeId, 1) // Check TagType enum in the tag service file.
  })

  it('tellTagTypeIdFromName should return 2 if the name is "skill".', () => {
    // Arrange
    const tagTypeName = 'skill'
    // Act
    const tagTypeId = tagsService.tellTagTypeIdFromName(tagTypeName)
    // Assert
    assert.strictEqual(tagTypeId, 2) // Check TagType enum in the tag service file.
  })

  it('tellTagTypeIdFromName should return 0 if the name is "".', () => {
    // Arrange
    const tagTypeName = ''
    // Act
    const tagTypeId = tagsService.tellTagTypeIdFromName(tagTypeName)
    // Assert
    assert.strictEqual(tagTypeId, 0) // Check TagType enum in the tag service file.
  })

  it('tellTagTypeIdFromName should return 0 if the name is "skills".', () => {
    // Arrange
    const tagTypeName = 'skills'
    // Act
    const tagTypeId = tagsService.tellTagTypeIdFromName(tagTypeName)
    // Assert
    assert.strictEqual(tagTypeId, 0) // Check TagType enum in the tag service file.
  })
})

describe('Tests for tagsService assembleGetRequestOptions', () => {
  it('assembleGetRequestOptions should return correct options based on the specification of the backend API.', () => {
    // Arrange
    const baseUrl = 'https://example.com/api/v1/tags/'
    const uid = 'uid'
    const token = 'token'
    const tagTypeId = 1 // Interest
    // Act
    const options = tagsService.assembleGetRequestOptions(
      baseUrl,
      uid,
      token,
      tagTypeId,
    )
    // Assert
    assert.strictEqual(options.method, 'GET')
    assert.strictEqual(options.url, baseUrl + tagTypeId)
    assert.strictEqual(options.headers.Authorization, 'Bearer ' + token)
  })
})

describe('Tests for tagsService assembleResponseWithModelToClient based on specification of BFF API server', () => {
  it('assembleResponseWithModelToClient should return correct response when response is enough', () => {
    // Arrange
    const resJsonFromServer = [
      {
        category: {
          id: 2,
          name: 'スポーツ',
        },
        tags: [
          {
            id: 6,
            name: '野球',
          },
          {
            id: 7,
            name: 'サッカー',
          },
        ],
      },
      {
        category: {
          id: 3,
          name: 'グルメ',
        },
        tags: [
          {
            id: 8,
            name: '焼き肉',
          },
          {
            id: 9,
            name: '寿司',
          },
          {
            id: 10,
            name: 'ハンバーガー',
          },
        ],
      },
    ]
    // Act
    const response = tagsService.assembleResponseWithModelToClient(
      resJsonFromServer,
    )
    // Assert
    const expected = { tags: resJsonFromServer }
    assert.strictEqual(JSON.stringify(response), JSON.stringify(expected))
  })
})
