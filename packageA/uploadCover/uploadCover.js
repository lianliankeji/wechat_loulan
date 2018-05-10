import { chooseImage } from "../../utils/upload.js";
import fetch from "../../utils/fetch.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieIcon: "/image/movie.png",
    uploadIcon: "/image/add.png",
    show: false,
    reupshow: false,
    coversrc: "",
    buttonDisabled: true
  },

  bindTitleTap(e) {
    this.setData({
      title: e.detail.value
    },() => {
      this.setData({
        buttonDisabled: !this.data.coversrc || !this.data.info || !this.data.title
      })
    })
  },

  bindInfoTap(e) {
    this.setData({
      info: e.detail.value
    }, () => {
      this.setData({
        buttonDisabled: !this.data.coversrc || !this.data.info || !this.data.title
      })
    })
  },

  uploadAll() {
    fetch({
      url: "/mogaojava/insert",
      data: {
        name: this.data.title, 
        description: this.data.info, 
        url: this.data.videosrc, 
        uploaduser: this.data.openid,
        image: this.data.image
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      if (res.ec == "000000") {
        wx.navigateTo({
          url: '../evaluate/evaluate?videoid=' + res.data
        })
      }

    }).catch(err => {
      console.log(err)
    })
  },

  next() {
    this.uploadAll();
  },

  addCover() {
    chooseImage().then(response => {
      this.getOpenid().then(openid => {
        const uploadTask = wx.uploadFile({
          // url: 'https://store.lianlianchains.com/video/upload/',
          url: 'https://mogao.lianlianchains.com/mogaojava/uploadimage',
          filePath: response.tempFilePaths[0],
          name: 'image',
          formData: {
            'openid': openid
          },
          success: (res) => {
            this.setData({
              coversrc: response.tempFilePaths[0],
              openid: openid,
              image: res.data,
              show: true,
              reupshow: true
            }, () => {
              this.setData({
                buttonDisabled: !this.data.coversrc || !this.data.info || !this.data.title
              })
            })

          }
        });

        uploadTask.onProgressUpdate((res) => {

          this.setData({
            progress: res.progress
          })

          // console.log('上传进度', res.progress)
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
    this.setData({
      videosrc: options.videosrc
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
  }
})
