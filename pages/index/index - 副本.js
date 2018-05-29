// pages/index/index.js
var app = getApp();
import indexList from "../../utils/indexList.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log(app.globalData.pageH);
        //存入缓存
        wx.setStorageSync('communityInfo', { "id": 1, "name": "金刚里社区" });
        //获取nav数据
        wx.request({
            url: app.globalData.adminAddress + '/api/category',
            data: {},
            method: 'GET',
            success: function (res) {
                //拼接数组,加入跳转地址
                var navObj = res.data.data;
                for (var i = 0; i < navObj.length; i++) {
                    if (navObj[i].name == "警民家园") {
                        navObj[i].skipUrl = "../dang/dang?type=jw&";
                    } else if (navObj[i].name == "党建文化") {
                        navObj[i].skipUrl = "../dang/dang?type=dj&";
                    } else if (navObj[i].name == "时代新人") {
                        navObj[i].skipUrl = "../dang/dang?type=sd&";
                    } else if (navObj[i].name == "阳光警务") {
                        navObj[i].skipUrl = "../mission/mission?";
                    } else if (navObj[i].name == "警务助手") {
                        navObj[i].skipUrl = "../assistant/assistant?";
                    }
                }
                that.setData({
                    navObj: navObj,
                    pagesH: app.globalData.pageH
                })
                app.globalData.navObj = navObj;
            },
            fail: function (res) {
                wx.showToast({
                    title: "网络错误",
                    icon: "loading"
                })
            }
        })
        this.setData({
            collection: indexList
        });
    },
    tapNav:function(e){
        let that = this;
        let url = that.data.collection.tabMenus[e.currentTarget.dataset.index].skipUrl
        console.log(url)
        wx.navigateTo({
            url: url,
        });
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