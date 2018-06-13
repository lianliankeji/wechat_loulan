import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
import { formatTime} from "../../utils/util.js"

let start = 1;
let num = 20;
let total = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true
  },

  loadMore() {
    fetch({
      url: "/mg/query",
      data: {
        fcn: "getTransInfo",
        usr: this.data.openid,
        args: [this.data.openid, this.data.openid, start, num, "mogao"]
      },
      method: "post"
    }).then(res => {
      if (res.code == 0) {
        let data = JSON.parse(res.result).records;
        start = JSON.parse(res.result).nextser;
        console.log(data.length)
        if(0 < data.length < 20) {
          data.map(item => {
            item.time = formatTime(new Date(item.time))
          })
          this.setData({
            list: [...this.data.list, ...data]
          })
        }else{
          data.map(item => {
            item.time = formatTime(new Date(item.time))
          })
          this.setData({
            list: [...this.data.list, ...data]
          })
        }
        
      }
    }).catch(err => {

      console.log(err)
    })

  },

  querylist(openid) {
    fetch({
      url: "/mg/query",
      data: {
        fcn: "getTransInfo",
        usr: openid,
        args: [openid, openid, 1, num, "mogao"]
      },
      method: "post"
    }).then(res => {
      if (res.code == 0) {
        let data = JSON.parse(res.result).records;
        start = JSON.parse(res.result).nextser;
        total = JSON.parse(res.result).maxser;
        data.map(item => {
          item.time = formatTime(new Date(item.time))
        })
        this.setData({
          list: data
        })
      }
    }).catch(err => {

      console.log(err)
    })
  },

  getOpenid() {
    getOpenid().then(openid => {
      this.querylist(openid)
      this.setData({
        openid: openid
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
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
    if (total - start  > 20) {
      this.loadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})