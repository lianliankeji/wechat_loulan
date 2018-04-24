export const getOpenid = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}