async function aaa(){
const fs = require("fs");
const util = require("util");
const imageData = await util.promisify(fs.readFileSync('E:/Users/思/Desktop/毕设/newTalk-master/talk/src/assets/张三.jpg')); // 例：xxx/xx/xx.png
const imageBase64 = imageData.toString("base64");
const imagePrefix = "data:image/jpg;base64,";
console.log(imagePrefix + imageBase64);
}
aaa()