// pages/hdDetails/hdDetails.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        intro: [
            {
                tit: '一、活动背景',
                cont: [
                    '为加强校园周边交通秩序,确保学生的交通安全,石岩交警中队、上屋小学以及校家委会联合组建“家校警交通安全护航队,共同为学生的安全保驾护航。'
                ],
            }, {
                tit: '二、参与对象',
                cont: [
                    '请有时间有爱心的欢乐小学家长志愿者积极报名参加交通疏导志愿者活动。'
                ],
            }, {
                tit: '三、活动时间',
                cont: [
                    '上午： 11:20—12:20'
                ]
            }, {
                tit: '四、活动内容',
                cont: [
                    '学校门口上下学高峰期提供交通疏导服务,劝导学生或社会人士文明交通行为,创建和谐美好有序的交通安全环境。'
                ],
            }, {
                tit: '五、活动要求',
                cont: [
                    '1.活动期间,听从领队指挥,文明劝导,仪态端庄,举止优雅,热心服务,以身作则树立榜样。',
                    '1.活动期间,听从领队指挥,文明劝导,仪态端庄,举止优雅,热心服务,以身作则树立榜样。',
                    '1.活动期间,听从领队指挥,文明劝导,仪态端庄,举止优雅,热心服务,以身作则树立榜样。',
                    '4.如果临时有事不能前来,请提前联系领队说明情况。',
                    '5.在指引活动中,请注意自身的安全。在参与服务过程中请勿利用志愿者身份谋取个人利益,开展自身工作。',

                ],
            }, {
                tit: '六、特别提醒',
                cont: [
                    '1.注意活动安全',
                    '2.不与人发生争执，一劝导为主；',
                    '3.文明用语，礼貌待人，遇到突发事件要及时向领队报告。'
                ],
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let xqData = {};
        xqData.id = options.id
        that.getList(xqData);
        that.setData({
            hdId: options.id
        })
    },
    signUp: function (e) {
        let that = this;
        wx.request({
            url: app.globalData.adminAddress + '/volunteer/info',
            data: {
                openId: app.globalData.openId
            },
            method: "GET",
            success: function (res) {
                if (res.data.status == 200) {
                    let data = {};
                    data.activityId = res.data.data.id  //志愿者id
                    data.volunteerId = that.data.hdId   //活动id
                    data.formId = e.detail.formId   //formid
                    console.log(data)
                    wx.request({
                        url: app.globalData.adminAddress + '/volunteer/activity/apply',
                        data: data,
                        method: "GET",
                        // header: { 'content-type': 'application/x-www-form-urlencoded' },
                        success: function (res) {
                            if (res.data.status == 200) {
                                console.log('志愿者报名', res.data)
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'success',
                                    duration: 2000
                                })
                            } else {
                                wx.showModal({
                                    title: res.data.msg,
                                    showCancel: false,
                                    success: function (res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定')
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: res.data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                }

            }
        })


    },
    getBm() {

    },
    getList(data) {
        let that = this;
        wx.request({
            url: app.globalData.adminAddress + '/volunteer/activity/detail',
            data: data,
            method: "GET",
            // header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('志愿者活动详情', res.data.data)
                that.setData({
                    details: res.data.data,
                })
            }
        })
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