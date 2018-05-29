// pages/dProgress/dProgress.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onInquire(e) {
      let that = this
      let data = {};
    //   listData.openId = app.globalData.openId;
      data.idCard = e.detail.value.idCard;
      //首页获取
      wx.request({
          url: app.globalData.adminAddress + '/volunteer/apply/info',
          data: data,
          method: "GET",
          // header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
              console.log('进度查询', res.data)
              wx.showModal({
                  title: '查询结果',
                  showCancel:false,
                  content: res.data.msg,
                  success: function (res) {
                      if (res.confirm) {
                          console.log('用户点击确定')
                      }
                  }
              })             
          }
      })
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