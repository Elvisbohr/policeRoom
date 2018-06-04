//包含高德地图js文件
var amapFile = require('../../lib/amap-wx.js');
// import tabMenus from '../../utils/indexList.js';

//获取应用实例
var app = getApp();
Page({
    data: {
        serverAddress: app.globalData.serverAddress,
        // tabMenus: tabMenus,
        //树叶组
        leaves: [
            "../../img/flower/flower_03.png",
            "../../img/flower/flower_07.png",
            "../../img/flower/flower_11.png",
            "../../img/flower/flower_14.png",
            "../../img/flower/flower_18.png",
            "../../img/flower/flower_22.png"
        ],
        //人物组
        imgArr: ['https://jws.kulizhi.com/jws/upload/police/1.png', 'https://jws.kulizhi.com/jws/upload/police/2.png', 'https://jws.kulizhi.com/jws/upload/police/3.png', 'https://jws.kulizhi.com/jws/upload/police/4.png', 'https://jws.kulizhi.com/jws/upload/police/5.png', 'https://jws.kulizhi.com/jws/upload/police/6.png', 'https://jws.kulizhi.com/jws/upload/police/7.png', 'https://jws.kulizhi.com/jws/upload/police/8.png', 'https://jws.kulizhi.com/jws/upload/police/9.png'],
        downImageArr: [],
        t: "",
        stTimeLength: 100,//第二个计时器的时间间隔
        canvasShow: true,
        weatherShow: true,//是否显示天气
        weather: {},//天气信息
        canvasW: 0,//canvas宽
        canvasH: 0,//canvas高
        btnAni: "",
        loadingShow: false,//是否显示loading
        community: { id: "", name: "" },
        navObj: {},
        perform: true,
        folder: 'spring'
        // folder: 'duanwu'
        // folder: 'newYears'
        // folder: 'winter'    
    },
    onShow: function () {
        var self = this;
        var chooseId = app.globalData.cid;
        if (chooseId !== undefined) {
            var temp = { id: app.globalData.cid, name: app.globalData.name };
            self.setData({
                community: temp,
            });
        }
        // this.judgeUser();
        var that = this;
        //动画图片
        //1.向服务器请求数据,判断是否有图片路径存在
        //前期先存入缓存中
        wx.getStorage({
            key: "elvesArr",
            success: function (data) {
                //证明缓存中有图片路径时,表示图片已存入本地,直接调取
                that.setData({
                    downImageArr: data.data,
                    perform: true
                })
                that.judgePic(0);
            },
            fail: function () {
                //证明缓存中没有图片路径时,表示图片没有存入本地,执行downImage
                that.downImage(0);
            }
        });
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
                //拼接数组,加入跳转地址
                var navObj = res.data.data;
                for (var i = 0; i < navObj.length; i++) {
                    if (navObj[i].name == "党建文化") {
                        navObj[i].skipUrl = "../dang/dang?pid=" + navObj[i].pid + '&id=' + navObj[i].id + '&name=' + navObj[i].name;
                    } else if (navObj[i].name == "阳光警务") {
                        navObj[i].skipUrl = "../dang/dang?pid=" + navObj[i].pid + '&id=' + navObj[i].id + '&name=' + navObj[i].name;
                    } else if (navObj[i].name == "警民家园") {
                        navObj[i].skipUrl = "../notice/notice";
                    } else if (navObj[i].name == "在线办事") {
                        navObj[i].skipUrl = "../dZxbs/dZxbs";
                    } else if (navObj[i].name == "个人中心") {
                        navObj[i].skipUrl = "../mine/mine";
                    }
                }
                that.setData({
                    tabMenus: navObj
                })
            }
        })
    },
    onHide: function () {
        this.setData({
            perform: false,

        });
    },
    onUnload: function () {
        this.setData({
            perform: false
        });
    },
    //页面加载完毕,获取天气信息
    onLoad: function (options) {
        // 4.24-zds-end
        var that = this;
        this.getWeather(options);
        // 4.24-zds-start
        const self = this;
        var chooseId = app.globalData.cid;
        //设置canvas的宽和高
        this.setData({
            canvasW: 750 / 1334 * (app.globalData.pageH * 0.86),
            canvasH: app.globalData.pageH * 0.86,
        })
        //获取nav数据
        let navdata = {};
        navdata.pid = 0;
        navdata.type = 1;
        that.indexNav(navdata);
    },
    //获取天气信息
    getWeather: function (options) {
        var that = this;
        var myAmapFun = new amapFile.AMapWX({ key: 'e5b8d233f64bd67976a768adfdb149a0' });
        myAmapFun.getWeather({
            success: function (data) {
                var weather = data.liveData,
                    allWeather = app.globalData.allWeather;
                for (var i = 0; i < allWeather.length; i++) {
                    if (weather.weather == allWeather[i]) {
                        weather["weaImg"] = "../../img/w" + (i + 1) + ".png";
                        that.setData({
                            weather: weather,
                            weatherShow: false
                        })
                    }
                }
                //更改图标
            },
            fail: function (info) {
                wx.showModal({ title: info.errMsg })
            }
        });
        // 没有传参就自动获取地理位置
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
                        data: { y: data[0].latitude, x: data[0].longitude, address: data[0].name },
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
    //判断存入缓存中的图片是否存在
    judgePic: function (initNum) {
        var that = this;
        wx.getImageInfo({
            src: that.data.downImageArr[initNum],
            success: function (res) {
                //为最后一张时开始动画
                if (initNum == that.data.downImageArr.length - 1) {
                    that.elevsStart();
                } else {//否则继续判断图片是否存在
                    initNum++;
                    that.judgePic(initNum);
                }
            },
            //当图片不存在时,重新下载图片
            fail: function () {
                that.downImage(initNum, true);
            }
        })
    },
    //下载图片到本地
    downImage: function (initNum, single) {
        var that = this;
        wx.downloadFile({
            url: that.data.imgArr[initNum],
            type: 'image',
            success: function (res) {
                //single为undefined时,证明没有存储过图片,
                //single为true时,证明存储过图片但在当前路径找不到,需重新下载图片
                if (!single) {
                    //拼成数组
                    that.data.downImageArr.push(res.tempFilePath);
                    initNum++;
                    if (initNum < that.data.imgArr.length) {
                        that.downImage(initNum)
                    } else {
                        wx.setStorage({
                            key: 'elvesArr',
                            data: that.data.downImageArr,
                            success: function (res) {
                                that.elevsStart();
                            }
                        })
                        wx.hideToast();
                    }
                } else {
                    //重新拼写downImageArr数组
                    var downImageArr = that.data.downImageArr;
                    downImageArr[initNum] = res.tempFilePath;
                    that.setData({
                        downImageArr: downImageArr
                    })
                    //更新缓存
                    wx.setStorage({
                        key: 'elvesArr',
                        data: that.data.downImageArr,
                        success: function (res) {
                            //为最后一张时,所有图片判别完毕,开始动画
                            if (initNum == (that.data.downImageArr.length - 1)) {
                                that.elevsStart();
                            }
                        }
                    })
                    if (initNum < (that.data.downImageArr.length - 1)) {
                        initNum++;
                        that.judgePic(initNum);//继续判断下一张
                    }

                }


            },
            fail: function (res) {
                wx.showModal({
                    title: '提示',
                    content: '网络请求错误,请开启网络!',
                    success: function (res) {
                    }
                })
            }
        })
    },
    //开始动画
    elevsStart: function () {
        var that = this,
            obj = {
                'ctx': wx.createCanvasContext("myCanvas"),
                'initNum': 0,
                'that': this,
                'imgArr': that.data.downImageArr,
                'imgW': that.data.canvasW,
                'imgH': that.data.canvasH
            }
        that.switchPicture(obj);
    },
    //用递归来使canvas中的图片动起来
    switchPicture: function (obj) {
        var that = this;
        setTimeout(function () {
            //1.清除画布
            obj.ctx.clearRect(0, 0, obj.imgW, obj.imgH);
            //2.画图
            obj.ctx.drawImage(obj.imgArr[obj.initNum], 0, 0, obj.imgW, obj.imgH);
            obj.ctx.draw();
            //3下标递增
            obj.initNum = obj.initNum + 1;
            //如果为第五章时停顿3s
            if (obj.initNum == 6 || obj.initNum == obj.imgArr.length) {
                that.setData({
                    stTimeLength: 3000
                })
            } else {
                that.setData({
                    stTimeLength: 100
                })
            }
            //4.限制
            if (obj.initNum >= obj.imgArr.length) {
                //重置下标为0
                obj.initNum = 0;
                that.setData({
                    canvasShow: false,
                    loadingShow: true,
                    btnAni: "animated"
                })
            }
            //5.继续执行函数
            if (that.data.perform) {
                that.switchPicture(obj);
            }
        }, that.data.stTimeLength)
    },
    //页面跳转
    skip: function (e) {
        var communityId = this.data.community.id;
        if (communityId) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
                success: function (res) {
                    // 家园页面
                }
            })
            
        } else {
            wx.showToast({
                "title": "请选择社区",
                "icon": "loading",
                'duration': 1000
            })
        }
    },
    //我的页面跳转
    skipLogin: function (e) {
        console.log(e)
        wx.navigateTo({
            url: '../mine/mine',
            success: function (res) {
                // 家园页面

            }
        })
    },
    //判断当前用户是什么用户
    // judgeUser: function () {
    //     var that = this,
    //         userInfo = wx.getStorageSync('userInfo');

    //     if (userInfo.role == 1) {
    //         //警务人员,显示警务助手按钮
    //         app.globalData.assistant = false;
    //         app.globalData.clockIn = true;
    //         that.setData({
    //             assistant: false,
    //             clockIn: true,
    //         })
    //     } else if (userInfo.role == 2) {
    //         //防控人员,显示打卡按钮
    //         app.globalData.assistant = true;
    //         app.globalData.clockIn = false;
    //         that.setData({
    //             assistant: true,
    //             clockIn: false,
    //         })
    //     } else {
    //         app.globalData.assistant = true;
    //         app.globalData.clockIn = true;
    //         that.setData({
    //             assistant: true,
    //             clockIn: true,
    //         })
    //     }
    // },
    // punchCard: function () {
    //     var x = this.data.longitude,
    //         y = this.data.latitude,
    //         address = this.data.addressName,
    //         userId = wx.getStorageSync('userInfo').userId;
    //     wx.showLoading({
    //         'title': "loading...",
    //         'mask': true
    //     });
    //     wx.getStorage({
    //         key: 'userInfo',
    //         success: function (res) {
    //             // success
    //             var userId = res.data.userId;
    //             wx.request({
    //                 url: app.globalData.adminAddress + '/api/prevention/punch',
    //                 data: { 'userId': userId, 'x': x, 'y': y, 'address': address },
    //                 method: 'GET',
    //                 success: function (res) {
    //                     wx.hideLoading();
    //                     setTimeout(function () {
    //                         if (res.data.msg === "OK") {
    //                             wx.showToast({
    //                                 "title": "打卡成功",
    //                                 "icon": "success",
    //                                 'duration': 2000
    //                             })
    //                         } else {
    //                             wx.showToast({
    //                                 "title": res.data.msg,
    //                                 "icon": "loading ",
    //                                 'duration': 2000
    //                             })
    //                         }
    //                     }, 200)
    //                 },
    //                 fail: function (res) {
    //                     // fail
    //                 }
    //             })
    //         },
    //     });

    // },
    //跳转到定位社区页面
    location: function (e) {
        wx.navigateTo({
            url: '../cellselection/cellselection'
        })
    },
})
