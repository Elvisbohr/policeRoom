// pages/dang/dang.js
var app = getApp();
Page({
    data: {
        serverAddress: app.globalData.adminAddress,
        /* tabMenu */
        pageW: app.globalData.pageW,
        voidImgSrc: app.globalData.voidImgSrc,
        isGuide: false,
        category: "",
        newsTabH: "",
        pageNum: 0, 
        pageSize: 8,
        moreTit: '',
        moreTit: '加载更多'
    },
    //tabMenu跳转
    shopSkip: function (e) {
        console.log(e)
        let that = this,         
        name = e.currentTarget.dataset.name,
        dTypeId = e.currentTarget.dataset.dTypeId;
        if (dTypeId=='5'){
          wx.showToast({
            title: '暂未开放',
            icon: 'loading',
            duration: 1000
          })
        }else{
          wx.navigateTo({
            url: "../djwhList/djwhList?dTypeId=" + dTypeId + '&name=' + name,
          })
        }  
    },
    skipDetail: function (e) {
        console.log(e)
        var listId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../djwhDetail/djwhDetail?name=' + e.currentTarget.dataset.name + "&id=" + listId
        });
    },
    onLoad: function (options) {
        var that = this;
        var pageH = (app.globalData.pageH) * 0.06;
        var communityInfo = wx.getStorageSync('communityInfo');
        var communityId = communityInfo.id;
        this.setData({
            categoryId: options.id, //栏目ID
            communityId: communityId,   //社区id
            moreTit: '加载更多',
            newsTabH: pageH
        });
        let listData = {};
        listData.pageNum = that.data.pageNum;   //当前页
        listData.pageSize = that.data.pageSize; //一次展示几条
        listData.communityId = communityId; //社区id
        listData.columnId = options.id; //栏目id
        this.getMerchantList(listData);
        let tabData = {};
        tabData.type = 1;   //菜单类型1文章2办事
        tabData.pid = options.id; //c菜单父id
        this.tabMenus(tabData);   
        let bannerData = {};
        bannerData.columnId = options.id; //栏目id
        this.getBannerList(bannerData);   
        wx.setNavigationBarTitle({
            title: options.name
        });
        wx.showLoading({
            'title': 'loading...',
            'mask': true
        });

        //1.计算tabMenu单个尺寸
        that.setData({
            tabMenuItemH: app.globalData.pageH * 0.20
        })


    },

    //加载更多接口
    loadMore: function () {
        var that = this,
            pageNum = that.data.pageNum,
            data = {};
        if (that.data.pageAll > pageNum) {
            pageNum += 1;
            data.pageNum = pageNum;
            data.pageSize = that.data.pageSize
            data.communityId = that.data.communityId;
            data.columnId = that.data.categoryId
            that.setData({
                pageNum: pageNum,
            })
            that.getMerchantList(data);

        } else {
            console.log('无数据')
            that.setData({
                moreTit: '暂无更多',
            })
        }
    },
    //文章列表接口
    getMerchantList: function (data) {
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/article/list',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                wx.hideLoading();
                for (var i = 0; i < res.data.data.list.length;i++){
                  var str = res.data.data.list[i].createTime
                  res.data.data.list[i].createTime = str.substr(0, str.indexOf(' ') + 1)
                }  
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
                }},
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    },
    // 导航接口
    tabMenus:function(data){
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/column/list',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                wx.hideLoading();
                console.log('栏目列表', res)
                //4.初始化collection
                var collection = res.data.data;
                //5.拼接tabMenu数组
                var tabInit = 0, tabMenu = [], tabItem = [];
                for (var i = 0; i < collection.length; i++) {
                    //拼数组
                    tabItem.push(collection[i]);
                    tabMenu[tabInit] = tabItem;
                    if (i % 4 === 3) {
                        tabItem = [];
                        tabInit++;
                    }
                }
                that.setData({
                    tabMenus: tabMenu
                });                
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    },
    // 轮播图接口
    getBannerList:function (data) {
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/articleBanner/list',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                wx.hideLoading();
                console.log('栏目列表', res)
                that.setData({
                    banner: res.data.data
                });
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    },
})