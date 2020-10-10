const helper = require('../helpers/helper')
const userScheduleService = require('./userschedule')
const partyService = require('./party')

const provideBeginAndEndDateTime = year_month => {
  const [year, month] = year_month.split('-').map(x => Number(x)) // Expected: ('2019-02') -> [2019, 2]
  const beginDateTimeStr = year_month + '-01T00:00:00.000Z'
  const numOfDays = helper.getMonthDays(year, month)
  const endDayStr = ('00' + numOfDays).slice(-2)
  const endDateTimeStr = year_month + '-' + endDayStr + 'T23:59:59.999Z'
  return [beginDateTimeStr, endDateTimeStr]
}

const generateCalendarEvents = async (
  year_month,
  userScheduleResBody,
  partyResBody,
) => {
  // Declare calendar events array to return
  const calendarEvents = []

  // Generate Empty objects as the number of the target year month
  const [year, month] = year_month.split('-').map(x => Number(x)) // Expected: ('2019-02') -> [2019, 2]
  const numOfDays = helper.getMonthDays(year, month)
  ;[...Array(numOfDays).keys()].forEach(() => {
    calendarEvents.push({})
  })

  if (!userScheduleResBody.user_schedules && !partyResBody.parties) {
    return calendarEvents
  }

  // For each with user schedules
  if (userScheduleResBody.user_schedules) {
    userScheduleResBody.user_schedules.forEach(userSchedule => {
      const [
        start,
        end,
        tags,
        location,
        hasError,
      ] = userScheduleService.translateServiceApiResToBffRes(userSchedule)
      if (hasError) return // Issue?: Just skipping a invalid user schedule
      const dayNumber = helper.extractDayNumFromDateTimeStr(start)
      const indexToAssign = dayNumber - 1
      calendarEvents[indexToAssign].schedule = {
        start: start,
        end: end,
        tags: tags,
        location: location,
      }
    })
  }
  // For each with parties
  if (partyResBody.parties) {
    for (const party of partyResBody.parties) {
      const [
        party_id,
        start,
        end,
        roomId,
        members,
        tags,
        hasError,
      ] = await partyService.translateServiceApiResToBffRes(party)
      if (hasError) return // Issue?: Same as above
      const dayNumber = helper.extractDayNumFromDateTimeStr(start)
      const indexToAssign = dayNumber - 1
      calendarEvents[indexToAssign].party = {
        party_id: party_id,
        start: start,
        end: end,
        roomId: roomId,
        members: members,
        tags: tags,
      }
    }
  }

  return calendarEvents
}

// assembleResponseWithModelToFrontend makes response to frontend side based on API specification.
const assembleResponseWithModelToClient = async (
  year_month,
  userScheduleResBody,
  partyResBody,
) => {
  // Initialize events(dates) of the target year_month
  const events = await generateCalendarEvents(
    year_month,
    userScheduleResBody,
    partyResBody,
  )
  // Return calendar objects as an API response
  return {
    year_month: year_month,
    events: events,
  }
}

const calendarService = {
  provideBeginAndEndDateTime: provideBeginAndEndDateTime,
  assembleResponseWithModelToClient: assembleResponseWithModelToClient,
}

module.exports = calendarService
