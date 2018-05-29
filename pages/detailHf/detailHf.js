// pages/detailHf/detailHf.js
var app = getApp();
Page({
  data: {
    status: "",
    articleId: "",
    title: "",
    isMine:'',
    serverAddress: app.globalData.serverAddress,
    index: 0,
    detialObj: {},
    imgUrls: [],
    video:'',
    dTypeId: 0,
    placeHolder: "发送",//
    sendContent: "",//回复内容
    sendButClass: "",//发送按钮class
    comment:[]
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData({
      articleId: options.articleId,//文章id
      title: options.title,//导航栏标题
      status: options.status,//文章发布状态
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
    var url, data;
    if (that.data.title == '温馨社区') {
      url = app.globalData.adminAddress + '/communityNews/info'
      data = {
        articleId: options.articleId
      }
    } else if (that.data.title == '建言献策') {
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
    //3.获取文章详情中的图片和视频
    var data1,type1,url1,url2;
    if (that.data.title == '温馨社区') {
      url1 = app.globalData.adminAddress + '/communityNewsVideo'
      url2 = app.globalData.adminAddress + '/communityNewsImg'
      data1 = {
        newsId: options.articleId
      }
    } else if (that.data.title == '建言献策') {
      url1 = app.globalData.adminAddress + '/suggestVideo'
      url2 = app.globalData.adminAddress + '/suggestImg'
      data1 = {
        suggestId: options.articleId
      }
    }
    that.getTuVideo(url1, data1, '视频')
    that.getTuVideo(url2,data1,'图片')
    // 4.获取建言献策评论
    if (that.data.title == '建言献策'){
      wx.request({
        url: app.globalData.adminAddress + '/suggestReply/list',
        data: {
          suggestId: options.articleId
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          if(res.data.data.length>0){
            that.setData({
              comment: res.data.data
            })
          }
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
    } else if (that.data.title == '温馨社区'){
      wx.request({
        url: app.globalData.adminAddress + '/communityNewsComment/list',
        data: {
          newsId : options.articleId
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          if (res.data.data.length > 0) {
            that.setData({
              comment: res.data.data
            })
          }
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
    }
  },
  // 获取图片和视频接口
  getTuVideo:function(url,data,type){
    var that=this;
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        if(type=='图片'){
          that.setData({
            imgUrls: res.data.data
          })
        } else if (type == '视频'){
          if (res.data.data.length>0){
            that.setData({
              video: res.data.data[0].video
            })
          }
        }
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
    console.log(e)
    wx.showToast({
      'title': '请稍后...',
      'icon': 'loading'
    });
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/communityNewsComment/write',
      data: { 
        'newsId': that.data.articleId, 
        'openId': app.globalData.openId,
        'content' :e.detail.value.comment
      },
      method: 'GET',
      success: function (res) {
        wx.request({
          url: app.globalData.adminAddress + '/communityNewsComment/list',
          data: {
            newsId: that.data.articleId
          },
          method: 'GET',
          success: function (res) {
            wx.hideLoading();
            if (res.data.data.length > 0) {
              that.setData({
                comment: res.data.data
              })
            }
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
      fail: function (res) {
        wx.showToast({
          title: '网络错误',
          icon: 'loading'
        })
      }
    })
  },
  thumbUp: function (e) {
    var openid = wx.getStorageSync("openid"), that = this;
    that.thumbUpServer(e.currentTarget.dataset.articleId, openid);
  }
})