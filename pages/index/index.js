import fetch from "../../utils/fetch.js"
const app = getApp();

Page({
  data: {
    startX: 0,
    startY: 0,
    bg: "/image/homebg.png",
    photo: "/image/photo.png",
    search: "/image/search.png",
    praise: "/image/praise.png",
    share: "/image/share.png",
    avatar: "/image/upload.png",
    praiseNum: 234,
    shareNum: 456,
    iconlist: ["英雄", "怪兽", "科幻"]
  },
  bindtouchstart(e) {
    let startX = e.changedTouches[0].clientX;
    let startY = e.changedTouches[0].clientY;

    this.setData({
      startX: startX,
      startY: startY
    })
  },
  bindtouchend(e) {
    let startX = e.changedTouches[0].clientX;
    let startY = e.changedTouches[0].clientY;

    let difX = this.data.startX - startX;
    let difY = this.data.startY - startY;

    //如果手指左滑距离大于等于40rpx并且上或者下的差值的绝对值小于20rpx时（精度控制），判断为触发了左滑
    if (difX > 0 && Math.abs(difX) >= 40 && Math.abs(difY) <= 20) {
      console.log("左滑")
    }
    else {
      console.log("非左滑")
    }
  },
  play() {
    wx.navigateTo({
      url: '/packageA/play/play',
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
      url: "/video/queryvideo",
      data: {
        
      },
      method: "GET"
    }).then(res => {
      console.log(res)


    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function () {
    this.queryvideo()
  },
  onShow: function () {
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country

        this.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        })
      }
    })
  }
})
