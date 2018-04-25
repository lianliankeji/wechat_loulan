// packageA/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 5
  },

  plotEvent(e) {
      console.log(e)
  },

  showEvent(e) {
    console.log(e)
  },

  musicEvent(e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ctx = wx.createCanvasContext('myCanvas')
    // ctx.arc(65, 65, 44, 0, 2 * Math.PI)
    // ctx.setFillStyle("red")
    // ctx.fill();
    let baseR = 11;

    ctx.beginPath()
    ctx.arc(65, 65, baseR * 4, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#cccccc")
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(65, 65, baseR * 3, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#cccccc")
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(65, 65, baseR * 2, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#cccccc")
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(65, 65, baseR, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#cccccc")
    ctx.stroke()

    let sqrt3 = Math.sqrt(3);
    let sqrt2 = Math.sqrt(2);

    let plotX = 65 - (baseR * 2 * sqrt3);
    let plotY = baseR * 2 + 20;
    let showX = 130 - plotX;
    let showY = plotY;
    let acoustoAndopticX = 65;
    let acoustoAndopticY = 130 -22;

    let starXR = (baseR/2)* sqrt3;
    let starYR = baseR/2 ;

    let numplot = 3,
      numshow = 4,
      numacoustoAndoptic = 5;

    let starplotX = starXR * (5 - numplot);
    let starplotY = starYR * (5 - numplot);

    let starshowX = starXR * (5 - numshow);
    let starshowY = starYR * (5 - numshow);

    let staracoustoAndopticY = starYR * (5 - numacoustoAndoptic);
    //
    ctx.beginPath()
    ctx.setFillStyle("#FF8201")
    ctx.moveTo(plotX + starplotX, plotY + starplotY)
    ctx.lineTo(showX - starshowX, showY + starshowY)
    ctx.lineTo(acoustoAndopticX, acoustoAndopticY - staracoustoAndopticY)
    ctx.fill()


    ctx.draw()
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