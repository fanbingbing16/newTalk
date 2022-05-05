export function getTime(date) {
  let time = new Date(date).getHours() >= 4 && new Date(date).getHours() <= 12 ? '上午' : '下午'
  return '周' + '日一二三四五六'[new Date(date).getDay()] + time
}
export function getDetailTime(date) {
  let time = new Date(date)
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}
export function getYearDate(date) {
  let time = new Date(date)
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
}
export function getTimeOfFour(date) {
  let time = new Date(date)
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours() >= 4 && time.getHours() <= 12 ? '上午' : '下午'}`
}