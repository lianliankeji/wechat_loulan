import { getOpenid } from "../../common/js/getOpenid.js"
import fetch from "../../utils/fetch.js"

var socketOpen = false;
var socketMsgQueue = [];
let skip = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    state: 0,
    transScore: 10,
    addModal: true,
    addValue: "",
    ticketInfo: {
      cinema:"电影院",
      film:"电影名称",
      hall:"观影厅",
      price:"票价",
      seat:"座位",
      time:"时间"
    },
    placeholder: "1983",
    iconTypeJson: {
      "0": "yearbg.png",
      "1": "typesbg.png",
      "2": "actorbg.png",
      "3": "areabg.png",
      "4": "classbg.png"
    },
    nowType: "0",
    iconlist: [],
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

  select(e) {
    let idx = e.target.dataset.idx;
    let tagname = e.target.dataset.tagname;
    console.log(idx);
    if (this.data.iconlist[idx].select == false) {
      this.data.iconlist[idx].select = true;
      this.setData({
        iconlist: this.data.iconlist
      },() => {
        this.savetickettag(tagname)
      })
    }   
  },

  input(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  addIcon(e) {
    let name = e.detail.value;
    let tagtype = this.data.nowType;

    if (name == "") {
      wx.showModal({
        content: '标签内容不能为空',
        showCancel: false
      })

      return;
    }

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

    if (name == "") {
      wx.showModal({
        content: '标签内容不能为空',
        showCancel: false
      })

      return;
    }

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
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mogaojava/savetickettag",
      data: {
        url: "http://mogao.lianlianchains.com/images/" + this.data.url,
        openid: this.data.openid,
        tag: name,
        tagtype: tagtype
      },
      method: "POST"
    }).then(res => {
      console.log(res)

    }).catch(err => {
      console.log(err)
    })
    // fetch({
    //   url: "/mogaojava/savetag",
    //   data: {
    //     openid: this.data.openid,
    //     videoid: this.data.videoid,
    //     tag: name,
    //     tagtype: tagtype
    //   },
    //   method: "POST"
    // }).then(res => {
    //   console.log(res)


    // }).catch(err => {
    //   console.log(err)
    // })
  },

  deletetag(name, tagtype) {
    fetch({
      url: "/mogaojava/deletetickettag",
      data: {
        openid: this.data.openid,
        url: "http://mogao.lianlianchains.com/images/" + this.data.url,
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

  savetickettag(tagname) {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mogaojava/savetickettag",
      data: {
        url: "http://mogao.lianlianchains.com/images/" + this.data.url,
        openid: this.data.openid,
        tag: tagname,
        tagtype: tagtype
      },
      method: "POST"
    }).then(res => {
      console.log(res)

    }).catch(err => {
      console.log(err)
    })
  },

  bindAddFinish(e) {
    console.log(e.detail.value)
    let tagname = e.detail.value;
    
    this.setData({
      addModal: true,
      iconlist: [...this.data.iconlist, {
        tag: tagname,
        select: true
      }]
    },() => {
      this.savetickettag(tagname);
    })
  },

  bindShowAddModal() {
    this.setData({
      addModal: false
    })
  },

  bindAddiconName(e) {
    this.setData({})
    console.log(e)
  },

  goHome() {
    console.log(this.data.iconlist.length)
    if (this.data.iconlist.length > 0) {
      wx.navigateBack({
        delta: 2
      })
    }else{
      wx.showModal({
        content: '请为您上传的电影打标签',
        showCancel: false
      })
    }
    
  },

  reupload() {
    let that = this;
    wx.chooseImage({
      // count: 1, // 默认9
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePaths = res.tempFilePaths
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)


        wx.uploadFile({
          url: 'https://mogao.lianlianchains.com/mogaojava/uploadimage', //仅为示例，非真实的接口地址
          // url: 'https://store.lianlianchains.com/exchange/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            openid: that.data.openid
          },
          success: function (res) {

            console.log(res)

            if (res.statusCode == 200) {
              that.setData({
                state: 0
              }, () => {
                that.recognite(res.data, that.data.openid)
              })
            }


          }
        })
      }
    })
  },

  transform() {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mg/invoke",
      data: {
        fcn: "transefer",
        usr: "mgcoinpool",
        args: ["mgcoinpool", "mgcoinpool", this.data.openid, this.data.transScore, "mogao", "上传票根", 5]
      },
      method: "POST"
    }).then(res => {
      

    }).catch(err => {
      console.log(err)
    })
  },

  sendSocketMessage(msg) {
    if (socketOpen) {
      
      wx.sendSocketMessage({
        data: msg,
        success: () => {
          wx.closeSocket();
        }
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },

  recognite(url, openid) {
    fetch({
      // baseUrl: "http://192.168.50.238:9555",
      url: "/mogaojava/recognition",
      data: {
        url: "http://mogao.lianlianchains.com/images/" + url,
        openid: openid
      },
      method: "POST"
    }).then(res => {
      console.log(res)
      if (res.ec == "000000" && res.data.flag == 1) {
        let nickName = getApp().globalData.userInfo.nickName
        this.transform();
        this.sendSocketMessage(JSON.stringify({ code: "0", data: nickName }));
        this.setData({
          state: 1
        })
      } else if (res.ec == "000000" && res.data.flag == 0) {
        let failArr = [];
        let showArr = [];
        for (let [key, value] of Object.entries(res.data)) {
          if (value == "无法识别") {
            failArr.push(key);
          }
        }

        for (let item of failArr) {
          showArr.push(this.data.ticketInfo[item])
        }

        this.setData({
          state: 2,
          failArr: showArr
        })
      } else {
        this.setData({
          state: 3
        },() => {
          wx.showModal({
            content: res.data,
            showCancel: false,
            confirmText: "返回",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  getOpenid(url) {
    getOpenid().then(openid => {
        this.recognite(url, openid);
      this.setData({
        openid: openid,
        url: url
      })
    })
  },

  socket(url) {

    var self = this;
    console.log(22222)

    wx.connectSocket({
      url: 'wss://mogao.lianlianchains.com/websocket'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！');
      socketOpen = true;
      self.getOpenid(url);
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      console.log("重新连接")
      wx.connectSocket({
        url: 'wss://mogao.lianlianchains.com/websocket',
        fail: function (err) {
          console.log(err)
        }
      });
      wx.onSocketOpen(function (res) {
        console.log("连接服务器成功。");
        socketOpen = true;
      });
      

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.closeSocket();
    this.socket(options.url);
    
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