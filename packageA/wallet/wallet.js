import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
let skip = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tuisong: true,
    person: "***",
    randlist:[
      {
        img: "",
        name: "奥斯卡的风景",
        score: 350000
      },
      {
        img: "",
        name: "奥斯卡的风景",
        score: 350000
      },
      {
        img: "",
        name: "奥斯卡的风景",
        score: 350000
      },
      {
        img: "",
        name: "奥斯卡的风景",
        score: 350000
      },
      {
        img: "",
        name: "奥斯卡的风景",
        score: 350000
      }
    ]
  },

  bindInfoView() {
    wx.navigateTo({
      url: '/packageB/scoreInfo/scoreInfo',
    })
  },

  detail() {
    wx.navigateTo({
      url: '/packageA/DCTDetail/DCTDetail',
    })
  },

  bindTicketUpload() {
    let that = this;
      wx.chooseImage({
        // count: 1, // 默认9
        // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // var tempFilePaths = res.tempFilePaths
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)


          wx.uploadFile({
            url: 'https://mogao.lianlianchains.com/mogaojava/uploadimage', //仅为示例，非真实的接口地址
            // url: 'https://store.lianlianchains.com/exchange/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'image',
            formData: {
              openid: that.data.openid
            },
            success: function (res) {
              
              console.log(res)

              if (res.statusCode == 200) {

                wx.navigateTo({
                  url: '../analyse/analyse?url=' + res.data,
                })
                
              }

              
            }
          })
        }
      })
  },

  bindAuctionTap() {
    wx.navigateTo({
      url: '../auction/auction',
    })
  },

  getRankList(openid) {
    fetch({
      url: "/mg/query",
      data: {
        fcn:'getRankingAndTopN',
        usr: openid,
        args: [openid,openid,5,'mgcoinpool','mogao']
      },
      method: "POST"
    }).then(res => {
      if(res.code == 0) {
        
        this.setData({
          result: JSON.parse(res.result)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  getOpenid() {
    getOpenid().then(openid => {
      this.updateUserInfo(openid)
      this.getRankList(openid);
      this.setData({
        openid: openid
      })
    })
  },
  updateUserInfo(openid) {
    fetch({
      url: "/mg/invoke",
      data: {
        fcn: 'updateUserInfo',
        usr: openid,
        args: [openid, openid, this.data.userInfo.avatarUrl, this.data.userInfo.nickName]
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      
    }).catch(err => {
      console.log(err)
    })
  },

  socket() {

    var self = this;

    console.log("将要连接服务器。");
    wx.connectSocket({
      url: 'wss://mogao.lianlianchains.com/websocket'
    });

    wx.onSocketOpen(function (res) {
      console.log("连接服务器成功。");
    });

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
      var data = JSON.parse(res.data);
      if (self.data.tuisong == true) {
        self.setData({
          tuisong: false,
          person: data.data + " 上传了一张电影票"
        })
      }else{
        self.setData({
          person: data.data + " 上传了一张电影票"
        })
      }
      
    });
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      console.log("重新连接")
      wx.connectSocket({
        url: 'wss://mogao.lianlianchains.com/websocket',
        fail: function (err) {
          console.log(err)
        }
      });
      wx.onSocketOpen(function (res) {
        console.log("连接服务器成功。");
        self.CodeView(orderNo)
      });
      

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getOpenid();
    this.setData({
      userInfo: getApp().globalData.userInfo
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
    wx.closeSocket();
    this.socket();
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