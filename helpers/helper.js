const isType = (type, obj) => {
  /* Expected
    isType('String', 'something string') -> true
    isType('String', new String('something string')) -> true
  */
  /* Reference link
    http://bonsaiden.github.io/JavaScript-Garden/ja/#types.typeof
    [気になる点] リフレクション処理なので遅そう
   */
  const typeName = Object.prototype.toString.call(obj).slice(8, -1)
  return obj !== undefined && obj !== null && typeName === type
}

const getMonthDays = (year, month) => {
  /* Expected
    getMonthDays(2015, 2) -> 28
    getMonthDays(2016, 2) -> 29
    getMonthDays(2016, 8) -> 31
  */
  /* Reference link
  http://phiary.me/js-get-month-days/
  */
  return new Date(year, month, 0).getDate()
}

const extractDayNumFromDateTimeStr = dateTimeStr => {
  /* Expected
    extractDayNumFromDateTimeStr("2011-04-02T12:00:00Z") -> 2
  */
  const date = new Date(dateTimeStr)
  return date.getDate()
}

const helper = {
  isType: isType,
  getMonthDays: getMonthDays,
  extractDayNumFromDateTimeStr: extractDayNumFromDateTimeStr,
}

module.exports = helper
