export function getWeekDay(dateString) {
  let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;

  if (dateString.match(dateStringReg)) {
    let presentDate = new Date(dateString),
      today = presentDate.getDay();

    let week = Array.from(new Array(6), function (val, index) {
      return formatDate(new Date(presentDate.getTime() - (today - (index + 1)) * 24 * 60 * 60 * 1000));
    });
    week.unshift(formatDate(new Date(presentDate.getTime() - (today - 7) * 24 * 60 * 60 * 1000)))
    return week
  } else {
    throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"');
  }

  function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
}