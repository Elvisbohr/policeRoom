// pages/test/test.js
var myN = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    let screenW = res.windowWidth
    let pixelRatio = res.pixelRatio
    console.log(screenW)
    console.log('pixelRatio---' + pixelRatio)
    // 1px = (750 / 宽度) * rpx
    myN = 750 / screenW
    console.log('myN---' + myN)
  },

  scroll: function (e) {
    let temp = e.detail.scrollTop
    console.log('temp---' + temp)
    let myRpx = temp * myN
    console.log('myRpx---' + myRpx)
  },

  jump: function (e) {
    this.setData({
      toView: 'test2'
    })
    console.log(this.data.toView)
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