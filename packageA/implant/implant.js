import { uploadVedio } from "../../utils/upload.js"
import { getOpenid } from "../../common/js/getOpenid.js"
import fetch from "../../utils/fetch.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    buttonDisabled: true,
    skipUrl: ""
  },

  skipinput(e) {

    console.log(e)
    this.setData({
      skipUrl: e.detail.value
    })
  },

  addmovie() {
    let openid = this.data.openid;
    uploadVedio().then(res => {
      console.log(res.tempFilePath);
      this.setData({
        show: false
      })


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
                show: true
              },() => {
                this.setData({
                  buttonDisabled: false
                })
              })

              

            }
          }
        })

        uploadTask.onProgressUpdate((res) => {

          this.setData({
            progress: res.progress,
          })

          if (res.progress == "100") {
            setTimeout(() => {
              this.setData({
                reupshow: true,
                hiddenPro: true
              })
            }, 1000)

          }

          console.log('上传进度', res.progress)
          // console.log('已经上传的数据长度', res.totalBytesSent)
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })


    })
  },

  getOpenid() {
    getOpenid().then(openid => {
      this.setData({
        openid: openid
      })
    })
  },

  queryad(params) {
    fetch({
      url: "/mogaojava/queryad",
      data: {
        ...params
      },
      method: "GET"
    }).then(res => {
      
      this.setData({
        info: res.data
      })
      if (res.data.frontopenid != "" ) {
        this.setData({
          price: res.data.frontprice,
          url: "front",
          skipurl: "fronturl",
          nowType: 1,
          which: "前贴15s"
        })
        return
      }
      if (res.data.middleopenid != "" ) {
        this.setData({
          price: res.data.middleprice,
          url: "middle",
          skipurl: "middleurl",
          nowType: 2,
          which: "中段15s"
        })

        return
      }
      if (res.data.afteropenid != "") {
        this.setData({
          price: res.data.afterprice,
          url: "after",
          skipurl: "afterurl",
          nowType: 3,
          which: "后贴15s"
        })

        return
      }

    }).catch(err => {

      console.log(err)
    })
  },

  order() {
    if(this.data.skipUrl == "") {
      wx.showModal({
        content: '跳转链接不能为空',
        showCancel:false
      })

      return
    }
    let pay = this.data.price;
    this.prepay(this.data.openid, pay)
  },
  prepay(openId, payMoney) {
    console.log("支付钱数：" + payMoney);
    var that = this;
    fetch({
      url: "/mogaojava/prepay",
      // baseUrl: "http://192.168.50.238:9555",
      data: {
        'openid': this.data.openid,
        'fee': payMoney,
        'description': "广告竞拍",
        'usedScore': 0,
        'mch_id': "",
        'storeid': "",
        'bonusScore': 0
      },
      method: "POST",
    }).then(result => {
      console.log(result);
      if (result.returncode) {
        wx.showModal({
          content: result.returnmsg,
        })
        // wx.showToast({
        //   title: result.returnmsg,
        // })
        return
      }
      var prepay_id = result.prepay_id;
      that.sign(prepay_id, payMoney);
    }).catch(err => {

    });
  },
  //签名
  sign(prepay_id, payMoney) {
    console.log("支付钱数：" + payMoney);
    var that = this;
    fetch({
      url: "/mogaojava/sign",
      // baseUrl: "http://192.168.50.238:9555",
      data: {
        'repay_id': prepay_id
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(result => {
      console.log(result)
      that.requestPayment(result, payMoney);
    }).catch(err => {

    });
  },
  //申请支付
  requestPayment: function (obj, payMoney) {
    let self = this;
    console.log("支付钱数：" + payMoney);
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': (res) => {
        this.placement()
      },
      'fail': function (res) {
        console.log('输出失败信息：')
        console.log(res);
        console.log("支付失败")
      }
    })
  },

  placement() {
    // if (this.data.skipUrl == "") {
    //   wx.showModal({
    //     content: '跳转链接不能为空',
    //     showCancel: false
    //   })

    //   return
    // }
    fetch({
      url: "/mogaojava/placement",
      data: {
        ...this.data.params,
        'type': this.data.nowType,
        [this.data.url]: this.data.videosrc,
        [this.data.skipurl]: this.data.skipUrl
      },
      method: "post"
    }).then(res => {
      if(res.ec == "000000") {
        wx.navigateBack({
          delta: 1
        })
      }
    }).catch(err => {

      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { info, start, end, ...params } = options;
    this.getOpenid();
    this.queryad(params);
    this.setData({
      name: JSON.parse(info).name,
      image: JSON.parse(info).image,
      params: params,
      endtime: new Date().getHours() + 1 + ":00",
      start: options.start,
      end: options.end
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