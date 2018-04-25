// components/star/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total: Number,
    targets: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    choose: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose(e) {
      console.log()
      this.setData({
        choose: e.target.dataset.index
      })

      var myEventDetail = { choose: e.target.dataset.index} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent(this.properties.targets, myEventDetail, myEventOption)
    }
  }
})
