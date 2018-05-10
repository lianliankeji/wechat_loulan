import fetch from "../../utils/fetch.js"
import { getOpenid } from "../../common/js/getOpenid.js"
const app = getApp();

let num = 0;

Page({
  data: {
    videoList: [],
    startX: 0,
    startY: 0,
    bg: "",
    photo: "/image/photo.png",
    search: "/image/search.png",
    praise: "/image/praise.png",
    share: "/image/share.png",
    avatar: "/image/upload.png",
    // praiseNum: 0,
    // shareNum: 0,
    iconlist: ["英雄", "怪兽", "科幻"],
    nowVideonum: 0
  },
  praise() {
    // https://mogao.lianlianchains.com/mogaojava/updatetran
    fetch({
      url: "/mogaojava/updatelike",
      data: {
        id: this.data.videoList[this.data.nowVideonum].id
      },
      method: "POST"
    }).then(res => {
      this.setData({
        praiseNum: this.data.praiseNum += 1
      })
    }).catch(err => {
      console.log(err)
    })
  },
  share() {
    fetch({
      url: "/mogaojava/updatetran",
      data: {
        id: this.data.videoList[this.data.nowVideonum].id
      },
      method: "POST"
    }).then(res => {
      this.data.videoList[this.data.nowVideonum].tran += 1
      this.setData({
        shareNum: this.data.shareNum += 1
      })
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
    if (difY > 0 && Math.abs(difX) <= 40 && Math.abs(difY) >= 40) {
      console.log("上滑")
      num = Math.min(++num, this.data.videoList.length - 1);
      this.setData({
        bg: "https://store.lianlianchains.com/images/" + videoList[num].image,
        description: videoList[num].description,
        name: videoList[num].name,
        nowVideonum: num,
        praiseNum: videoList[num].likes,
        shareNum: videoList[num].tran,
      })
      this.getAvgscore(this.data.videoList[num].id);
      this.getTaglist(this.data.videoList[num].id)
    } else if (difY < 0 && Math.abs(difX) <= 40 && Math.abs(difY) >= 40 && Math.abs(difY) <= 200) {
      console.log("下滑")
      num = Math.max(--num, 0);
      this.setData({
        bg: "https://store.lianlianchains.com/images/" + videoList[num].image,
        description: videoList[num].description,
        name: videoList[num].name,
        nowVideonum: num,
        praiseNum: videoList[num].likes,
        shareNum: videoList[num].tran,
      })
      this.getAvgscore(this.data.videoList[num].id);
      this.getTaglist(this.data.videoList[num].id)
    } else if (difY < 0 && Math.abs(difX) <= 40 &&Math.abs(difY) >= 200) {
      console.log("刷新")
      num = 0;
      this.queryvideo()
    }
    else {
      console.log("非左滑")
    }
  },
  play() {
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
      wx.setStorageSync("videoid", this.data.videoList[this.data.nowVideonum].id)
      wx.navigateTo({
        url: '/packageA/play/play?videoid=' + this.data.videoList[this.data.nowVideonum].id + "&moviesrc=" + this.data.videoList[this.data.nowVideonum].url,
      })
    }
    
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
  aaa(e) {
    console.log(e)
  },
  detail() {

  },
  bindUserTap() {
    wx.navigateTo({
      url: '/packageA/user/user'
    })
  },
  queryvideo() {
    fetch({
      url: "/mogaojava/queryvideo",
      data: {
        
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
      console.log(res)
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
      url: "/mogaojava/querytag",
      data: {
        videoid: videoid
      },
      method: "GET"
    }).then(res => {
      console.log(res)
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
      })
      
      this.getAvgscore(videoid);
      this.getTaglist(videoid)
    }).catch(err => {
      console.log(err)
    })
  },
  getUserInfo(openid) {
    let that = this;
    console.log(111)
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        getApp().globalData.userInfo = userInfo;
        this.setData({
          avatarUrl: avatarUrl
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
          if (response.data.code == 0 && response.data.result == 0) {
            wx.request({
              url: "https://140.143.211.161/mg/register",
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
          } else if (res.code == 0 && res.result == 1) {


          }

        }).catch(err => {
          console.log(err)
        })
      },
      fail: (err) => {
        getApp().globalData.userInfo.nickName = "无昵称";
        getApp().globalData.userInfo.avatarUrl = "";
        wx.request({
          url: "https://140.143.211.161/mg/query",
          data: {
            fcn: 'isAccExists',
            usr: openid,
            args: [openid, openid]
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
          header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header    
          success: (response) => {
            if (response.code == 0 && response.result == 0) {

              wx.request({
                url: "https://140.143.211.161/mg/register",
                data: {
                  fcn: 'account',
                  usr: openid,
                  args: [openid, openid]
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
                header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header    
                success: (register) => {
                  if (register.code == 0 && register.result == 0) {

                  }
                }
              });
            } else if (res.code == 0 && res.result == 1) {


            }
          }
        });
      }
    })
  },
  getOpenid() {
    getOpenid().then(openid => {
      this.getUserInfo(openid);
    })
  },
  onLoad: function (options) {
    this.getOpenid();
    if (options && options.id) {
      this.soureceShare(options.id)
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
