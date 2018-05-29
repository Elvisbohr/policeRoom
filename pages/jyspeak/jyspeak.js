var app = getApp();
Page({
    data: {
        'parameter': {
            'categoryId': '',//标签id
            'labelId': '',//分类id
            'communityId': '',//社区id
            'createUserId': '',//登录者id
            'content': '',//内容
            'imgs': [],//图片
            'video': '',//视频
            'phone': '',
            'name': '',
            'address': ''
        }
    },
    onLoad: function (options) {
        console.log('dizi', app.globalData.address)

        var parameter = this.data.parameter;
        parameter.labelId = options.dTypeId;
        this.setData({
            parameter: parameter,
            address: app.globalData.address,
        })
    },
    //1.输入框失去焦点时
    inputBlur: function (e) {
        var name = e.currentTarget.dataset.name,
            parameter = this.data.parameter;
        parameter[name] = e.detail.value;
        this.setData({
            parameter: parameter
        });
    },
    //2.选择图片
    chooseImage: function (e) {
        var that = this;
        //1.选择接口
        wx.chooseImage({
            count: 6, // 最多可以选择的图片张数，默认9
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                //2.显示loading页面
                wx.showLoading({
                    'title': "loading...",
                    'mask': true,
                    'success': function () {
                        //2.上传图片
                        that.uploadImage(res.tempFilePaths, 0, 'imgUrls');
                    }
                });
            }
        })
    },
    //3.选择视频
    chooseVideo: function () {
        var that = this;
        //1.选择视频接口
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
            camera: ['front', 'back'],
            success: function (res) {
                //2.显示loading页面
                wx.showLoading({
                    'title': "loading...",
                    'mask': true,
                    'success': function () {
                        //2.上传视频
                        that.uploadImage([res.tempFilePath], 0, 'videoSrc')
                    }
                });
            },
            fail: function (res) {
            }
        })
    },
    //往服务器上传文件
    uploadImage: function (imgUrls, initNum, uploadType) {
        var that = this;
        //1.判断是否上传完毕
        if (initNum < imgUrls.length) {
            //2.开始上传
            wx.uploadFile({
                url: app.globalData.adminAddress + '/upload',
                filePath: imgUrls[initNum],
                name: 'file' + initNum,
                success: function (res) {
                    var data = JSON.parse(res.data).data;
                    //3.同步数据
                    var parameter = that.data.parameter;
                    if (uploadType == "imgUrls") {
                        parameter.imgs.push(data[0]);
                        //4.继续上传下一张图片
                        that.uploadImage(imgUrls, (initNum + 1), 'imgUrls');
                    } else if (uploadType == "videoSrc") {
                        wx.hideLoading();
                        parameter.video = data[0];
                    }
                    that.setData({
                        parameter: parameter
                    });
                },
                fail: function (res) {
                    wx.showToast({
                        'title': '网络错误',
                        'icon': 'loading'
                    });
                }
            })

        } else {
            wx.hideLoading();
        }
    },
    //提交数据
    formSubmit:function (e) {
      console.log(e.detail.formId)
        var that = this;
        if (that.data.parameter.name == "") { //姓名为必填选项
          wx.showToast({
            'title': "请输入姓名",
            'icon': "loading",
            'duration': 2500
          });
        }else if (that.data.parameter.phone == "" ) { //手机号为必填选项
          wx.showToast({
            'title': "请输入手机号",
            'icon': "loading",
            'duration': 2500
          });
        } else if (!this.checkPhone(that.data.parameter.phone)) {//判断手机号是否正确)
          wx.showToast({
              'title': "手机号不正确",
              'icon': "loading",
              'duration': 2500
          });
        } else if (that.data.parameter.content == "") { //内容为必填选项
          wx.showToast({
            'title': "请输入内容",
            'icon': "loading",
            'duration': 2500
          });
        } else {
            wx.showLoading({
              'title': "loading...",
              'mask': true
            });
            var data = {};
            data.openId = app.globalData.openId;
            data.formId = e.detail.formId;
            data.content = that.data.parameter.content;
            data.telephone = that.data.parameter.phone
            data.name = that.data.parameter.name
            data.geolocation = that.data.address
            data.imgUrls = that.data.parameter.imgs
            data.video = that.data.parameter.video
            console.log(data)
            //3.开始上传数据
            wx.request({
              url: app.globalData.adminAddress + '/suggest/upload',
              data: data,
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                wx.hideLoading();
                if (res.data.status == 200) {
                  setTimeout(function () {
                    wx.showToast({
                      'title': "提交成功",
                      'icon': "success",
                      'duration': 2500
                    });
                  }, 300);
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 2800);
                }
              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            });
        }
    },
    //删除图片接口
    removeFile: function (e) {
        var that = this,
            removeIndex = parseInt(e.currentTarget.dataset.removeIndex),
            parameter = that.data.parameter;

        parameter.imgs.splice(removeIndex, 1);
        that.setData({
            parameter: parameter
        });
    },
    //验证手机号
    checkPhone: function (telphone) {
        if (!(/^1[34578]\d{9}$/.test(telphone))) {
            return false;
        };
        return true;
    },
})