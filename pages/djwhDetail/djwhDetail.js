// pages/djwhDetail/djwhDetail.js
//在使用的View中引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    serverAddress: app.globalData.serverAddress,
    index: 0,
    detialObj: {},
    types: "",
    articleId: "",
    dTypeId: 0,
    title: "",
    placeHolder: "发送",//
    sendContent: "",//回复内容
    sendButClass: ""//发送按钮class
  },
  onLoad: function (options) {
    var that = this;
    //1.动态修改标题
    wx.setNavigationBarTitle({
      title: options.name
    });
    wx.showLoading({
      'title': 'loading...',
      'mask': true
    }); 
    let listData = {};
    listData.articleId = options.id;
    this.getList(listData)
  },
  //获取文章详情
  getList:function(data){
      let that = this;
      wx.request({
          url: app.globalData.adminAddress + '/article/info',
          data: data,
          method: 'GET',
          success: function (res) {
              wx.hideLoading();
              console.log('文章详情',res.data)
              var data = res.data.data;
             
              that.setData({
                  detialObj: res.data.data
              })
              let article = res.data.data.content 
              WxParse.wxParse('article', 'html', article, that);
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
  
  //转发
  onShareAppMessage: function () {
    var that = this;
    var title = that.data.detialObj.title;
    console.log(that.data.detialObj);
    return {
      title: title,
      path: '/pages/djwhDetail/djwhDetail?type=' + that.data.title  + '&listId=' + that.data.articleId,
      success: function (res) {
        // 转发成功
        console.log('/pages/djwhDetail/djwhDetail?type=' + that.data.title + '&listId=' + that.data.articleId);
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