// pages/suishou/suishou.js
var app = getApp();
Page({
  data: {
    quList: [],
    pages: 0,
    curPage: 0,
    isLoading: false,
    eye: '../../images/eye.png',
    imgUrls: [
      "../../images/sui-banner.png",
      "../../images/sui-banner.png",
      "../../images/sui-banner.png"
    ],
    arr: []
  },
  goDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sspDetail/sspDetail?id=' + id
    })
  },
  jump: function() {
    wx.navigateTo({
      url: '../baoliao/baoliao'
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
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    wx.setNavigationBarTitle({
      title: '随手拍'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2979ff'
    })
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
            let quId = arr[i].district || 1
            console.log('区域----quId---' + quId)
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
    wx.request({
      url: app.globalData.adminAddress + '/snapshotBanner/list',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          that.setData({
            imgUrls: res.data.data
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
        url: app.globalData.adminAddress + '/snapshot/list',
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
                let quId = arr[i].district || 1
                console.log('区域----quId---' + quId)
                arr[i].qu = that.getQuStr(quId)
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