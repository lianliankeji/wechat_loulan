Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true
  },

  upload() {
    wx.chooseImage({
      // count: 1, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePaths = res.tempFilePaths
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        wx.navigateTo({
          url: '/packageA/analyse/analyse',
        })
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

  bindInventView() {
    this.setData({
      hidden: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country

        this.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        })
      }
    })
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