// const assert = require("chai").assert;
// const calendarService = require('../services/calendar');
//
// const default_year_month = '2019-03';
// const default_num_days = 31; // '2019-03' has 31 days
//
// describe('Tests for calendarService provideBeginAndEndDateTime', () => {
//   it('provideBeginAndEndDateTime should return begin and end date time as string when it takes January', () => {
//     // Arrange
//     const year_month = '2019-01';
//     // Act
//     const [beginDateTime, endDateTime] = calendarService.provideBeginAndEndDateTime(year_month);
//     // Assert
//     assert.strictEqual(beginDateTime, '2019-01-01T00:00:00.000Z');
//     assert.strictEqual(endDateTime, '2019-01-31T23:59:59.999Z');
//   });
//   it('provideBeginAndEndDateTime should return begin and end date time as string when it takes February', () => {
//     // Arrange
//     const year_month = '2019-02';
//     // Act
//     const [beginDateTime, endDateTime] = calendarService.provideBeginAndEndDateTime(year_month);
//     // Assert
//     assert.strictEqual(beginDateTime, '2019-02-01T00:00:00.000Z');
//     assert.strictEqual(endDateTime, '2019-02-28T23:59:59.999Z');
//   });
// });
//
// describe('Tests for calendarService assembleResponseWithModelsToFrontend', () => {
//   it('assembleResponseWithModelsToFrontend should return correct calendar object based on the spec of the API when everything is OK.', () => {
//     // Arrange
//     const year_month = default_year_month;
//     const userScheduleResBody = {
//       "user_id": "xDlXdTXw5eV7jC7ETxX59gUk71J2",
//       "user_schedules": [
//         {
//           "from_date_time": year_month + "-01T12:00:00Z",
//           "to_date_time": year_month + "-01T13:30:00Z"
//         },
//         {
//           "from_date_time": year_month + "-03T11:00:00Z",
//           "to_date_time": year_month + "-03T13:30:00Z"
//         },
//         {
//           "from_date_time": year_month + "-31T12:00:00Z",
//           "to_date_time": year_month + "-31T13:30:00Z"
//         }
//       ]
//     };
//     const partyResBody = {
//       "parties": [
//         {
//           "start_from": year_month + "-03T12:00:00Z",
//           "end_to": year_month + "-03T13:00:00Z",
//           "chat_room_id": "chat-room-id1",
//           "members": [
//             {
//               "user_id": "xDlXdTXw5eV7jC7ETxX59gUk71J2",
//               "user_name": "しんじろう"
//             },
//             {
//               "user_id": "y8lXddXw5eV7jC7ETxX50gUk71J2",
//               "user_name": "木村拓哉"
//             },
//             {
//               "user_id": "zhlXdTXw5eV7jC7ETgX59gUk71J9",
//               "user_name": "Beyoncé"
//             }
//           ]
//         },
//         {
//           "start_from": year_month + "-31T12:30:00Z",
//           "end_to": year_month + "-31T13:30:00Z",
//           "chat_room_id": "chat-room-id2",
//           "members": [
//             {
//               "user_id": "xDlXdTXw5eV7jC7ETxX59gUk71J2",
//               "user_name": "しんじろう"
//             },
//             {
//               "user_id": "ahlbdTXw5eV7jChETgX59gUk41JZ",
//               "user_name": "Barack Obama"
//             }
//           ]
//         }
//       ]
//     };
//     // Act
//     const calendar = calendarService.assembleResponseWithModelsToFrontend(year_month, userScheduleResBody, partyResBody);
//     // Assert
//     assert.strictEqual(calendar.year_month, year_month);
//     // Check if the events of the actual calendar has correct length based on the num of days of the target year_month
//     assert.strictEqual(calendar.events.length, default_num_days);
//     // Check schedule of the events
//     assert.strictEqual(calendar.events[0].schedule.start, year_month + "-01T12:00:00Z");
//     assert.strictEqual(calendar.events[0].schedule.end, year_month + "-01T13:30:00Z");
//     assert.isUndefined(calendar.events[1].schedule);
//     assert.strictEqual(calendar.events[2].schedule.start, year_month + "-03T11:00:00Z");
//     assert.strictEqual(calendar.events[2].schedule.end, year_month + "-03T13:30:00Z");
//     assert.strictEqual(calendar.events[default_num_days-1].schedule.start, year_month + "-31T12:00:00Z");
//     assert.strictEqual(calendar.events[default_num_days-1].schedule.end, year_month + "-31T13:30:00Z");
//     // Check party of the events
//     assert.isUndefined(calendar.events[0].party);
//     assert.isUndefined(calendar.events[1].party);
//     assert.strictEqual(calendar.events[2].party.start, year_month + "-03T12:00:00Z");
//     assert.strictEqual(calendar.events[2].party.end, year_month + "-03T13:00:00Z");
//     assert.strictEqual(calendar.events[default_num_days-1].party.start, year_month + "-31T12:30:00Z");
//     assert.strictEqual(calendar.events[default_num_days-1].party.end, year_month + "-31T13:30:00Z");
//   });
//
//   it('assembleResponseWithModelsToFrontend should return empty objects when both user schedule and party models from service API are null', () => {
//     // Arrange
//     const year_month = default_year_month;
//     const userScheduleResBody = {
//       "user_id": "xDlXdTXw5eV7jC7ETxX59gUk71J2",
//       "user_schedules": ""
//     };
//     const partyResBody = {
//       "parties": []
//     };
//     // Act
//     const calendar = calendarService.assembleResponseWithModelsToFrontend(year_month, userScheduleResBody, partyResBody);
//     // Assert
//     assert.strictEqual(calendar.year_month, year_month);
//     // Check if the events of the actual calendar has correct length based on the num of days of the target year_month
//     assert.strictEqual(calendar.events.length, default_num_days);
//     // Check if all of events contents are empty object
//     calendar.events.forEach((event) => {
//       assert.deepEqual(event, {});
//     });
//   });
// });
