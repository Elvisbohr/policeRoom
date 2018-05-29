// pages/cellselection/cellselection.js
var app = getApp();
Page({
    data: {
        site: [],
        location: {},  // 默认小区
    },
    form: function (e) {
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;

        //存入缓存
        wx.setStorageSync('communityInfo', { "id": id, "name": name });
        wx.navigateBack({
            delta: 1
        });
    },
    onLoad: function (options) {
        let that = this
        wx.getStorage({
            key: 'communityInfo',
            success: function (res) {
                that.setData({
                    site: app.globalData.community,
                    location: res.data,
                })
          }
        })

        this.getlLocation();
    },
    getlLocation(data) {
        let that = this;
        wx.request({
            url: app.globalData.adminAddress + '/community/list',
            data: '',
            method: "GET",
            // header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('通知公告数据', res.data)
                that.setData({
                    site: res.data.data,
                })
            }
        })
    },
})