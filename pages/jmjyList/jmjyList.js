// pages/jmjyList/jmjyList.js
var app = getApp();
Page({
  data: {
    serverAddress: app.globalData.serverAddress,
    dTypeId: "",
    collection: {},
    nowTitle: "",
    isCur: ['cur', ''],
    'isThumbUp': '赞'
  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      'title': 'loading...',
      'mask': true
    });
    var openid = wx.getStorageSync("openid"), that = this;
    if (openid === "") {
      wx.login({
        success: function (res) {
          if (res.errMsg === "login:ok") {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx768ef2998b568e91&secret=ba644601d4761d72fbf57732f39fb1f5&js_code=' + res.code + '&grant_type=authorization_code',
              data: {},
              method: 'GET',
              success: function (res) {
                wx.setStorageSync("openid", res.data.openid);
                that.getListData(res.data.openid);
              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            })

          }
        },
        fail: function (res) {
          wx.showToast({
            'title': '获取权限失败',
            'icon': 'loading',
          });
        }
      })
    } else {
      that.getListData(openid);
    }
  },
  //2.获取当前类型列表数据
  getListData: function (openid) {
    var that = this, communityInfo = wx.getStorageSync('communityInfo');
    var communityId = communityInfo.id;
    wx.request({
      url: app.globalData.adminAddress + "/api/tabMenuList",
      data: { 'openId': openid, 'dTypeID': that.data.dTypeId, 'communityId': communityId },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        wx.hideLoading();
        //3.动态修改标题
        wx.setNavigationBarTitle({
          title: res.data.data.title
        })
        var collection = res.data.data;
        //3.重新计算时间
        // if (res.data.data.title === "温馨提示") {
        //   for (var s = 0; s < collection.prompt.all.length; s++) {
        //     var date = new Date(collection.prompt.all.time).getTime(),
        //       nowTime = new Date().getTime(),
        //       timeDiffer = nowTime - date,
        //       timeStr = "";
        //     if (timeDiffer < (60 * 1000)) {
        //       timeStr = "刚刚";
        //     } else if (timeDiffer <= (60 * 60 * 1000)) {
        //       timeStr = Math.round(timeDiffer / (60 * 1000)) + "分钟之前";
        //     } else if (timeDiffer <= (24 * 60 * 60 * 1000)) {
        //       timeStr = Math.round(timeDiffer / (60 * 60 * 1000)) + "小时之前";
        //     } else if (timeDiffer > (24 * 60 * 60 * 1000)) {
        //       timeStr = collection.lists[s].time;
        //     }
        //     collection.prompt.all.time = timeStr;
        //   }
        //   for (var s = 0; s < collection.prompt.mine.length; s++) {
        //     var date = new Date(collection.prompt.mine.time).getTime(),
        //       nowTime = new Date().getTime(),
        //       timeDiffer = nowTime - date,
        //       timeStr = "";
        //     if (timeDiffer < (60 * 1000)) {
        //       timeStr = "刚刚";
        //     } else if (timeDiffer <= (60 * 60 * 1000)) {
        //       timeStr = Math.round(timeDiffer / (60 * 1000)) + "分钟之前";
        //     } else if (timeDiffer <= (24 * 60 * 60 * 1000)) {
        //       timeStr = Math.round(timeDiffer / (60 * 60 * 1000)) + "小时之前";
        //     } else if (timeDiffer > (24 * 60 * 60 * 1000)) {
        //       timeStr = collection.lists[s].time;
        //     }
        //     collection.prompt.mine.time = timeStr;
        //   }
        // } else if (res.data.data.title === '温馨社区') {
        //   for (var s = 0; s < collection.lists.length; s++) {
        //     collection.lists[s].isAni = '';
        //     collection.lists[s].isHeartAni = '';
        //   }
        // } else {
        //   for (var s = 0; s < collection.lists.length; s++) {
        //     var date = new Date(collection.lists[s].time).getTime(),
        //       nowTime = new Date().getTime(),
        //       timeDiffer = nowTime - date,
        //       timeStr = "";
        //     if (timeDiffer < (60 * 1000)) {
        //       timeStr = "刚刚";
        //     } else if (timeDiffer <= (60 * 60 * 1000)) {
        //       timeStr = Math.round(timeDiffer / (60 * 1000)) + "分钟之前";
        //     } else if (timeDiffer <= (24 * 60 * 60 * 1000)) {
        //       timeStr = Math.round(timeDiffer / (60 * 60 * 1000)) + "小时之前";
        //     } else if (timeDiffer > (24 * 60 * 60 * 1000)) {
        //       timeStr = collection.lists[s].time;
        //     }
        //     collection.lists[s].time = timeStr;
        //   }
        // }
        console.log("collection");
        console.log(collection);
        that.setData({
          collection: res.data.data,
          dTypeId: that.data.dTypeId,
          nowTitle: res.data.data.title,
        });
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'loading'
        });
      }
    })

  },
  onLoad: function (options) {
    this.setData({
      'dTypeId': options.dTypeId
    });
  },
  skipUrl: function (e) {
    var that = this,
      listId = e.currentTarget.dataset.listId;
    wx.navigateTo({
      url: '../djwhDetail/djwhDetail?type=' + that.data.nowTitle + '&dTypeId=' + that.data.dTypeId + "&listId=" + listId
    })
  },
  skipJyxc: function () {
    var that = this;
    wx.navigateTo({
      url: '../writeArti/writeArti?id=' + that.data.dTypeId + "&name=" + that.data.nowTitle
    });
  },
  getReleased: function (e) {
    var that = this,
      eType = e.currentTarget.dataset.typeText;
    if (eType === "mine") {
      //修改状态
      that.setData({
        isCur: ['cur', '']
      })
    } else if (eType === "all") {
      //修改状态
      that.setData({
        isCur: ['', 'cur']
      })
    }
  },
  //出现评论、点赞框
  showPraise: function (e) {
    var index = e.currentTarget.dataset.index,
      collection = this.data.collection,
      isAni = collection.lists[index].isAni;
    if (isAni === "") {
      collection.lists[index].isAni = 'widthChange';
    } else {
      collection.lists[index].isAni = '';
    }
    this.setData({
      'collection': collection
    });
  },
  //点赞
  thumbUp: function (e) {
    var openid = wx.getStorageSync("openid"), that = this;
    if (openid === "") {
      wx.login({
        success: function (res) {
          if (res.errMsg === "login:ok") {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx768ef2998b568e91&secret=ba644601d4761d72fbf57732f39fb1f5&js_code=' + res.code + '&grant_type=authorization_code',
              data: {},
              method: 'GET',
              success: function (res) {
                wx.setStorageSync("openid", res.data.openid);
                that.thumbUpServer(e.currentTarget.dataset.index, e.currentTarget.dataset.articleId, res.data.openid);
              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            })

          }
        },
        fail: function (res) {
          wx.showToast({
            'title': '获取权限失败',
            'icon': 'loading',
          });
        }
      })
    } else {
      that.thumbUpServer(e.currentTarget.dataset.index, e.currentTarget.dataset.articleId, openid);
    }
  },
  //点赞请求服务器
  thumbUpServer: function (index, articleId, openid) {
    var that = this;
    var collection = that.data.collection;
    collection.lists[index].isHeartAni = 'scaleAni';
    if (!collection.lists[index].isLike) {
      wx.request({
        url: app.globalData.adminAddress + '/api/like',
        data: { 'articleId': articleId, 'openId': openid },
        method: 'GET',
        success: function (res) {
          collection.lists[index].likesCount++;
          collection.lists[index].isLike = true;
          collection.lists[index].isAni = '';
          collection.lists[index].isHeartAni = '';
          that.setData({
            'collection': collection
          });
        },
        fail: function (res) {
          // fail
        }
      });

    }
  }
})