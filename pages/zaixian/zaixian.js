var app = getApp()
Page({
    data: {
        catalogBig: [],
        catalogSmall: {},
    },
    onLoad: function (options) {
        const that = this
        wx.setNavigationBarTitle({
            title: '在线办事'
        })
        // 请求接口
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
          url: app.globalData.adminAddress + '/column/list',
            data: {
                type: 2
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                wx.hideLoading()
                console.log(res)
                if (res.data.status === 200) {
                    let arr = res.data.data
                    // 构造大分类
                    let tempBigArr = []
                    for (let i = 0, len = arr.length; i < len; i++) {
                        if (0 === arr[i].pid) {
                            tempBigArr.push(arr[i])
                        }
                    }
                    console.log(tempBigArr)
                    // 构造内容分类
                    let tempSmall = {}
                    for (let i = 0, len = tempBigArr.length; i < len; i++) {
                        let tempSmallArr = []
                        for (let j = 0, len = arr.length; j < len; j++) {
                            if (tempBigArr[i].id === arr[j].pid) {
                                tempSmallArr.push(arr[j])
                            }
                        }
                        console.log(tempBigArr[i])
                        tempSmall[tempBigArr[i]['name']] = tempSmallArr
                    }
                    console.log(tempBigArr)

                    that.setData({
                        catalogBig: tempBigArr,
                        catalogSmall: tempSmall
                    })
                    console.log('catalogSmall------')
                    console.log(that.data.catalogSmall)
                    // 写死户籍业务图标
                    let hujiArr = [
                        {
                            id: 991,
                            name: '户口申报',
                            icon: ''
                        },
                        {
                            id: 991,
                            name: '户口迁入',
                            icon: ''
                        },
                        {
                            id: 991,
                            name: '户口迁出',
                            icon: ''
                        }
                    ]

                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'loading',
                        duration: 1000
                    })
                }
            }
        })
    },
    onMyEvent: function (e) {
        console.log(e)
        let myid = e.detail.myId;
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
            switch (myid) { // newborn crime rentHouse
                case 19:
                    wx.navigateTo({
                        url: '../huji/huji?id=1'
                    })
                    break;
                case 20:
                    wx.navigateTo({
                        url: '../huji/huji?id=2'
                    })
                    break;
                case 21:
                    wx.navigateTo({
                        url: '../huji/huji?id=3'
                    })
                    break;
                case 22:
                    wx.navigateTo({
                        url: '../huji/huji?id=4'
                    })
                    break;
                case 23:
                    wx.navigateTo({
                        url: '../huji/huji?id=5'
                    })
                    break;
                case 40:
                    wx.navigateTo({
                        url: '../huji/huji?id=6'
                    })
                    break;
                case 26:
                    wx.navigateTo({
                        url: '../crime/crime'
                    })
                    break;
                case 35:
                    wx.navigateTo({
                        url: '../rentHouse/rentHouse'
                    })
                    break;
                default:
                    wx.showToast({
                        title: '暂未开放',
                        icon: 'loading',
                        duration: 1000
                    })
            }
        // }
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
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