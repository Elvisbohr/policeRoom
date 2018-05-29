// pages/tongzhi/tongzhi.js
var app = getApp()
Page({
  data: {
    pages: 0,
    curPage: 0,
    isLoading: false,
    lists: []
  },
  goDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../tzggDetail/tzggDetail?id=' + id
    })
  },
  onLoad: function (options) {
    const that = this
    wx.setNavigationBarTitle({
      title: '通知公告'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2979ff'
    })
    // 请求接口 列表内容
    console.log(app.globalData.adminAddress)
    wx.request({
      url: app.globalData.adminAddress + '/notice/list',
      data: {},
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
            arr[i].createTime = arr[i].createTime.substring(0, 11)
          }
          that.setData({
            lists: arr
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
    const that = this
    let pages = this.data.pages
    let curPage = this.data.curPage
    if (pages > curPage) {
      that.setData({
        isLoading: true
      })
      // 请求接口 列表内容
      wx.request({
        url: app.globalData.adminAddress + '/notice/list',
        data: {
          pageNum: curPage + 1
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
            // 处理时间
            for (let i = 0, len = arr.length; i < len; i++) {
              arr[i].qu = '迎泽区'
              arr[i].createTime = arr[i].createTime.substring(0, 11)
            }
            // 追加新的数组
            let oldArr = that.data.arr
            let newArr = oldArr.concat(arr)
            that.setData({
              arr: newArr
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
    } else {
      console.log('不用请求分页了')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})