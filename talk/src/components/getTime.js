export function getTime(date) {
  let time = new Date(date).getHours() >= 4 && new Date(date).getHours() <= 12 ? '上午' : '下午'
  return '周' + '日一二三四五六'[new Date(date).getDay()] + time
}
export function getDetailTime(date) {
  let time = new Date(date)
  console.log(date, time, '123')
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}