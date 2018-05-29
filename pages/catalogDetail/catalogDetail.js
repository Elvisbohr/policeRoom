// pages/catalogDetail/catalogDetail.js
var app = getApp()
Page({
  data: {
    zaixian: []
  },
  setTitle: function(str) {
    wx.setNavigationBarTitle({
      title: str
    })
  },
  onMyEvent: function (e) {
    console.log(e)
    let myid = e.detail.myId
    switch (myid) {
      case 19:
        wx.navigateTo({
          url: '../huji/huji?id=1'
        })
        break;
      case 20:
        wx.navigateTo({
          url: '../huji/huji?id=2'
        })
        break;
      case 21:
        wx.navigateTo({
          url: '../huji/huji?id=3'
        })
        break;
      case 22:
        wx.navigateTo({
          url: '../huji/huji?id=4'
        })
        break;
      case 23:
        wx.navigateTo({
          url: '../huji/huji?id=5'
        })
        break;
      case 40:
        wx.navigateTo({
          url: '../huji/huji?id=6'
        })
        break;
      case 26:
        wx.navigateTo({
          url: '../crime/crime'
        })
        break;
      case 35:
        wx.navigateTo({
          url: '../rentHouse/rentHouse'
        })
        break;
      default:
        wx.showToast({
          title: '暂未开放',
          icon: 'loading',
          duration: 1000
        })
    }
  },
  onLoad: function (options) {
    console.log(options.id)
    const that = this
    // 请求接口
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.adminAddress + '/column/list',
      data: {
        pid: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          that.setData({
            zaixian: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })

    const myMatch = {
      18: '户籍业务',
      25: '证明出具',
      34: '信息登记'
    }
    that.setTitle(myMatch[options.id])
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
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