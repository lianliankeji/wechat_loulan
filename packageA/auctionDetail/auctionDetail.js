import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
import { nearTime } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safeMoneys: 1,
    nowPrice: 1,
    minNowPrice: 1,
    nowSelect: "middleprice",
    nowId: "middleopenid",
    nowType: 2,
    safeMoney: 0,
    icon1: "/image/jian1.png",
    icon2: "/image/jia2.png",
    nav: [
      {
        name: "前贴15s",
        select: false
      },
      {
        name: "中段15s",
        select: true
      },
      {
        name: "后贴15s",
        select: false
      }
    ],
    selected: 1
  },

  bindNowInput(e) {
    this.setData({
      nowPrice: Math.max(e.detail.value, this.data.minNowPrice),
      safeMoney: (e.detail.value * 0.1).toFixed(0)
    })
  },

  reduce() {
    this.setData({
      icon1: "/image/jian2.png",
      icon2: "/image/jia1.png",
      nowPrice: Math.max(this.data.nowPrice - 10, this.data.minNowPrice),
      safeMoney: (Math.max(this.data.nowPrice - 10, 0) * 0.1).toFixed(0)
    })
  },

  increase() {
    this.setData({
      icon1: "/image/jian1.png",
      icon2: "/image/jia2.png",
      nowPrice: this.data.nowPrice + 10,
      safeMoney: ((this.data.nowPrice + 10) * 0.1).toFixed(0)
    })
  },

  select(e) {

    let index = e.target.dataset.index;
    if (index != this.data.selected) {
      this.data.nav[index].select = true;
      this.data.nav[this.data.selected].select = false;
    }

    if (index == 0) {
      this.setData({
        nowSelect: "frontprice",
        nowId: "frontopenid",
        nowPrice: Math.max(this.data.info.frontprice, this.data.minNowPrice),
        safeMoney: (this.data.info.frontprice * 0.1).toFixed(0),
        nowType: 1
      })
    }

    if (index == 1) {
      this.setData({
        nowSelect: "middleprice",
        nowId: "middleopenid",
        nowPrice: Math.max(this.data.info.middleprice, this.data.minNowPrice),
        safeMoney: (this.data.info.frontprice * 0.1).toFixed(0),
        nowType: 2
      })
    }

    if (index == 2) {
      this.setData({
        nowSelect: "afterprice",
        nowId: "afteropenid",
        nowPrice: Math.max(this.data.info.afterprice, this.data.minNowPrice),
        safeMoney: (this.data.info.frontprice * 0.1).toFixed(0),
        nowType: 3
      })
    }

    this.setData({
      nav: this.data.nav,
      selected: index
    })

  },

  queryad(params, openid) {
    fetch({
      url: "/mogaojava/queryad",
      data: {
        ...params
      },
      method: "GET"
    }).then(res => {
      this.setData({
        info: res.data,
        nowPrice: Math.max(res.data.middleprice, this.data.minNowPrice)
      })

      if (res.data.frontopenid == "" && res.data.middleopenid == "" && res.data.afteropenid == "") {
        this.setData({
          buttonDisabled: false
        })
      } else {
        if (
            openid == res.data.frontopenid || 
            openid == res.data.middleopenid || 
            openid == res.data.middleopenid
        ) {
            this.setData({
              buttonDisabled: true
            })
        }
        
      }


    }).catch(err => {

      console.log(err)
    })
  },

  querydeposit(e) {
    let oriPrice = this.data.info[this.data.nowSelect];
    let formId = e.detail.formId;

    if (this.data.nowPrice - 0 <= oriPrice - 0 || this.data.nowPrice - 0 <= this.data.minNowPrice - 0 ) {
      wx.showModal({
        content: '竞拍出价要大于当前出价',
        showCancel: false
      })

      return
    }

    fetch({
      url: "/mogaojava/querydeposit",
      // baseUrl: "http://192.168.50.238:9555",
      data: {
        openid: this.data.openid
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(result => {
      console.log(result)
      if(result.data == 0) { //需要交保证金
        this.order(formId);      
      } else if (result.data == 1){ //不用交保证金
        this.saveform(formId);
      }
      // that.requestPayment(result, payMoney);
    }).catch(err => {

    });
  },



  order(formId) {
    
    let pay = this.data.safeMoneys;
    this.prepay(this.data.openid, pay, formId)
  },
  prepay(openId, payMoney, formId) {
    console.log("id" + formId);
    var that = this;
    fetch({
      url: "/mogaojava/prepaydeposit",
      data: {
        'openid': this.data.openid,
        'fee': payMoney,
        'description': "广告竞拍保证金",
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
  sign(prepay_id, payMoney, formId) {
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
  requestPayment: function (obj, payMoney, formId) {
    let self = this;
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': (res) => {
        this.saveform(formId)
      },
      'fail': function (res) {
        console.log('输出失败信息：')
        console.log(res);
        console.log("支付失败")
      }
    })
  },

  saveform(formId) {
    fetch({
      url: "/mogaojava/saveform",
      // baseUrl: "http://192.168.50.238:9555",
      data: {
        openid: this.data.openid,
        formid: formId,
        videoid: this.data.params.videoid
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(result => {
      console.log(result)
      this.bindSubmit();
      // that.requestPayment(result, payMoney);
    }).catch(err => {

    });
  },

  bindSubmit() {
    fetch({
      url: "/mogaojava/auction",
      data: {
        ...this.data.params,
        [this.data.nowSelect]: this.data.nowPrice,
        [this.data.nowId]: this.data.openid,
        'type': this.data.nowType
      },
      method: "POST"
    }).then(res => {

      wx.navigateBack({
        delta: 1
      })

    }).catch(err => {

      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { info, start, end, ...params } = options;

    this.getOpenid(params);

    this.setData({
      name: JSON.parse(info).name,
      image: JSON.parse(info).image,
      params: params,
      start: start,
      end: end,
      rest: nearTime()
    })
    setInterval(() => {
      this.setData({
        rest: nearTime()
      })
    }, 1000)
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
  getOpenid(params) {
    getOpenid().then(openid => {
      this.queryad(params, openid);
      this.setData({
        openid: openid
      })
    })
  },
})