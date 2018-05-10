import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total: Number,
    targets: String,
    play: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    choose: 5,
    maps:{
      plotEvent: "/mogaojava/avgstory",
      showEvent: "/mogaojava/avgact",
      musicEvent: "/mogaojava/avgsound"
    }
  },

  attached: function () {
    if(this.properties.play == "true") {
      let videoid = wx.getStorageSync("videoid");
      fetch({
        url: this.data.maps[this.properties.targets],
        data: {
          videoid: videoid
        },
        method: "POST"
      }).then(res => {
        console.log(res)
        if (res.ec == "000000") {
          console.log(res.data, Math.round(res.data))
          this.setData({
            choose: Math.round(res.data) - 1
          })

          var myEventDetail = { choose: Math.round(res.data) - 1 } // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          this.triggerEvent(this.properties.targets, myEventDetail, myEventOption)
        }
      }).catch(err => {
        console.log(err)
      })
      
    }
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose(e) {
      this.setData({
        choose: e.target.dataset.index
      })

      var myEventDetail = { choose: e.target.dataset.index} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent(this.properties.targets, myEventDetail, myEventOption)
    }
  }
})
