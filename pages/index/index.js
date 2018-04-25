//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
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
  onLoad: function () {
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
  },
  onShow: function () {
    
  }
})
