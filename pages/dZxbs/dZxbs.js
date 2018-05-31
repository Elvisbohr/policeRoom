// pages/dZxbs/dZxbs.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:[],
    o:false
  },
  onMyEvent: function (e) {
    console.log(e)
    let myid = e.detail.myId;
    let isok = wx.getStorageSync('isAuthentication');
    // if (!isok) {
    //     wx.showModal({
    //         title: '身份认证',
    //         content: '您还未通过身份认证,不能在线办理业务。现在就去身份认证?',
    //         success: function (res) {
    //             if (res.confirm) {
    //                 console.log('用户点击确定')
    //                 wx.navigateTo({
    //                     url: '../Certification/Certification'
    //                 })
    //             } else if (res.cancel) {
    //                 console.log('你随意')
    //             }
    //         }
    //     })
    // } else {
    switch (myid) { // newborn crime rentHouse
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
    // }
  },
  bindscroll:function(e){
    var that=this;
    if (e.detail.scrollTop > 140){
      that.setData({
        o:true
      })
    }else {
      that.setData({
        o: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 请求接口
    wx.showLoading({
      title: '加载中',
    })
    // 通知公告列表
    wx.request({
      url: app.globalData.adminAddress + '/notice/list',
      data: {
        pageNum:1,
        pageSize:8
      },
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        console.log('通知公告数据', res.data)
        that.setData({
          news: res.data.data.list,
        })
      }
    })
    // 在线办事数据请求 
    wx.request({
      url: app.globalData.adminAddress + '/column/list',
      data: {
        type: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          let arr = res.data.data
          // 构造大分类
          let tempBigArr = []
          for (let i = 0, len = arr.length; i < len; i++) {
            if (0 === arr[i].pid) {
              tempBigArr.push(arr[i])
            }
          }
          console.log(tempBigArr)
          // 构造内容分类
          let tempSmall = {}
          for (let i = 0, len = tempBigArr.length; i < len; i++) {
            let tempSmallArr = []
            for (let j = 0, len = arr.length; j < len; j++) {
              if (tempBigArr[i].id === arr[j].pid) {
                tempSmallArr.push(arr[j])
              }
            }
            console.log(tempBigArr[i])
            tempSmall[tempBigArr[i]['name']] = tempSmallArr
          }
          console.log(tempBigArr)

          that.setData({
            catalogBig: tempBigArr,
            catalogSmall: tempSmall
          })
          console.log('catalogSmall------')
          console.log(that.data.catalogSmall)
          // 写死户籍业务图标
          let hujiArr = [
            {
              id: 991,
              name: '户口申报',
              icon: ''
            },
            {
              id: 991,
              name: '户口迁入',
              icon: ''
            },
            {
              id: 991,
              name: '户口迁出',
              icon: ''
            }
          ]

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