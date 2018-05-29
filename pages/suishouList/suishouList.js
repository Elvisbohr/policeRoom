// pages/suishouList/suishouList.js
var app = getApp()
Page({
  data: {
    quList: [],
    pages: 0,
    curPage: 0,
    isLoading: false,
    arr: []
  },
  jump: function () {
    wx.navigateTo({
      url: '../baoliao/baoliao'
    })
  },
  goDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sspDetail/sspDetail?id=' + id
    })
  },
  getQuStr: function (id) {
    let quList = this.data.quList
    console.log(quList)
    for (let i = 0, len = quList.length; i < len; i++) {
      console.log('id---' + id)
      console.log('quList[i].id---' + quList[i].id)
      if (quList[i].id == id) {
        return quList[i].name
      }
    }
    // 没查到返回默认
    return "迎泽区"
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
  
  },
  onShow: function () {
    console.log(app.globalData.openId)
    const that = this
    // 请求接口 区列表
    wx.request({
      url: app.globalData.adminAddress + '/district',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          that.setData({
            quList: res.data.data
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

    // 请求接口 列表内容
    console.log(app.globalData.adminAddress)
    wx.request({
      url: app.globalData.adminAddress + '/snapshot/list',
      data: {
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        that.setData({
          isLoading: false
        })
        if (res.data.status === 200) {
          let arr = res.data.data.list
          // 总页数
          that.setData({
            pages: res.data.pages
          })
          // 处理时间
          for (let i = 0, len = arr.length; i < len; i++) {
            let quId = arr[i].district || 1
            arr[i].qu = that.getQuStr(quId)
            arr[i].createTime = arr[i].createTime.substring(0, 11)
          }
          that.setData({
            arr: arr
          })
          // 当前页数
          that.setData({
            curPage: that.data.curPage + 1
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