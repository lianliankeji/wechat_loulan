export const chooseImage = () => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      // count: 1, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        resolve(res)
      }
    })
  })
}

export const uploadVedio = () => {
  return new Promise((resolve, reject) => {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        resolve(res)
      }
    })
  })
}
