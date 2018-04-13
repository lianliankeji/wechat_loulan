// components/barrage/barrage.js

var doommList = [];
var i = 0;//用做唯一的wx:key
let page


Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    doommData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    aaa: function () {
      console.log(111)
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      
    },
    onTap: function () {
      
      this.triggerEvent('aaa', {}, {})
      this.triggerEvent('myevent')
      doommList.push(new Doomm("你是我的小苹果", Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
      this.setData({
        doommData: doommList
      })
    },
  },
  created() {
    page = this
  },
  ready() {

  }
})

class Doomm {
  constructor(text, top, time, color) {
    this.text = text + i;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = i++;
    setTimeout(function () {
      doommList.splice(doommList.indexOf(that), 1);//动画完成，从列表中移除这项
      page.setData({
        doommData: doommList
      })
    }, this.time * 1000)//定时器动画完成后执行。
  }
}
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
