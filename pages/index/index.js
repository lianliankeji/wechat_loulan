import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
const app = getApp();

let num = 0;

Page({
  data: {
    auth: false,
    videoList: [],
    startX: 0,
    startY: 0,
    bg: "",
    photo: "/image/photo.png",
    search: "/image/search.png",
    praise: "/image/praise.png",
    share: "/image/share.png",
    avatar: "/image/upload.png",
    avatarUrl: "/image/user.png",
    // praiseNum: 0,
    // shareNum: 0,
    iconlist: ["英雄", "怪兽", "科幻"],
    nowVideonum: 0
  },

  queryone(id) {
    fetch({
      url: "/mogaojava/queryone",
      data: {
        id: id
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      this.setData({
        praiseNum: res.data.likes,
        shareNum: res.data.tran,
      })
    }).catch(err => {
      console.log(err)
    })
  },

  praise() {
    let id = this.data.videoList[this.data.nowVideonum].id;
    fetch({
      url: "/mogaojava/updatelike",
      data: {
        id: id,
        openid: this.data.openid
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      this.queryone(id)
    
    }).catch(err => {
      console.log(err)
    })
  },
  share() {
    let id = this.data.videoList[this.data.nowVideonum].id;
    fetch({
      url: "/mogaojava/updatetran",
      data: {
        id: id,
        openid: this.data.openid
      },
      method: "POST"
    }).then(res => {
      this.queryone(id)
    }).catch(err => {
      console.log(err)
    })
  },
  bindtouchstart(e) {
    let startX = e.changedTouches[0].clientX;
    let startY = e.changedTouches[0].clientY;
    this.startTime = e.timeStamp;

    this.setData({
      startX: startX,
      startY: startY
    })
  },
  bindtouchend(e) {
    let startX = e.changedTouches[0].clientX;
    let startY = e.changedTouches[0].clientY;
    this.endTime = e.timeStamp;

    let difX = this.data.startX - startX;
    let difY = this.data.startY - startY;

    let videoList = this.data.videoList;

    //如果手指左滑距离大于等于40rpx并且上或者下的差值的绝对值小于20rpx时（精度控制），判断为触发了左滑
    if (difY > 0 && Math.abs(difX) <= 200 && Math.abs(difY) >= 40) {
      // console.log("上滑")
      if (num < this.data.videoList.length - 1) {
        num++
      } else if (num == this.data.videoList.length - 1) {
          num == this.data.videoList.length - 1
          wx.showToast({
            title: '我是有底线的',
            mask: true
          })
      }
      // num = Math.min(++num, this.data.videoList.length - 1);
      
      this.setData({
        bg: "https://store.lianlianchains.com/images/" + videoList[num].image,
        description: videoList[num].description,
        name: videoList[num].name,
        nowVideonum: num,
        praiseNum: videoList[num].likes,
        shareNum: videoList[num].tran,
      });
      this.queryone(this.data.videoList[num].id);
      this.getAvgscore(this.data.videoList[num].id);
      this.getTaglist(this.data.videoList[num].id)
    } else if (difY < 0 && Math.abs(difX) <= 200 && Math.abs(difY) >= 40 && Math.abs(difY) <= 200) {
      // console.log("下滑")
      // num = Math.max(--num, 0);
      if(num > 0) {
        num--
      }else{
        num = 0;
        this.queryvideo();
        return
      }
      this.setData({
        bg: "https://store.lianlianchains.com/images/" + videoList[num].image,
        description: videoList[num].description,
        name: videoList[num].name,
        nowVideonum: num,
        praiseNum: videoList[num].likes,
        shareNum: videoList[num].tran,
      })
      this.queryone(this.data.videoList[num].id);
      this.getAvgscore(this.data.videoList[num].id);
      this.getTaglist(this.data.videoList[num].id)
    } else if (difY < 0 && Math.abs(difX) <= 40 &&Math.abs(difY) >= 200) {
      // console.log("刷新")
      num = 0;
      this.queryvideo()
    }
    else {
      if (this.endTime - this.startTime < 350) {
        console.log("点击")
        let videoid = this.data.videoList[this.data.nowVideonum].id;
        let uploaduser = this.data.videoList[this.data.nowVideonum].uploaduser;
        wx.setStorageSync("videoid", videoid);
        fetch({
          url: '/mogaojava/validate',
          // baseUrl: "http://192.168.50.238:9555",
          data: {
            'id': videoid,
            'openid': this.data.openid
          },
          noLoading: false,
          method: "GET",
          header: { 'content-type': 'application/x-www-form-urlencoded' }
          //  header: { 'content-type': 'application/json' }
        }).then(res => {

          if (res.ec == '000000') {

            if (res.data == '0') {
              wx.navigateTo({
                url: '/packageA/buy/buy?vid=' + videoid + '&up=' + uploaduser,
              })

            }else{
              this.updateplay(videoid);
              wx.navigateTo({
                url: '/packageA/play/play?videoid=' + this.data.videoList[this.data.nowVideonum].id + "&moviesrc=" + this.data.videoList[this.data.nowVideonum].url + "&title=" + this.data.videoList[this.data.nowVideonum].name,
              })
            }
          }


        }).catch(err => {

          console.log("出错了")
          wx.showToast({
            title: '网络繁忙'
          })
          console.log(err)
        })
        
      }
      console.log("非左滑")
    }
  },
  updateplay(videoid) {
    fetch({
      url: "/mogaojava/updateplay",
      data: {
        id: videoid
      },
      method: "POST"
    }).then(res => {
      if(res.ec != "000000") {
        wx.showModal({
          content: '更新播放次数错误',
          showCancel: false
        })
      
      }
    }).catch(err => {
      console.log(err)
    })
  },
  photo() {
    wx.navigateTo({
      url: '/packageA/uploadMovie/uploadMovie',
    })
  },
  bindUserView() {
    wx.navigateTo({
      url: '/packageA/user/user',
    })
  },
  bindWalletView() {
    wx.navigateTo({
      url: '/packageA/wallet/wallet'
    })
  },
  bindUserTap() {
    wx.navigateTo({
      url: '/packageA/user/user'
    })
  },
  queryvideo() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    fetch({
      url: "/mogaojava/queryvideo",
      data: {
        openid: wx.getStorageSync("openidSync")
      },
      method: "GET"
    }).then(res => {
      this.setData({
        videoList: res.data,
        bg: "https://store.lianlianchains.com/images/"+res.data[0].image,
        description: res.data[0].description,
        name: res.data[0].name,
        praiseNum: res.data[0].likes,
        shareNum: res.data[0].tran,
        nowVideonum: 0
      }, () => {
        var timer = setTimeout(() => {
          clearTimeout(timer);
          wx.hideLoading();
        },1000)
      })
      this.getAvgscore(res.data[0].id);
      this.getTaglist(res.data[0].id)
    }).catch(err => {
      console.log(err)
    })

    
  },
  getAvgscore(videoid) {
    fetch({
      url: "/mogaojava/avgscore",
      data: {
        videoid: videoid
      },
      method: "GET"
    }).then(res => {
      if(res.ec == "000000") {
        this.setData({
          score: res.data.toFixed(1)
        })
      }

    }).catch(err => {
      console.log(err)
    })
  },
  getTaglist(videoid) {
    fetch({
      url: "/mogaojava/querytagfour",
      data: {
        videoid: videoid
      },
      method: "GET"
    }).then(res => {
      if (res.ec == "000000") {
        this.setData({
          iconlist: res.data
        })
      }

    }).catch(err => {
      console.log(err)
    })
  },
  soureceShare(videoid) {
    fetch({
      url: "/mogaojava/queryvideo",
      data: {
        openid: wx.getStorageSync("openidSync")
      },
      method: "GET"
    }).then(res => {

      res.data.map((item, index) => {
        if (item.id == videoid) {
          this.setData({
            videoList: res.data,
            bg: "http://store.lianlianchains.com/images/" + res.data[index].image,
            description: res.data[index].description,
            name: res.data[index].name,
            praiseNum: res.data[index].likes,
            shareNum: res.data[index].tran,
            nowVideonum:index
          })
        }
      },() => {
        console.log(this.data.bg)
      })
      
      this.getAvgscore(videoid);
      this.getTaglist(videoid)
    }).catch(err => {
      console.log(err)
    })
  },
  getUserInfo(e) {
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok"){
      let data = JSON.parse(e.detail.rawData);
      this.setData({
        avatarUrl: data.avatarUrl
      })
      getApp().globalData.userInfo = data;
      this.bindWalletView();
    }

    


  },
  getUserAccount(openid) {
    let that = this;

    let avatarUrl = "";
    let nickName = "";

    wx.getSetting({
      success(res) {
        if (!!res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              getApp().globalData.userInfo = res.userInfo;
              that.setData({
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
    
    fetch({
      url: "/mg/query",
      data: {
        fcn: 'isAccExists',
        usr: openid,
        args: [openid, openid]
      },
      method: "POST"
    }).then(response => {
      if (response.code == 0 && response.result == 0) {
        wx.request({
          url: "https://mogao.lianlianchains.com/mg/register",
          data: {
            fcn: 'account',
            usr: openid,
            args: [openid, openid, avatarUrl, nickName]
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
          header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header    
          success: (register) => {

          }
        });
      } else if (response.code == 0 && response.result == 1) {


      }

    }).catch(err => {
      console.log(err)
    })
  },
  getOpenid() {
    getOpenid().then(openid => {
      this.getUserAccount(openid);
      this.setData({
        openid: openid
      })
    })
  },
  onLoad: function (options) {
    this.getOpenid();
    if (options && options.id) {
      this.soureceShare(options.id)
      this.getOpenid();
      return
    }
    num = 0;
    
    this.queryvideo();
  },
  onShow: function () {
    
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    let id = this.data.videoList[this.data.nowVideonum].id
    
    return {
      title: this.data.name,
      path: '/pages/index/index?id=' + id,
      success: (res) => {
        // 转发成功
        this.share(id)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
