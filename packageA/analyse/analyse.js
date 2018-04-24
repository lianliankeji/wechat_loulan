Page({

  /**
   * 页面的初始数据
   */
  data: {
    addModal: true,
    addValue: "",
    iconlist:[
      {
        name: "惊悚"
      },
      {
        name: "惊悚"
      },
      {
        name: "惊悚发多"
      },
      {
        name: "惊悚5"
      },
      {
        name: "惊悚0"
      },
      {
        name: "惊悚1"
      },
      {
        name: "惊悚2"
      },
      {
        name: "惊悚3"
      }
    ]
  },

  bindAddFinish(e) {
    console.log(e.detail.value)
    this.setData({
      addModal: true,
      iconlist: [...this.data.iconlist, {
        name: e.detail.value
      }]
    })
  },

  bindShowAddModal() {
    this.setData({
      addModal: false
    })
  },

  bindAddiconName(e) {
    this.setData({})
    console.log(e)
  },

  goHome() {
    wx.navigateBack({
      delta: 2
    })
  },

  reupload() {
    wx.chooseImage({
      // count: 1, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePaths = res.tempFilePaths
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        // wx.uploadFile({
        //   // url: 'http://192.168.50.115:8123/upload', //仅为示例，非真实的接口地址
        //   url: 'https://store.lianlianchains.com/exchange/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'test',
        //   formData: {
        //     'openid': wx.getStorageSync('user').openid
        //   },
        //   success: function (res) {
        //     var data = res.data
        //     //do something
        //     resolve(res)
        //     console.log(data)
        //   }
        // })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})