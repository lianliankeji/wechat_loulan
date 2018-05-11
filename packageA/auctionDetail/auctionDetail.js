import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safeMoneys:500,
    nowPrice:0,
    nowSelect: "middleprice",
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
      nowPrice: e.detail.value,
      safeMoney: (e.detail.value * 0.1).toFixed(0)
    })
  },

  reduce() {
    this.setData({
      icon1: "/image/jian2.png",
      icon2: "/image/jia1.png",
      nowPrice: Math.max(this.data.nowPrice - 10, 0),
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
        nowPrice: this.data.info.frontprice,
        safeMoney: (this.data.info.frontprice * 0.1).toFixed(0)
      })
    }

    if (index == 1) {
      this.setData({
        nowSelect: "middleprice",
        nowId: "middleopenid",
        nowPrice: this.data.info.middleprice,
        safeMoney: (this.data.info.frontprice * 0.1).toFixed(0)
      })
    }

    if (index == 2) {
      this.setData({
        nowSelect: "afterprice",
        nowId: "afteropenid",
        nowPrice: this.data.info.afterprice,
        safeMoney: (this.data.info.frontprice * 0.1).toFixed(0)
      })
    }

    this.setData({
      nav: this.data.nav,
      selected: index
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
        info: res.data,
        nowPrice: res.data.middleprice
      })


    }).catch(err => {
      
      console.log(err)
    })
  },

  bindSubmit() {
      fetch({
        url: "/mogaojava/auction",
        data: {
          ...this.data.params,
          [this.data.nowSelect]: this.data.nowPrice,
          [this.data.nowId]: this.data.openid
        },
        method: "POST"
      }).then(res => {

        wx.navigateBack({
          delta:1
        })

      }).catch(err => {

        console.log(err)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { info, ...params } = options;
    this.queryad(params);
    this.getOpenid();
    this.setData({
      info: JSON.parse(info),
      params: params
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
    getOpenid().then(openid => {
      this.setData({
        openid: openid
      })
    })
  },
})