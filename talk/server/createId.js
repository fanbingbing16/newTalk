let word = 'abcdefghijklmnopqrstuvwxyz'
let s = []
let getId = ''
for (let i = 0; i < 5; i++) {
  s[i] = word[Math.floor(Math.random() * 25)]
  if ((Math.random() * 5) > 1) {
    getId += word[Math.floor(Math.random() * 25)]
  }
}
getId += Math.random().toString().substr(3, 3) + s.join('') + new Date().getTime()
module.exports = getId
