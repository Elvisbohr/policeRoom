// pages/catalogIndex/catalogIndex.js
var app = getApp()
Page({
  data: {
    topArr: [],
    remedy: 100,
    toView: '',
    curTabIdx: 0,
    catalogBig: [],
    bigLen: 0,
    catalogSmall: {}
  },
  onMyEvent: function (e) {
    console.log(e)
    let myid = e.detail.myId
    let name = e.detail.myName
    console.log('点击更多图标---' + myid)
    switch (myid) {
        case 5:
        break;
      default:
        wx.navigateTo({
            url: '../djwhList/djwhList?dTypeId=' + myid + '&name=' + name
        })
        break;
    }
  },
  onLoad: function (options) {
    const that = this
    wx.setNavigationBarTitle({
      title: '全部应用'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2979ff'
    })
    // 请求接口
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.adminAddress + '/column/list', 
      data: {
        type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          let arr = res.data.data
          // 构造大的分类标题
          let tempBigArr = [] // 顶部大滚动标题
          for (let i = 0, len = arr.length; i < len; i++) {
            if (0 === arr[i].pid) {
              tempBigArr.push(arr[i])
            }
          }
          for (let i = 0, len = tempBigArr.length; i < len; i++) {
            tempBigArr[i].active = false
            tempBigArr[i].myclass = "catalog-big"
          }
          tempBigArr[0].active = true
          tempBigArr[0].myclass = "catalog-big active"
          // 构造底部分类数组
          let catalogSmall = {}
          for (let i = 0, len = tempBigArr.length; i < len; i++) {
            let curSmallArr = []
            let curBigId = tempBigArr[i].id
            let curBigName = ''
            for (let j = 0, len = arr.length; j < len; j++) {
              if (curBigId === arr[j].pid) {
                curBigName = tempBigArr[i].name
                curSmallArr.push(arr[j])
              }
            }
            catalogSmall[curBigName] = curSmallArr
          }
          console.log(catalogSmall)

          // 顶部大分类的个数，用于swiper显示
          let bigTempLen = tempBigArr.length > 4 ? 5 : tempBigArr.length
          that.setData({
            catalogBig: tempBigArr,
            bigLen: bigTempLen,
            catalogSmall: catalogSmall
          })
          // 计算top
          that.queryMultipleNodes()
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
  queryMultipleNodes: function () {//声明节点查询的方法
    const that = this
    var query = wx.createSelectorQuery().in(this)//创建节点查询器 query
    query.selectAll('.getTop').boundingClientRect()//这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
    query.exec(function (res) {
      console.log(res)
      let resArr = res[0]
      let tempBigArr = []
      for (let i = 0, len = resArr.length; i < len; i++) {
        tempBigArr.push(resArr[i].top)
      }
      console.log(tempBigArr) // #the-id节点的上边界坐标
      that.setData({
        topArr: tempBigArr
      })
    })
  },
  scroll: function (e) {
    let curTop = e.detail.scrollTop
    // console.log('curTop---' + curTop)
    // if (curTop >= 0 && curTop < this.data.topArr[1] - this.data.remedy) {
    //   this.setBigTab(0)
    // }
    // if (curTop >= this.data.topArr[1] && curTop < this.data.topArr[2] - this.data.remedy) {
    //   this.setBigTab(1)
    // }
    // if (curTop >= this.data.topArr[2] && curTop < this.data.topArr[3] - this.data.remedy) {
    //   this.setBigTab(2)
    // }
    // if (curTop >= this.data.topArr[3] && curTop < this.data.topArr[4] - this.data.remedy) {
    //   this.setBigTab(3)
    // }
    // if (curTop >= this.data.topArr[4]) {
    //   this.setBigTab(4)
    // }
    let arr = this.data.topArr
    let remedy = this.data.remedy
    let len = arr.length
    arr[0] = 0
    for (let [i, elem] of arr.entries()) {
      if (i === (len - 1)) {
        if (curTop >= arr[i]) {
          this.setBigTab(i)
          break
        }
      } else {
        if (curTop >= arr[i] && curTop < arr[i + 1] - remedy) {
          this.setBigTab(i)
          break
        }
      }
    }
  },
  changeBig: function (e) {
    const that = this
    let idx = e.target.dataset.idx
    // console.log(idx)
    this.setBigTab(idx)
    // 滚动
    this.setScroll(idx)
  },
  setBigTab: function(idx) {
    let arr = this.data.catalogBig
    let len = arr.length
    while (len--) {
      arr[len].active = false
      arr[len].myclass = 'catalog-big'
    }
    arr[idx].active = true
    arr[idx].myclass = 'catalog-big active'
    this.setData({
      catalogBig: arr
    })
    this.setData({
      curTabIdx: idx
    })
  },
  setScroll: function(idx) {
    this.setData({
      toView: 'toView_' + idx
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