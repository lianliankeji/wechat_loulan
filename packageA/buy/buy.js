// pages/buy/buy.js
import fetch from '../../utils/fetch.js';
import {getOpenid} from "../../common/js/getOpenid.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transScore:10,
    codestate: "发 送",
    smsCode: '',
    smsBtn: false,
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)

    var that = this
    if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {

      wx.request({
        url: 'https://store.lianlianchains.com/video/wx/decodePhone/',
        data: {
          openid: wx.getStorageSync('user').openid,
          session_key: wx.getStorageSync('user').session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: 'GET',
        success: function (secr) {
          console.log(secr);

          that.setData({
            mobile: secr.data.ret.phone
          })

        }
      });

    }
  },

  phoneInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  sendMsg() {
    if (this.data.mobile) {
      this.sendSms();
    } else {
      wx.showModal({
        content: '请输入手机号',
        showCancel: false,
        confirmColor: '#DDBF90'
      });
      return;
    }

    let num = 60;

    var timer = setInterval(() => {
      if (num === 1) {
        this.setData({
          codestate: '重新发送',
          smsBtn: false
        });
        clearInterval(timer);
      } else {
        num--;
        this.setData({
          codestate: num + ' s',
          smsBtn: true
        });
      }
    }, 1000);
  },

  sendSms() {
    fetch({
      url: "/mogaojava/sms/send",
      //   baseUrl: "http://192.168.50.57:9888",
      // baseUrl: "https://store.lianlianchains.com",
      data: {
        mobile: this.data.mobile
      },
      noLoading: true,
      method: "GET",
      //   header: { 'content-type': 'application/x-www-form-urlencoded' }
      header: { 'content-type': 'application/json' }
    }).then(result => {
      if (result.code != 200) {
        wx.showToast({
          title: '发送密码失败'
        })

      } else {

      }
    }).catch(err => {
      console.log(err)
    });
  },

  smsInput(e) {
    this.setData({
      smsCode: e.detail.value
    });
  },

  checkSms() {
    fetch({
      url: "/mogaojava/sms/verify",
      //   baseUrl: "http://192.168.50.57:9888",
      // baseUrl: "https://store.lianlianchains.com",
      data: {
        mobile: this.data.mobile,
        code: this.data.smsCode,
      },
      noLoading: true,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' } 
      // header: { 'content-type': 'application/json' }
    }).then(result => {
      if (result.code == 200) {
        this.buy();
      } else {
        wx.showToast({
          title: '验证码错误',
          duration: 1500
        })
      }
    }).catch(err => {
      console.log("出错了")
      console.log(err)

    });
  },

  precheck() {
    if (!this.data.mobile) {
      wx.showModal({
        content: '请输入手机号',
        showCancel: false,
        confirmColor: '#DDBF90'
      });
      return;
    }
    if (!this.data.smsCode) {
      wx.showModal({
        content: '请输入验证码',
        showCancel: false,
        confirmColor: '#DDBF90'
      });

      return;
    }
    this.checkSms();
  },

  buy() {
    wx.showLoading({
      title: '正在购买',
    })

    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mg/invoke",
      data: {
        fcn: "transefer",
        usr: this.data.openid,
        args: [this.data.openid, this.data.openid, "mgcoinpool", this.data.transScore, "mogao", "影片购买", 9]
      },
      method: "POST"
    }).then(res => {

      console.log(res.code)
      if(res.code == 0) {
        this.javabuy();
      } else if (res.code == 10001) {
        wx.showToast({
          title: '付款账号不存在'
        })
      } else if (res.code == 10002) {
        wx.showToast({
          title: '收款账号不存在'
        })
      } else if (res.code == 10003) {
        wx.showToast({
          title: '账号余额不足'
        })
      } else if (res.code == 10004) {
        wx.showToast({
          title: '密码错误'
        })
      } else if (res.code == 10005) {
        wx.showToast({
          title: '转账金额不合法'
        })
      } else if (res.code == 10006) {
        wx.showToast({
          title: '锁定部分余额导致余额不足'
        })
      }

      

    }).catch(err => {
      console.log(err)
    })
    
  
    
  },

  javabuy(){
    fetch({
      url: "/mogaojava/buy",
      // baseUrl: "http://192.168.50.238:9555",
      data: {
        id: this.data.vid,
        openid: this.data.openid
      },
      method: "POST"
    }).then(res => {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })

    }).catch(err => {
      console.log(err)
    })
  },

  getOpenid() {
    getOpenid().then(openid => {
      this.setData({
        openid: openid
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      vid:options.vid,
      up: options.up
    })
    this.getOpenid();

    // this.data.vid = options.vid
    // this.data.up = options.up
    // this.data.amt = 10
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