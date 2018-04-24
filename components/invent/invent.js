// components/invent/invent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: { 
      type: Boolean, 
      value: true,
      observer: (newVal, oldVal) => {
        if (newVal != oldVal) {
          this.setData({
            hidden: newVal
          })
        }
      } 
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getInventCode() {
      
    },

    bindToasthide() {
      this.setData({
        hidden: true
      })
    }
  }
})
