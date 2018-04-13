//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    rank: [
      {
        name: "小芋",
        score: 88888
      },
      {
        name: "伍声",
        score: 88888
      },
      {
        name: "规格",
        score: 88888
      },
      {
        name: "订单",
        score: 88888
      },
      {
        name: "该公司大范甘迪",
        score: 88888
      }
    ]
  },
  aaa(e) {
    console.log(e)
  },
  detail() {

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
    wx.saveFile({
      tempFilePath: "../../utils/util.js",
      success: function (res) {
        console.log(res)
        var savedFilePath = res.savedFilePath
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
