// pages/djwhList/djwhList.js
var app = getApp();
Page({
    data: {
        //dType
        serverAddress: app.globalData.adminAddress,
        title: "",
        collection: {},
        dType: "",
        pageNum: 1,
        pageSize: 8
    },
    onLoad: function (options) {
        let that = this;
        wx.setNavigationBarTitle({
            title: options.name
        });
        this.setData({
            title: options.name
        })
        let data = {};
        data.pageNum = that.data.pageNum;
        data.pageSize = that.data.pageSize;
        data.communityId = wx.getStorageSync('communityInfo').id;
        data.columnId = options.dTypeId;
        that.list(data);
    },
    list(data) {
        var that = this;
        //1.请求数据
        wx.request({
            url: app.globalData.adminAddress + '/article/list',
            data: data,
            method: 'GET',
            success: function (res) {
                console.log('文章列表页', res.data.data)
                that.setData({
                    collection : res.data.data.list,
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: '网络错误',
                    icon: 'loading'
                })
            }
        })
    },

      skipUrl:function(e){
        var that =this,
              name = e.currentTarget.dataset.name,
            id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../djwhDetail/djwhDetail?name='+name+'&id='+id
        });
      }
})