import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
import { duringTime, nearTime } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagMap: {
      "0": "竞拍",
      "1": "已截止",
      "2": "植入"
    }
  },

  startAuction(videoid, info) {
    let now = this.data.data.now;
    fetch({
      url: "/mogaojava/startauction",
      data: {
        videoid: videoid,
        starttime: now.substr(0, now.length - 2) + this.data.startHour,
        endtime: now.substr(0, now.length - 2) + this.data.endHour
      },
      method: "POST"
    }).then(res => {
      wx.navigateTo({
        url: '../auctionDetail/auctionDetail?videoid=' + videoid + "&starttime=" + res.data.starttime + "&endtime=" + res.data.endtime + "&info=" + info + "&start=" + this.data.start + "&end=" + this.data.end 
      })
      

    }).catch(err => {
      console.log(err)
    })
  },

  startImplant(videoid, info) {
    let now = this.data.data.now;
    let starttime = now.substr(0, now.length - 2) + this.data.startHour;
    let endtime = now.substr(0, now.length - 2) + this.data.endHour;
    wx.navigateTo({
      url: '../implant/implant?videoid=' + videoid + "&starttime=" + starttime + "&endtime=" + endtime + "&info=" + info + "&start=" + this.data.start + "&end=" + this.data.end 
    })
  },

  bindHandleClick(e) {
    let state = e.target.dataset.flag;
    let info = e.target.dataset.iteminfo;
    let videoid = e.target.dataset.videoid;
    if (state == 0) {
      this.startAuction(videoid, JSON.stringify(info));

    }
    else if (state == 2) {
      this.startImplant(videoid, JSON.stringify(info));
    }
  },



  getMovieList(openid) {
    fetch({
      url: "/mogaojava/querybyplaytime",
      data: {
        openid: openid
      },
      method: "GET"
    }).then(res => {
      if (res.ec == "000000") {
        this._duringView(res.data.now, res.data.start, res.data.end)
        this.setData({
          data: res.data
        })
      }

    }).catch(err => {
      console.log(err)
    })
  },

  getOpenid(url) {
    getOpenid().then(openid => {
      this.getMovieList(openid)
      this.setData({
        openid: openid
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
    this.getOpenid();

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
  //内部计算
  _duringView(now, start, end) {
    let startH = now.substr(now.length - 2) - 0 + start + ":00";
    let endH = now.substr(now.length - 2) - 0 + end + ":00";

    this.setData({
      start: startH,
      end: endH,
      startHour: now.substr(now.length - 2) - 0 + start + "00",
      endHour: now.substr(now.length - 2) - 0 + end + "00"
    })

    console.log(startH, endH)
  }
})