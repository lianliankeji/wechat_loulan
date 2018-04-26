// packageA/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 5,
    numplot: 5,
    numshow: 5,
    numacoustoAndoptic: 5,
    iconTypeList: [
      {
        def: "/image/year.png",
        act: "/image/yearAct.png",
        active: false
      },
      {
        def: "/image/types.png",
        act: "/image/typesAct.png",
        active: false
      },
      {
        def: "/image/actor.png",
        act: "/image/actorAct.png",
        active: false
      },
      {
        def: "/image/area.png",
        act: "/image/areaAct.png",
        active: false
      },
      {
        def: "/image/class.png",
        act: "/image/classAct.png",
        active: false
      }
    ],
    iconlist: []
  },

  plotEvent(e) {
    console.log(e)
    this.setData({
      numplot: e.detail.choose + 1
    })

    this.initCanvas()
  },

  showEvent(e) {
    console.log(e)
    this.setData({
      numshow: e.detail.choose + 1
    })

    this.initCanvas()
  },

  musicEvent(e) {
    console.log(e)
    this.setData({
      numacoustoAndoptic: e.detail.choose + 1
    })

    this.initCanvas()
  },

  selectIcon(e) {
    let index = e.target.dataset.index;

    this.data.iconTypeList.map((item, i) => {
      if(index == i) {
        this.data.iconTypeList[i].active = !this.data.iconTypeList[i].active;
      }else{
        this.data.iconTypeList[i].active = false;
      }
      this.setData({
        iconTypeList: this.data.iconTypeList
      })
    })
    
    
  },

  input(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  addIcon(e) {
    if (this.data.iconlist.length > 4) {
      wx.showModal({
        content: '标签数量不能超过5个',
        showCancel: false
      })

      return
    }
    this.data.iconlist.push({ name: e.detail.value })
    this.setData({
      iconlist: this.data.iconlist,
      inputValue: ""
    })
  },

  addIcontap() {
    console.log(this.data.iconlist.length)
    if (this.data.iconlist.length  > 4) {
      wx.showModal({
        content: '标签数量不能超过5个',
        showCancel: false
      })

      return
    }
    this.data.iconlist.push({ name: this.data.inputValue })
    this.setData({
      iconlist: this.data.iconlist,
      inputValue: ""
    })
  },

  delete(e) {
    let index = e.target.dataset.index;
    

    wx.showModal({
      content: '确认删除该标签？',
      success: (res) => {
        if (res.confirm) {
          let data = this.data.iconlist.filter((item, i) => {
            return index != i;
          });

          this.setData({
            iconlist: data
          })
        } 
      }
    })
    
  },

  initCanvas() {
    
    const ctx = wx.createCanvasContext('myCanvas')
    // ctx.arc(65, 65, 44, 0, 2 * Math.PI)
    // ctx.setFillStyle("red")
    // ctx.fill();
    let baseR = 11;
    let numplot = this.data.numplot,
      numshow = this.data.numshow,
      numacoustoAndoptic = this.data.numacoustoAndoptic;

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
    let acoustoAndopticY = 130 - 22;

    let starXR = (baseR / 2) * sqrt3;
    let starYR = baseR/2;
    let opticYR = baseR;



    let starplotX = starXR * (5 - numplot);
    let starplotY = starYR * (5 - numplot);

    let starshowX = starXR * (5 - numshow);
    let starshowY = starYR * (5 - numshow);

    let staracoustoAndopticY = opticYR * (5 - numacoustoAndoptic);
    //
    ctx.beginPath()
    ctx.setFillStyle("#FF8201")
    ctx.moveTo(plotX + starplotX, plotY + starplotY)
    ctx.lineTo(showX - starshowX, showY + starshowY)
    ctx.lineTo(acoustoAndopticX, acoustoAndopticY - staracoustoAndopticY)
    ctx.setGlobalAlpha(0.7)
    ctx.fill()


    ctx.draw()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCanvas();
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