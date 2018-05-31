// pages/index/index.js
//包含高德地图js文件
var amapFile = require('../../lib/amap-wx.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pagesH: app.globalData.pageH - 60,
        community: { id: "1", name: "金刚里社区" },    //社区接口
        collection: {},  //首页所有接口总数据
        pageNum: 1,      //页面当前页数(分页)
        pageSize: 8,    //文章一页展示几条
        moreTit: '加载更多'
    },
    jump: function () {
        wx.navigateTo({
            url: '../tongzhi/tongzhi',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.getWeather(options);
        //获取nav数据
        let navdata = {};
        navdata.pid = 0;
        that.indexNav(navdata);
        let listdata = {};
        listdata.pageNum = that.data.pageNum;
        listdata.pageSize = that.data.pageSize;
        listdata.communityId = that.data.community.id;
        that.indexList(listdata);
        let newData = {};
        newData.pageNum = that.data.pageNum;
        that.getTzgg(newData);

    },
    tapNav: function (e) {
        let that = this,
            navtype = that.data.tabMenus[e.currentTarget.dataset.index].type,
            id = that.data.tabMenus[e.currentTarget.dataset.index].id,
            pid = that.data.tabMenus[e.currentTarget.dataset.index].pid,
            name = that.data.tabMenus[e.currentTarget.dataset.index].name,
            url = '';
        if (navtype == 1) {
            url = '../dang/dang?pid=' + pid + '&id=' + id+ '&name='+ name;
            wx.navigateTo({
                url: url,
            });
        } else if (navtype == 2) {
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
                url = '../catalogDetail/catalogDetail?id=' + id;
                wx.navigateTo({
                    url: url,
                });
            // }
        }
        console.log('导航类型', navtype)
        console.log('导航类型', id)
       
    },
    skipDetail: function (e) {
        console.log(e)
        var listId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../djwhDetail/djwhDetail?name=' + e.currentTarget.dataset.name + "&id=" + listId
        });
    },
    //加载更多接口
    loadMore: function () {
        var that = this,
            pageNum = that.data.pageNum,
            data = {};
        if (that.data.pageAll > pageNum) {
            pageNum += 1;
            data.pageNum = pageNum;
            data.communityId = that.data.community.id;
            that.setData({
                pageNum: pageNum,
            })
            that.indexList(data);

        } else {
            console.log('无数据')
            that.setData({
                moreTit: '暂无更多',
            })
        }
    },
    indexNav: function (data) {
        let that = this
        //首页获取
        wx.request({
            url: app.globalData.adminAddress + '/column/list',
            data: data,
            method: "GET",
            // header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('首页导航数据', res.data)
                that.setData({
                    tabMenus: res.data.data,
                })
            }
        })
    },
    indexList: function (data) {
        let that = this
        wx.request({
            url: app.globalData.adminAddress + '/article/list',
            data: data,
            method: "GET",
            // header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('文章列表', res.data)
                if (that.data.pageNum > 1) {
                    console.log('分页调取列表')
                    let lists = that.data.lists;
                    for (var i = 0; i < res.data.data.list.length; i++) {
                        lists.push(res.data.data.list[i]);
                    }
                    that.setData({
                        lists: lists,
                    })

                } else {
                    console.log('初次调取列表')
                    that.setData({
                        pageAll: res.data.pages,
                        lists: res.data.data.list,
                    })
                }
            }
        })
    },
    //通知公告
    getTzgg: function (data) {
        let that = this;
        wx.request({
            url: app.globalData.adminAddress + '/notice/list',
            data: data,
            method: "GET",
            // header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('通知公告数据', res.data)
                that.setData({
                    news: res.data.data.list,
                })
            }
        })
    },
    //跳转到定位社区页面
    location: function (e) {
        wx.navigateTo({
            url: '../cellselection/cellselection'
        })
    },
    onShow: function () {
        //存入缓存
        let that = this;
        // wx.setStorageSync('', { "id": 1, "name": "金刚里社区" });
        // wx.getStorage({
        //     key: 'communityInfo',
        //     success: function (res) {
        //         console.log('1213123',res.data)
        //         that.setData({
        //             community: res.data,
        //         })
        //     }
        // })
    },
    //获取天气信息
    getWeather: function (options) {
        var that = this;
        var myAmapFun = new amapFile.AMapWX({ key: 'e5b8d233f64bd67976a768adfdb149a0' });
        // 获取当前经纬度信息
        var self = this;
        myAmapFun.getRegeo({
            success: function (data) {
                that.setData({
                    'addressName': data[0].name
                });
                var chooseId = app.globalData.cid;
                if (chooseId === undefined) {
                    wx.request({
                        url: app.globalData.adminAddress + '/community/location',
                        data: { y: data[0].latitude, x: data[0].longitude },
                        header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
                        method: 'POST',
                        success: function (res) {
                            var shequ = res.data.data;
                            if (shequ.have) {
                                var temp = { id: shequ.id, name: shequ.name };
                                self.setData({
                                    community: temp,
                                });

                            } else {
                                //存入缓存
                                wx.setStorageSync('communityInfo', { "id": 1, "name": "金刚里社区" });

                                var temp = { id: 1, name: "金刚里社区" };
                                self.setData({
                                    community: temp,
                                });
                            }
                        },
                    })
                } else {
                    var temp = { id: app.globalData.cid, name: app.globalData.name };
                    self.setData({
                        community: temp,
                    });
                }

            },
            fail: function (info) {
                //失败回调
            }
        })

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