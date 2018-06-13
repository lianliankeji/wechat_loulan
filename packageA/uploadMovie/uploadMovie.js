import { uploadVedio } from "../../utils/upload.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieIcon: "/image/movie.png",
    uploadIcon: "/image/add.png",
    show: false,
    reupshow: false,
    hiddenPro: true
  },

  getOpenid() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          resolve(res.data)
        }
      })
    })
  },

  next() {
    wx.navigateTo({
      url: '/packageA/uploadCover/uploadCover?videosrc=' + this.data.videosrc
    })
  },

  addMovie() {
    
    uploadVedio().then(res => {
      console.log(res.tempFilePath);
      this.setData({
        hiddenPro: false,
        reupshow: false
      })

      this.getOpenid().then(openid => {
        const uploadTask = wx.uploadFile({
          // url: 'https://store.lianlianchains.com/video/upload/',
          url: 'https://mogao.lianlianchains.com/mogaojava/upload',
          filePath: res.tempFilePath,
          name: 'video',
          formData: {
            'openid': openid
          },
          success: (res) => {
            console.log(res);
            let data = JSON.parse(res.data);


            if (data.ec == "000000") {
              this.setData({
                videosrc: data.data,
                show: true,
                reupshow: true,
                hiddenPro: true,
                progress: 100
              })
              
            }
          }
        })

        uploadTask.onProgressUpdate((res) => {
          console.log(res.progress)
          this.setData({
            progress: res.progress, 
          });
          // console.log('已经上传的数据长度', res.totalBytesSent)
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })
      })

      
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