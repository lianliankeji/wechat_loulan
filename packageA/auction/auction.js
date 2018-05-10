import fetch from "../../utils/fetch.js"
import { duringTime} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        state: 0,
        name: "竞拍"
      },
      {
        state: 1,
        name: "植入"
      },
      {
        state: 2,
        name: "已截止"
      }
    ]
  },

  bindHandleClick(e) {
    console.log(e.target.dataset.state);
    let state = e.target.dataset.state;
    if (state == 0) {
      wx.navigateTo({
        url: '../auctionDetail/auctionDetail?endtime='+ this.data.end
      })
    }
    else if (state == 1) {
      wx.navigateTo({
        url: '../implant/implant'
      })
    }
  },

  getMovieList() {
    fetch({
      url: "/mogaojava/queryvideo",
      data: {

      },
      method: "GET"
    }).then(res => {
      if(res.ec == "000000") {
        this.setData({
          list: res.data
        })
      }
      
    }).catch(err => {
      console.log(err)
    })

    fetch({
      url: "/mogaojava/queryparam",
      data: {

      },
      method: "GET"
    }).then(res => {
      let hour = duringTime() - 0;
      this.setData({
        start: hour + res.data.start + ":00",
        end: hour + res.data.end + ":00"
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList()
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