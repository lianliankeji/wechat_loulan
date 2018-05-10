import fetch from "../../utils/fetch.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: "1983",
    total: 5,
    numplot: 5,
    numshow: 5,
    numacoustoAndoptic: 5,
    evaluateLevel: {
      1: "差",
      2: "较差",
      3: "中",
      4: "较好",
      5: "好"
    },
    iconTypeJson: {
      "0": "yearbg.png",
      "1": "typesbg.png",
      "2": "actorbg.png",
      "3": "areabg.png",
      "4": "classbg.png"
    },
    nowType: "0",
    iconTypeList: [
      {
        def: "/image/year.png",
        act: "/image/yearAct.png",
        types: "0",
        placeholder: "1983",
        active: true
      },
      {
        def: "/image/types.png",
        act: "/image/typesAct.png",
        types: "1",
        placeholder: "爱情",
        active: false
      },
      {
        def: "/image/actor.png",
        act: "/image/actorAct.png",
        types: "2",
        placeholder: "巨石强森",
        active: false
      },
      {
        def: "/image/area.png",
        act: "/image/areaAct.png",
        types: "3",
        placeholder: "美国",
        active: false
      },
      {
        def: "/image/class.png",
        act: "/image/classAct.png",
        types: "4",
        placeholder: "一级",
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

  savescore() {
    fetch({
      url: "/mogaojava/savescore",
      data: {
        openid: this.data.openid,
        videoid: this.data.videoid,
        story: this.data.numplot, 
        act: this.data.numshow,
        sound: this.data.numacoustoAndoptic,
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      if(res.ec == "000000") {
        wx.navigateBack({
          delta: 3
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  selectIcon(e) {
    let index = e.target.dataset.index;
    let types = e.target.dataset.types;
    let placeholder = e.target.dataset.placeholder;

    this.data.iconTypeList.map((item, i) => {
      if (index == i) {
        this.data.iconTypeList[i].active = true;
      } else {
        this.data.iconTypeList[i].active = false;
      }
      this.setData({
        nowType: types,
        iconTypeList: this.data.iconTypeList,
        placeholder: placeholder
      })
    })


  },

  input(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  addIcon(e) {
    let name = e.detail.value;
    let tagtype = this.data.nowType;

    if (this.data.iconlist.length > 4) {
      wx.showModal({
        content: '标签数量不能超过5个',
        showCancel: false
      })

      return
    }
    console.log(this.data.iconTypeJson[this.data.nowType])
    this.data.iconlist.push({ name: name, bg: this.data.iconTypeJson[tagtype], tagtype: tagtype })
    this.setData({
      iconlist: this.data.iconlist,
      inputValue: ""
    }, () => {
      this.savetag(name, tagtype)
    })
  },

  addIcontap() {

    let name = this.data.inputValue;
    let tagtype = this.data.nowType;

    if (this.data.iconlist.length > 4) {
      wx.showModal({
        content: '标签数量不能超过5个',
        showCancel: false
      })

      return
    }
    this.data.iconlist.push({ name: name, bg: this.data.iconTypeJson[tagtype], tagtype: tagtype })
    this.setData({
      iconlist: this.data.iconlist,
      inputValue: ""
    }, () => {
      this.savetag(name, tagtype)
    })
  },

  savetag(name, tagtype) {
    fetch({
      url: "/mogaojava/savetag",
      data: {
        openid: this.data.openid,
        videoid: this.data.videoid,
        tag: name,
        tagtype: tagtype
      },
      method: "POST"
    }).then(res => {
      console.log(res)


    }).catch(err => {
      console.log(err)
    })
  },

  deletetag(name, tagtype) {
    fetch({
      url: "/mogaojava/deletetag",
      data: {
        openid: this.data.openid,
        videoid: this.data.videoid,
        tag: name,
        tagtype: tagtype
      },
      method: "POST"
    }).then(res => {
      console.log(res)


    }).catch(err => {
      console.log(err)
    })
  },

  deletes(e) {
    let index = e.target.dataset.index;
    let name, tagtype;


    wx.showModal({
      content: '确认删除该标签？',
      success: (res) => {
        if (res.confirm) {
          let data = this.data.iconlist.filter((item, i) => {
            name = item.name;
            tagtype = item.tagtype
            return index != i;
          });

          this.setData({
            iconlist: data
          }, () => {
            console.log(111)
            this.deletetag(name, tagtype)
          })
        }
      }
    })

  },

  next() {
    if(this.data.iconlist.length > 0) {
      this.savescore();
    }else{
      wx.showModal({
        showCancel: false,
        content: '请先为您上传的视频打上标签',
        confirmText: "知道了"
      })
    }
    
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
    let starYR = baseR / 2;
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
    this.setData({
      videoid: options.videoid
    })
    this.initCanvas();
    this.getOpenid().then(openid => {
      this.setData({
        openid: openid
      })
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

  getOpenid() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          resolve(res.data)
        }
      })
    })
  }
})