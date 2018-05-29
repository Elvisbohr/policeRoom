// pages/Certification/Certification.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        verifyInfo: '获取验证码',  //更改60s
        isdisable: false, //60秒之内不能重复发送;
        region: ['省份', '城市', '县区'],
        index: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //先获取手机号用来发送验证码
    num: function (e) {
        this.setData({
            num: e.detail.value,
        })
    },
    // 获取验证码
    verify: function () {
        var that = this
        var count = 60;
        var re = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
        if (!re.test(that.data.num)) {
            wx.showModal({
                title: "请输入正确的手机号"
            });
            return false;
        } else {
            if (that.data.isdisable == false) {
                // 上传页面
                  wx.request({
                    url: app.globalData.adminAddress + '/member/message',
                      method: "POST",
                      header: { 'content-type': 'application/x-www-form-urlencoded' },
                      data: {
                        telphone: that.data.num
                      },
                      success: function (res) {
                          wx.showToast({
                              title: '发送成功',
                              mask: true
                          });
                          //   console.log('uzm')

                          that.setData({
                              verifynum: res.data.data
                          })
                          console.log(that.data.verifynum)
                      }
                  })
                // 展示用
                wx.showToast({
                    title: '验证码发送成功',
                    mask: true
                });
                // 展示用End
                var timer = setInterval(function () {
                    count--;
                    if (count >= 1) {
                        that.setData({
                            verifyInfo: count + 's'
                        })
                    } else {
                        that.setData({
                            verifyInfo: '获取验证码'
                        })
                        clearInterval(timer);
                        that.data.isdisable = false;
                    }
                }, 1000);
                that.data.isdisable = true;
            }
        }
    },
    bindRegionChange: function (e) {
        //   console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    formSubmit:function(e){
      console.log(e.detail.value)
      var re = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
      var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      var o = e.detail.value
      if(o.name==''){
        wx.showToast({
            title: '请输入姓名',
            icon: 'none'
        })
      }else if(o.sfznum==''){
        wx.showToast({
          title: '请输入身份证号',
          icon: 'none'
        })
      } else if (!idReg.test(o.sfznum)) {
        wx.showToast({
          title: '请输入正确的身份证号',
          icon: 'none'
        })
      } else if (o.phone == '') {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none'
        })
      } else if (!re.test(o.phone)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
      } else if (o.yzm == '') {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
      } else if (o.region[0] == '省份') {
        wx.showToast({
          title: '请选择地址',
          icon: 'none'
        })
      } else if (o.address == '') {
        wx.showToast({
          title: '请输入现居住详细地址',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '请稍等',
          icon: 'loading'
        })
        var data={};
        data.openId = app.globalData.openId;
        data.realName = o.name;
        data.idCard = o.sfznum
        data.telephone = o.phone
        data.message = o.yzm
        data.province = o.region[0]
        data.ctiy = o.region[1]
        data.county = o.region[2]
        data.address = o.address
        wx.request({
          url: app.globalData.adminAddress + '/member/edit',
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
              wx.setStorageSync('isAuthentication',true)
              setTimeout(function () {
                wx.navigateTo({
                    url: '../hint/hint'
                })
              }, 2800);
            } else if (res.data.status == 500){
              wx.showToast({
                'title': res.data.msg,
                'icon': "none"
              });
            } else {
              wx.showToast({
                'title': "提交失败",
                'icon': "none"
              });
            }
          },
          fail: function (res) {
            wx.hideLoading();
            console.log("提交失败");
          }
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