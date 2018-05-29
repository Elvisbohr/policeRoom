// pages/tzggDetail/tzggDetail.js
var app = getApp();
Page({
  data: {
    article: {},
    imgs: []
  },
  onLoad: function (options) {
    const that = this
    console.log(options.id)
    // 请求接口
    console.log(app.globalData.adminAddress)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.adminAddress + '/notice/info',
      data: {
        noticeId: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          let articl = res.data.data
          that.setData({
            article: articl
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