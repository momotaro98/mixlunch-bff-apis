const assert = require('chai').assert
const userScheduleService = require('../services/userschedule')

describe('Tests for userScheduleService assembleGetRequestOptions', () => {
  it('assembleGetRequestOptions should return correct options based on the specification of the backend API.', () => {
    // Arrange
    const baseUrl = 'https://example.com/api/v1/userschedule/'
    const uid = 'uid'
    const token = 'token'
    const beginDT = '2014-10-10T04:50:40Z'
    const endDT = '2019-10-10T04:50:40Z'
    // Act
    const options = userScheduleService.assembleGetRequestOptions(
      baseUrl,
      uid,
      token,
      beginDT,
      endDT,
    )
    // Assert
    assert.strictEqual(options.method, 'GET')
    assert.strictEqual(options.url, baseUrl + uid + '/' + beginDT + '/' + endDT)
    assert.strictEqual(options.headers.Authorization, 'Bearer ' + token)
  })
})

describe('Tests for userScheduleService assembleResponseWithModelToClient based on specification of BFF API server', () => {
  it('assembleResponseWithModelToClient should return correct response when response is enough', () => {
    // Arrange
    const expectedStart = '2018-11-01T00:00:00Z'
    const expectedEnd = '2018-11-01T01:00:00Z'
    const expectedTags = [
      {
        category: {
          id: 4,
          name: 'プログラミング',
        },
        tags: [
          {
            id: 1,
            name: 'Python',
          },
          {
            id: 3,
            name: 'Ruby on Rails',
          },
        ],
      },
      {
        category: {
          id: 5,
          name: 'AI',
        },
        tags: [
          {
            id: 5,
            name: 'ディープラーニング',
          },
        ],
      },
    ]
    const expectedLocation = {
      latitude: 35.610483,
      longitude: 139.630123,
    }

    const resJsonFromServer = {
      user_id: 'xDlXdTXw5eV7jC7ETxX59gUk71J2',
      user_schedules: [
        {
          from_date_time: expectedStart,
          to_date_time: expectedEnd,
          tags: expectedTags,
          location: expectedLocation,
        },
      ],
    }

    // Act
    const response = userScheduleService.assembleResponseWithModelToClient(
      resJsonFromServer,
    )

    // Assert
    assert.equal(response.start, expectedStart)
    assert.equal(response.end, expectedEnd)
    assert.equal(response.tags, expectedTags)
    assert.equal(response.location, expectedLocation)
  })

  it('assembleResponseWithModelToClient should return empty string when response is NOT enough', () => {
    // Arrange
    const resJsonFromServer = {
      user_id: 'xDlXdTXw5eV7jC7ETxX59gUk71J2',
      user_schedules: null,
    }
    // Act
    const response = userScheduleService.assembleResponseWithModelToClient(
      resJsonFromServer,
    )
    // Assert
    assert.strictEqual(
      JSON.stringify(response),
      '{"message":"Internal server error"}',
    )
  })
})

describe('Tests for userScheduleService assembleAddRequestOptions', () => {
  it('assembleAddRequestOptions should return correct options based on the specification of the backend API.', () => {
    // Arrange
    const baseUrl = 'https://example.com/api/v1/userschedule/'
    const uid = 'uid'
    const token = 'token'

    const expectedFromDT = '2018-10-10T11:30:00Z'
    const expectedToDT = '2018-10-10T13:30:00Z'
    const reqBody = {
      start_datetime: expectedFromDT,
      end_datetime: expectedToDT,
    }

    // Act
    const options = userScheduleService.assembleAddRequestOptions(
      baseUrl,
      uid,
      token,
      reqBody,
    )
    // Assert
    assert.strictEqual(options.method, 'POST')
    assert.strictEqual(options.url, baseUrl + uid + '/')
    assert.strictEqual(options.headers.Authorization, 'Bearer ' + token)
    assert.strictEqual(options.json, true)
    assert.strictEqual(options.body.from_date_time, expectedFromDT)
    assert.strictEqual(options.body.to_date_time, expectedToDT)
  })
})

describe('Tests for userScheduleService assembleUpdateRequestOptions', () => {
  it('assembleUpdateRequestOptions should return correct options based on the specification of the backend API.', () => {
    // Arrange
    const baseUrl = 'https://example.com/api/v1/userschedule/'
    const uid = 'uid'
    const token = 'token'

    const expectedFromDT = '2018-10-10T11:30:00Z'
    const expectedToDT = '2018-10-10T13:30:00Z'
    const reqBody = {
      start_datetime: expectedFromDT,
      end_datetime: expectedToDT,
    }

    // Act
    const options = userScheduleService.assembleUpdateRequestOptions(
      baseUrl,
      uid,
      token,
      reqBody,
    )
    // Assert
    assert.strictEqual(options.method, 'POST')
    assert.strictEqual(options.url, baseUrl + 'update/' + uid + '/')
    assert.strictEqual(options.headers.Authorization, 'Bearer ' + token)
    assert.strictEqual(options.json, true)
    assert.strictEqual(options.body.from_date_time, expectedFromDT)
    assert.strictEqual(options.body.to_date_time, expectedToDT)
  })
})

describe('Tests for userScheduleService assembleDeleteRequestOptions', () => {
  it('assembleDeleteRequestOptions should return correct options based on the specification of the backend API.', () => {
    // Arrange
    const baseUrl = 'https://example.com/api/v1/userschedule/'
    const uid = 'uid'
    const token = 'token'
    const date = '2018-10-10T00:00:00Z'
    // Act
    const options = userScheduleService.assembleDeleteRequestOptions(
      baseUrl,
      uid,
      token,
      date,
    )
    // Assert
    assert.strictEqual(options.method, 'POST')
    assert.strictEqual(options.url, baseUrl + 'delete/' + uid + '/')
    assert.strictEqual(options.headers.Authorization, 'Bearer ' + token)
    assert.strictEqual(options.json, true)
    assert.strictEqual(options.body.date, date)
  })
})
