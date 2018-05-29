// pages/volunteerIndex/volunteerIndex.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum: 1,
        pageSize: 5,
        moreTit: '加载更多',
        banner: [
            'https://djfy.djfy365.com/mall/upload/d-img/vbanner.jpg',
        ],
        tabMenus: [
            {
                id: 1,
                icon: '../../images/zyz/sq.png',
                name: '志愿者申请',
                url: '../dVolunteer/dVolunteer'
            },
            {
                id: 2,
                icon: '../../images/zyz/jdcx.png',
                url: '../dProgress/dProgress',
                name: '进度查询'
            },
            {
                id: 3,
                icon: '../../images/zyz/hdfc.png',
                url: '../volunteerHdfc/volunteerHdfc',
                name: '活动风采'
            }
        ],
    },
    shopSkip(e) {
        let that = this;
        console.log(e)
        let url = e.currentTarget.dataset.url
        wx: wx.navigateTo({
            url: url,
        })
    },
    getJoin() {
        let that = this;
        wx: wx.navigateTo({
            url: '../hdDetails/hdDetails',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let listData = {};
        listData.pageNum = that.data.pageNum;
        listData.pageSize = that.data.pageSize;
        this.getList(listData)
    },
    getList(data) {
        let that = this

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
            //首次获取
            wx.request({
                url: app.globalData.adminAddress + '/volunteer/activity/list',
                data: data,
                method: "GET",
                // header: { 'content-type': 'application/x-www-form-urlencoded' },
                success: function (res) {
                    console.log('志愿者列表数据', res.data)
                    that.setData({
                        lists: res.data.data.list,
                    })
                }
            })
        }
    },
    //加载更多接口
    loadMore: function () {
        var that = this,
            pageNum = that.data.pageNum,
            data = {};
        if (that.data.pageAll > pageNum) {
            pageNum += 1;
            data.pageNum = pageNum;
            data.pageSize = that.data.pageSize;
            that.setData({
                pageNum: pageNum,
            })
            that.getList(data);

        } else {
            console.log('无数据')
            that.setData({
                moreTit: '暂无更多',
            })
        }
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