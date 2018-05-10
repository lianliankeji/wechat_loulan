// packageA/auctionDetail/auctionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  reduce() {
    this.setData({
      icon1: "/image/jian2.png",
      icon2: "/image/jia1.png"
    })
  },

  increase() {
    this.setData({
      icon1: "/image/jian1.png",
      icon2: "/image/jia2.png"
    })
  },

  select(e) {
    
    let index = e.target.dataset.index;
    if (index != this.data.selected) {
      this.data.nav[index].select = true;
      this.data.nav[this.data.selected].select = false;
    }

    this.setData({
      nav: this.data.nav,
      selected: index
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