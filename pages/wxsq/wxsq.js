// pages/wxsq/wxsq.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pageNum:1,
    pageSize:8,
    page:'',
    hidden:true,
  },
  // 触底事件
  bindscrolltolower:function(){
    console.log(this.data.pageNum)
    if (this.data.pageNum<this.data.page){      
      this.data.pageNum++;
      this.getData(this.data.pageNum, this.data.pageSize)
    } else {
      this.setData({
        hidden:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getData:function(pageNum,pageSize){
    var that = this
    var data;
    data = {
      pageNum: pageNum,
      pageSize: pageSize,
      openId: app.globalData.openId 
    }
    wx.request({
      url: app.globalData.adminAddress + '/communityNews/list',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var arr=that.data.list;
        that.data.page=res.data.pages;
        if (res.data.status == 200) {
          for(var i=0;i<res.data.data.list.length;i++){
            arr.push(res.data.data.list[i])
          }
          that.setData({
            list:arr
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          'title': '网络错误',
          'icon': 'loading'
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    that.setData({
      pageNum:1,
      list:[],
      hidden:true
    })
    that.getData(that.data.pageNum, that.data.pageSize);
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
