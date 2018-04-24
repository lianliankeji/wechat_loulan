import fetch from "./utils/fetch.js"
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: "http://192.168.50.238:9777/mogao/wx/getopenid",
            data: {
              code: res.code
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
            header: { "Content-Type": "application/x-www-form-urlencoded"}, // 设置请求的 header    
            success: function (data) {
              wx.setStorage({
                key: 'openid',
                data: data.data.openid,
              })
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)

        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
})