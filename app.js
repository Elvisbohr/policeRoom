//app.js
const qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
const config = require('./config');
const QQMapWX = require('./utils/qqmap-wx-jssdk.min.js');

App({
    //全局数据
    globalData: {
        // voidImgSrc: "http://192.168.1.138:8080/jws/upload/article/2017/4/201704261819147359.jpg",
        tabMenus: [],
        navObj: {},//导航数据
        // adminAddress: "https://jws.kulizhi.com/jws",
        // adminAddress: "https://jws.kulizhi.com/police-mini/api",
        adminAddress: "http://192.168.1.115:8080/policere-mini/api",
        // adminAddress: "http://192.168.1.189:9999/police-mini/api",
        pageW: "",//屏幕宽
        pageH: "",//屏幕高        pixelRatio: "",
        colorArr: ["blue", "yellow", "red"],
        attribution: {},
        userInfoWX: { 'avatarUrl': '', 'nickName': '', 'openid': '' },
        community: [],//社区列表
        location: {}, 
        allWeather: ['晴', '多云', '阴', '阵雨', '雷阵雨', '雷阵雨并伴有冰雹', '雨夹雪', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨', '阵雪', '小雪', '中雪', '大雪', '暴雪', '雾', '冻雨', '沙尘暴', '小雨-中雨', '中雨-大雨', '大雨-暴雨', '暴雨-大暴雨', '大暴雨-特大暴雨', '小雪-中雪', '中雪-大雪', '大雪-暴雪', '浮尘', '扬沙', '强沙尘暴', '飑', '龙卷风', '弱高吹雪', '轻霾', '霾'],//所有天气现象
        qqxcxKey: "M6SBZ-PTA36-P5FSA-E44GM-WKOYS-U7F2D", //腾讯地图小程序key
    },
    onLaunch: function () {
        var that = this;
        //获取屏幕宽高
        wx.getSystemInfo({
            success: function (res) {
                that.globalData.pageW = res.windowWidth;
                that.globalData.pageH = res.windowHeight;
                that.globalData.pixelRatio = res.pixelRatio;
            }
        })
        //获取openid
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                  url: that.globalData.adminAddress + '/client/info',
                    method: 'POST',
                    data: {
                        jsCode: res.code,
                    },
                    header: { "content-type": 'application/x-www-form-urlencoded' },
                    success: res => {
                        console.log(res);
                            var user = res.data;
                            console.log('获取openid', res.data.data);
                            that.globalData.openId = res.data.data   //全局储存openId 
                            wx.setStorageSync('openid', res.data.data );//本地存储userID   
                            // 获取用户是否实名认证
                            wx: wx.request({
                                url: that.globalData.adminAddress + '/member/info',
                                data: {
                                    openId: res.data.data
                                },
                                method: 'GET',
                                success: function (res) {
                                    wx.setStorageSync('isAuthentication', res.data.data);
                                },
                                fail: function (res) { },
                            })                      
                        
                    },
                    fail: function (res) {
                        console.log('openId获取失败', res);
                    }
                })
            }
        });
        this.getCoordinates();
    },
    getApiData: function (options) {
        let _self = this;
        wx.showLoading({
            title: '请稍后',
            mask: true
        });
        let method = (options.method) ? options.method : 'GET';
        let contentType = (options.header) ? options.header : 'application/json';
        let param = {
            url: _self.globalData.apiUrl + options.url,
            data: options.data,
            method: method,
            header: {
                'content-type': contentType // 默认值
            }
        }
        console.log(param)
        wx.request({
            url: _self.globalData.apiUrl + options.url,
            data: options.data,
            method: method,
            header: {
                'content-type': contentType // 默认值
            },
            success: function (res) {
                if (res.data.status !== 200) {
                    wx.showToast({
                        title: '网络不太给力哦！',
                    })
                } else {
                    options.success(res.data);
                }
            }
        })
    },
    
    uploadFile: function (result, pathArr, curIndex) {
        var that = this;
        if (curIndex < pathArr.length) {
            wx.request({
                url: app.globalData.adminAddress + '/api/category',
                data: {},
                method: 'GET',
                success: function (res) {
                    result.push(pathArr[curIndex]);
                    that.uploadFile(result, pathArr, ++curIndex);
                }
            })
        }
        return result;
    },
    // 使用腾讯地图获取城市
    getCoordinates: function () {
        var that = this,
            // 实例化腾讯地图API核心类
            qqmapsdk = new QQMapWX({
                key: that.globalData.qqxcxKey // 必填
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
                        data.lat = res.latitude;
                        data.lon = res.longitude;
                        data.city = city;
                        that.globalData.lat = res.latitude;
                        that.globalData.lon = res.longitude;
                        that.globalData.address = address;
                        console.log('1111',address);
                    }
                });         
            },
            fail: function (info) {
                wx.showToast({
                    title: '网络错误',
                });
            }
        })

    },
    contains: function (arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
})