import fetch from "./utils/fetch.js"
App({
  onLaunch: function () {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: "https://mogao.lianlianchains.com/mogaojava/wx/getopenid",
            data: {
              code: res.code
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
            header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header    
            success: function (data) {
              wx.setStorage({
                key: 'openid',
                data: data.data.openid,
              });
              wx.setStorageSync("openidSync", data.data.openid)
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)

        }


      }
    });
  },
  globalData: {
    aa:11,
    userInfo: {}
  }
})