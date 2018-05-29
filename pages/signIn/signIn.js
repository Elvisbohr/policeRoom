// pages/signIn/signIn.js
var app = getApp()
const util = require('../../utils/times.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取当前地址
        this.getCoordinates();
        //获取当前时间
        var time = util.formatTime(new Date());
        this.setData({
            time: time
        });
    },
    // 使用腾讯地图获取城市
    getCoordinates: function () {
        var that = this,
            // 实例化腾讯地图API核心类
            qqmapsdk = new QQMapWX({
                key: app.globalData.qqxcxKey // 必填
            }),
            data = {};

        //1、获取当前位置坐标
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var data = {};
                //3、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                console.log(res)
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function (addressRes) {
                        console.log('当前位置', addressRes)
                        let city = addressRes.result.address_component.city;
                        let address = addressRes.result.address
                        that.setData({
                            'city': city,
                            'address': address,
                        });
                        data.lat = res.latitude;
                        data.lon = res.longitude;
                        data.city = city;
                        app.globalData.lat = res.latitude;
                        app.globalData.lon = res.longitude;
                        console.log(data);
                    }
                });

                //成功回调
                that.setData({
                    lat: res.latitude,
                    lon: res.longitude,
                });


            },
            fail: function (info) {
                wx.showToast({
                    title: '网络错误',
                });
            }
        })

    },
    signIn:function(){
        wx.showToast({
            title: '打卡成功',
            icon: 'success',
            duration: 2000
        })
        setTimeout(function () {
            wx.switchTab({
                url: '../mine/mine'
            })
        }, 2000)
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