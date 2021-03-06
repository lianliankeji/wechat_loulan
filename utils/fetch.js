// var ENV = "dev";
var ENV = "release";
export default function (param) {
  if (ENV && ENV == "dev" && !param.baseUrl) {
    param.baseUrl = "http://192.168.50.238:9555";
  } else if (ENV && ENV == "release" && !param.baseUrl) {
    param.baseUrl = "https://mogao.lianlianchains.com";
  }

  // if(/^\/mg/.test(param.url)) {
  //   param.baseUrl = "https://140.143.211.161";
  // }

  return new Promise((resolve, reject) => {
    wx.request({
      url: param.baseUrl + param.url,
      data: param.data,
      header: { 'content-type': param.json && param.json == true ? 'application/json' : 'application/x-www-form-urlencoded'},
      method: param.method.toUpperCase() || "GET",// OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        resolve(res.data)
      },
      fail: function (msg) {
        reject('fail')
      }
    })
  })
}