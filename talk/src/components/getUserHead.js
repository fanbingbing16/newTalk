export function getUserHead(id, type) {
  //如果id是数字就转字符串，如果是字母加数字或者字母，先转成数字再转字符串
  let ID = String(isNaN(+id) ? id.charCodeAt() : id)
  if (type === 'bck') {
    return Number(ID.substring((Math.floor(ID.length / 3) - 3) * 3))
  } else if (type === 'polygon') {
    return Number(ID.substring((Math.floor(ID.length / 2) - 2) * 3))
  } else if (type === 'rotate') {
    return Number(ID.substring(ID.length - 3))
  } else if (type === 'boderRadius') {
    return [Number((+ID / (ID.length * ID)) * 100), (ID.substring(0, 3) / 999) * 100]
  }
}