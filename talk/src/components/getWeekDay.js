export function getWeekDay(dateString) {
  let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;

  if (dateString.match(dateStringReg)) {
    let presentDate = new Date(dateString),
      today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7;

    return Array.from(new Array(7), function (val, index) {
      return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000));
    });

  } else {
    throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"');
  }

  function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
}