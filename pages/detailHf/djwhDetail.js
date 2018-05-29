// pages/djwhDetail/djwhDetail.js
var app = getApp();
Page({
  data: {
    serverAddress: app.globalData.serverAddress,
    index: 0,
    detialObj: {},
    imgUrls:[],
    status: "",
    articleId: "",
    dTypeId: 0,
    title: "",
    placeHolder: "发送",//
    sendContent: "",//回复内容
    sendButClass: ""//发送按钮class
  }, 
  onLoad: function (options) {
    var that = this;
    that.setData({
      articleId: options.articleId,//文章id
      title: options.title,//导航栏标题
      status: options.type//文章发布状态
    });
    //1.动态修改标题
    wx.setNavigationBarTitle({
      title: options.title
    });
    wx.showLoading({
      'title': 'loading...',
      'mask': true
    });
    //2.获取当前文章详情
    var url,data;
    if(that.data.title=='温馨社区'){
      url = app.globalData.adminAddress + '/communityNews/info'
      data = {
        articleId: options.articleId
      }
    } else if(that.data.title == '建言献策'){
      url = app.globalData.adminAddress + '/suggest/info'
      data = {
        suggestId: options.articleId
      }
    }
    wx.request({
      url: url,
      data: data,
      method: 'GET', 
      success: function (res) {
        wx.hideLoading();
        // var data = res.data;
        // //得出评论次数
        // if (data.discuss.length > 10000) {
        //   data.discussNum = Math.round(data.discuss.length) + "万";
        // } else {
        //   data.discussNum = data.discuss.length;
        // }
        // //得出赞次数
        // if (data.likesCount > 10000) {
        //   data.likesCount = Math.round(data.likesCount);
        // }
        that.setData({
          detialObj: res.data.data
        })
      },
      fail: function (res) {
        wx.hideLoading();
        setTimeout(function () {
          wx.showToast({
            title: '网络错误',
            icon: 'loading'
          })
        }, 300);
      }
    });
    //3.获取文章详情中的图片
    wx.request({
      url: app.globalData.adminAddress + '/communityNewsImg',
      data: {
        newsId: options.articleId
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          imgUrls: res.data.data
        })
      },
      fail: function (res) {
        wx.hideLoading();
        setTimeout(function () {
          wx.showToast({
            title: '网络错误',
            icon: 'loading'
          })
        }, 300);
      }
    });
  },
  //审核通过
  agreeAudit: function () {
    wx.showToast({
      'title': '请稍后...',
      'icon': 'loading'
    });
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/api/article/operation',
      data: { 'articleId': that.data.articleId, 'operation': 'pass' },
      method: 'GET',
      success: function (res) {
        wx.showToast({
          'title': '审核通过',
          'icon': 'success',
          'duration': 2500
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 2500)
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误',
          icon: 'loading'
        })
      }
    })
  },
  //驳回
  refuseAudit: function () {
    wx.showToast({
      'title': '请稍后...',
      'icon': 'loading'
    });
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/api/article/operation',
      data: { 'articleId': that.data.articleId, 'operation': 'reject' },
      method: 'GET',
      success: function (res) {
        wx.showToast({
          'title': '驳回成功',
          'icon': 'success',
          'duration': 2500
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 2500)
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误',
          icon: 'loading'
        })
      }
    })
  },
  //编辑按钮
  editCate: function () {
    var that = this;
    wx.navigateTo({
      url: '../writeArti/writeArti?id=' + that.data.dTypeId + "&listId=" + that.data.articleId + "&name=" + that.data.title
    });
  },
  //删除文章按钮
  removeCate: function () {
    wx.showLoading({
      'title': '删除中...',
      'mask': true
    });
    var articleId = this.data.articleId;
    wx.request({
      url: app.globalData.adminAddress + '/api/article/detele',
      data: { 'articleId': articleId },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        setTimeout(function () {
          wx.showToast({
            'title': '删除成功',
            'mask': true
          });

          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500);
        }, 300);
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          'title': '删除失败',
          'mask': true,
          'duration': 2500
        });
      }
    })
  },
  //回复内容改变
  sendConChange: function (e) {
    var content = e.detail.value, sendButClass;
    if (content.length > 0 && content !== "") {
      sendButClass = "btn";
    } else {
      sendButClass = "";
    }
    this.setData({
      sendButClass: sendButClass
    });
  },
  //点击评论内容回复
  replyTrigger: function (e) {

  },
  //转发
  onShareAppMessage: function () {
    var that = this;
    var title = that.data.detialObj.title;
    console.log(that.data.detialObj);
    return {
      title: title,
      path: '/pages/djwhDetail/djwhDetail?type=' + that.data.title + '&dTypeId=' + that.data.dTypeId + '&listId=' + that.data.articleId,
      success: function (res) {
        // 转发成功
        console.log('/pages/djwhDetail/djwhDetail?type=' + that.data.title + '&dTypeId=' + that.data.dTypeId + '&listId=' + that.data.articleId);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //发表评论
  replay: function (e) {
    var data = {}, that = this;
    that.setData({
      'sendContent': ""
    });
    if (e.detail.value.sendContent.length > 0) {
      var wxUserInfo = wx.getStorageSync("wxUserInfo");
      wx.getStorage({
        key: 'wxUserInfo',
        success: function (res) {
          data.articleId = that.data.articleId;
          data.content = e.detail.value.sendContent;
          data.fromImg = wxUserInfo.avatarUrl;
          data.fromName = wxUserInfo.nickName;
          data.fromOpenId = wx.getStorageSync('openid');
          data.toImg = '';
          data.toName = '';
          data.toOpenId = '';
          wx.request({
            url: app.globalData.adminAddress + '/api/article/discuss',
            data: data,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var detialObj = that.data.detialObj;
              //同步评论数据
              detialObj.discuss.push({
                content: data.content,
                img: data.fromImg,
                name: data.fromName,
                time: ""
              });
              //得出评论次数
              if (detialObj.discuss.length > 10000) {
                detialObj.discussNum = Math.round(detialObj.discuss.length) + "万";
              } else {
                detialObj.discussNum = detialObj.discuss.length;
              }
              that.setData({
                detialObj: detialObj
              });
            }
          })
        },
        fail: function () {
          wx.login({
            success: function (res) {
              wx.getUserInfo({
                success: function (res) {
                  wx.setStorageSync("wxUserInfo", res.userInfo);
                  data.articleId = that.data.articleId;
                  data.content = e.detail.value.sendContent;
                  data.fromImg = res.userInfo.avatarUrl;
                  data.fromName = res.userInfo.nickName;
                  data.fromOpenId = wx.getStorageSync('openid');
                  data.toImg = '';
                  data.toName = '';
                  data.toOpenId = '';
                  wx.request({
                    url: app.globalData.adminAddress + '/api/article/discuss',
                    data: data,
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      var detialObj = that.data.detialObj;
                      //同步评论数据
                      detialObj.discuss.push({
                        content: data.content,
                        img: data.fromImg,
                        name: data.fromName,
                        time: ""
                      });
                      //得出评论次数
                      if (detialObj.discuss.length > 10000) {
                        detialObj.discussNum = Math.round(detialObj.discuss.length) + "万";
                      } else {
                        detialObj.discussNum = detialObj.discuss.length;
                      }
                      that.setData({
                        detialObj: detialObj
                      });
                    }
                  })
                }
              })
            },
            fail: function (res) {
              wx.showToast({
                'title': '获取权限失败',
                'icon': 'loading',
              });
            }
          })
        }
      })

    }
  },
  thumbUp: function (e) {
    var openid = wx.getStorageSync("openid"), that = this;
    that.thumbUpServer(e.currentTarget.dataset.articleId, openid);
  },
  //点赞请求服务器
  thumbUpServer: function (articleId, openid) {
    var that = this;
    var detialObj = that.data.detialObj;
    detialObj.isHeartAni = 'scaleAni';
    if (!detialObj.isLike) {
      wx.request({
        url: app.globalData.adminAddress + '/api/like',
        data: { 'articleId': articleId, 'openId': openid },
        method: 'GET',
        success: function (res) {
          console.log(res);
          detialObj.likesCount++;
          detialObj.isLike = true;
          detialObj.isAni = '';
          detialObj.isHeartAni = '';
          that.setData({
            'detialObj': detialObj
          });
        },
        fail: function (res) {
          // fail
        }
      });

    }
  }
})