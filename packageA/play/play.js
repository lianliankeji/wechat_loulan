import fetch from "../../utils/fetch.js"
import {getOpenid} from "../../common/js/getOpenid.js"

let frontadplay = false;
let middleadplay = false;
let afteradplay = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreAction: false,
    noFullScreen: false,
    transScore: 1,
    transScore: 2,
    adplay: false,
    vhidden: true,
    hidden: false,
    total: 5,
    evaluateLevel: {
      1: "差",
      2: "较差",
      3: "中",
      4: "较好",
      5: "好"
    },
    numplot: 0,
    numshow: 0,
    numacoustoAndoptic: 0,
    iconlist: []
  },

  webpageskip() {
    console.log(111)

    wx.navigateTo({
      url: '/packageA/webpage/webpage?weburl=' + "https://www.baidu.com",
    })
  },

  //积分奖励
  transform() {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mg/invoke",
      data: {
        fcn: "transefer",
        usr: "mgcoinpool",
        args: ["mgcoinpool", "mgcoinpool", this.data.openid, this.data.transScore, "mogao", "广告播放", 8]
      },
      method: "POST"
    }).then(res => {


    }).catch(err => {
      console.log(err)
    })
  },

  currentProgress(e) {
    let current = e.detail.currentTime;
    let duration = e.detail.duration;

    let percent = (current / duration).toFixed(2);
    if (percent >= 0 && frontadplay == true) {
      this.videoContext.pause();
      this.transform();
      console.log(this.data.front)
      this.setData({
        vhidden: false,
        adplay: true,
        adsrc: this.data.front,
        weburl: this.data.fronturl,
        nowDur: 0
      })
    }
    if (percent >= 0.5 && middleadplay == true) {
      this.videoContext.pause();
      this.transform();
      this.setData({
        vhidden: false,
        adplay: true,
        adsrc: this.data.middle,
        weburl: this.data.middleurl,
        nowDur: 1
      }, () => {
        this.adContext.play();
      })
    }
    
  },

  bindVideoEnd() {
    if (afteradplay == true) {
      this.videoContext.pause();
      
      this.transform();
      this.setData({
        vhidden: false,
        adplay: true,
        adsrc: this.data.after,
        weburl: this.data.afterurl,
        nowDur: 2,
        hidden: false
      },() => {
        this.adContext.play();
      })
    }else{
      this.setData({
        hidden: false
      })
    }
  },

  bindAdEnd() {
    this.setData({
      vhidden: true,
      adplay: false
    }, () => {
      if (this.data.nowDur == 0) {
        frontadplay = false;
      } else if (this.data.nowDur == 1) {
        middleadplay = false;
      } else {
        afteradplay = false;
      }

      this.videoContext.play();
    })
  },

  fullscreen(e) {
    // console.log("fullscreen", e.detail.fullScreen )
    let IsfullScreen = e.detail.fullScreen;
    if (IsfullScreen == true) {
      this.setData({
        hidden:true
      })
    }else{
      this.setData({
        hidden: false
      })
    }
  },

  plotEvent(e) {
      console.log(e)
      this.setData({
        numplot: e.detail.choose + 1,
        scoreAction: true
      })

      this.initCanvas()
  },

  showEvent(e) {
    console.log(e)
    this.setData({
      numshow: e.detail.choose + 1,
      scoreAction: true
    })

    this.initCanvas()
  },

  musicEvent(e) {
    console.log(e)
    this.setData({
      numacoustoAndoptic: e.detail.choose + 1,
      scoreAction: true
    })

    this.initCanvas()
  },

  selectIcon(e) {
    let index = e.target.dataset.index;
    let item = this.data.iconlist[index];
    // this.data.iconlist[index].active = !this.data.iconlist[index].active;
    if (this.data.iconlist[index].active == false) {
      this.savetag(item);
      this.data.iconlist[index].active = true;
    }
    
    this.setData({
      iconlist: this.data.iconlist,
      lable:true
    })
  },

  savetag(item, active) {
    fetch({
      url: "/mogaojava/savetag",
      data: {
        openid: this.data.openid, 
        videoid: item.videoid, 
        tag: item.tag, 
        tagtype: item.tagtype
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      if (res.ec == "000000") {
        let data = res.data.map((item, index) => {
          return Object.assign({}, item, { active: false })
        })

        this.setData({
          iconlist: data
        })
      }

    }).catch(err => {
      console.log(err)
    })
  },

  initMovie(url) {
    this.setData({
      moviesrc: url
    })
  },

  initplay(videoid) {
    this.setData({
      videoid: videoid
    })
    fetch({
      url: "/mogaojava/querytag",
      data: {
        videoid: videoid
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      if(res.ec == "000000") {
        let data = res.data.map((item,index) => {
          return Object.assign({},item, {active: false})
        })

        this.setData({
          iconlist: data,
          videoid: videoid
        })
      }

    }).catch(err => {
      console.log(err)
    })

  },

  queryplayad(videoid) {
    fetch({
      url: "/mogaojava/queryplayad",
      data: {
        videoid: videoid
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      if(!!res.data) {
        this.setData({
          fronturl: res.data.fronturl,
          middleurl: res.data.middleurl,
          afterurl: res.data.afterurl
        })
      }
      
      if (res.data && res.data.front != "") {
        frontadplay = true;
        this.setData({
          front: res.data.front
        }) 
      }
      if (res.data && res.data.middle != "") {
        middleadplay = true;
        this.setData({
          middle: res.data.middle
        }) 
      }
      if (res.data && res.data.after != "") {
        afteradplay = true;
        this.setData({
          after: res.data.after
        }) 
      }
      // if (!!res.data) {
      //   this.setData({
      //     front: res.data.front,
      //     middle: res.data.middle,
      //     after: res.data.after
      //   }) 
      // }
         

    }).catch(err => {
      console.log(err)
    })
  },

  initStar() {
    let videoid = this.data.videoid
    
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

  getOpenid() {
    getOpenid().then(openid => {
      this.setData({
        openid: openid
      }, () => {
        this.transform(openid); //积分奖励
      })
    })
  },
  //积分奖励
  transform(openid) {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mg/invoke",
      data: {
        fcn: "transefer",
        usr: "mgcoinpool",
        args: ["mgcoinpool", "mgcoinpool", openid, this.data.transScore, "mogao", "观看影片", 2]
      },
      method: "POST"
    }).then(res => {


    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    frontadplay = false;
    middleadplay = false;
    afteradplay = false;

    this.getOpenid();
    this.initMovie(options.moviesrc);
    this.initplay(options.videoid);
    this.queryplayad(options.videoid);
    this.initCanvas();
    wx.setNavigationBarTitle({
      title: options.title
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
    this.adContext = wx.createVideoContext('myVideoad');
    // this.videoContext.requestFullScreen()
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

  transeval() {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mg/invoke",
      data: {
        fcn: "transefer",
        usr: "mgcoinpool",
        args: ["mgcoinpool", "mgcoinpool", this.data.openid, 1, "mogao", "评分奖励", 3]
      },
      method: "POST"
    }).then(res => {


    }).catch(err => {
      console.log(err)
    })
  },
  translabel() {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mg/invoke",
      data: {
        fcn: "transefer",
        usr: "mgcoinpool",
        args: ["mgcoinpool", "mgcoinpool", this.data.openid, 1, "mogao", "标签奖励", 4]
      },
      method: "POST"
    }).then(res => {


    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.scoreAction == true) {
      this.transeval();
    }
    
    if (this.data.label == true) {
      this.translabel();
    }
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
    }).catch(err => {
      console.log(err)
    })
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