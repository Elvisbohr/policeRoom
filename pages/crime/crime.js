// pages/flow/flow.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    region: ['省份', '城市', '县区'],
    region1: [],
    region2: [],
    way: 1,
    expressWay: 1,
    top: 0,
    files: '',
    record:1,
    cause: 1, 
    recordArr:[
      { id: 1, name: '违法记录' },
      { id: 2, name: '犯罪记录' },
      { id: 3, name: '违法和犯罪记录' }
    ],
    causeArr:[
      { id: 1, name: '接受政审考察' },
      { id: 2, name: '从事特殊活动' },
      { id: 3, name: '从事特殊职业或行业' },
      { id: 4, name: '其他' }
    ],
    wayArr: [
      { id: 1, name: '到所领取' },
      { id: 2, name: '邮寄到付' }
    ],
    expressWayArr: [
      { id: 1, name: 'EMS' },
      { id: 2, name: '顺丰' }
    ],
    formId:''
  },
  next: function (e) {
    console.log(e)
    this.setData({
      top: 0,
      step: Number(e.currentTarget.dataset.step),
    })
  },
  prev: function (e) {
    console.log(e)
    this.setData({
      top: 0,
      step: Number(e.currentTarget.dataset.step),
    })
  },
  bindcancel:function(e){
    console.log(22222222222)
    console.log(e)
  },
  // 选择地址
  bindRegionChange: function (e) {
    if (e.currentTarget.dataset.index == '1') {
      this.setData({
        region: e.detail.value
      })
    } else if (e.currentTarget.dataset.index == '2') {
      this.setData({
        region1: e.detail.value
      })
    } else if (e.currentTarget.dataset.index == '3') {
      this.setData({
        region2: e.detail.value
      })
    }
  },
  // 选择取件方式
  choose: function (e) {
    // console.log(e)
    if (e.currentTarget.dataset.index == 'way') {
      this.setData({
        way: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'expressWay') {
      this.setData({
        expressWay: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'record') {
      this.setData({
        record: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'cause') {
      this.setData({
        cause: e.currentTarget.dataset.value
      })
    } 
  },
  // 获取input信息
  onFlow: function (e) {
    console.log(e)
    var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (e.detail.target.dataset.index == "1") {
      if (e.detail.value.name == '') {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
      } else if (e.detail.value.tel == '') {
        wx.showToast({
          title: '请输入联系电话',
          icon: 'none'
        });
      } else if (!telReg.test(e.detail.value.tel)) {
        wx.showToast({
          title: '联系电话格式不正确',
          icon: 'none'
        });
      } else if (e.detail.value.idcard == '') {
        wx.showToast({
          title: '请输入身份证号',
          icon: 'none'
        });
      } else if (!idReg.test(e.detail.value.idcard)) {
        wx.showToast({
          title: '身份证号码格式不正确',
          icon: 'none'
        });
      } else {
        this.setData({
          top: 0,
          step: Number(e.detail.target.dataset.step),
        })
      }
    } else if (e.detail.target.dataset.index == "2") {
      if (this.data.region[0] == '省份') {
        wx.showToast({
          title: '请选择地址',
          icon: 'none'
        });
      } else if (e.detail.value.delAddress == '') {
        wx.showToast({
          title: '请输入详细地址',
          icon: 'none'
        });
      } else {
        this.setData({
          top: 0,
          step: Number(e.detail.target.dataset.step),
        })
      }
    } else if (e.detail.target.dataset.index == "3") {
      if (e.detail.value.Scause == '') {
        wx.showToast({
          title: '请输入具体事由',
          icon: 'none'
        });
      } else {
        this.setData({
          top: 0,
          step: Number(e.detail.target.dataset.step),
        })
      }
    } else if (e.detail.target.dataset.index == "4") {
      if(this.data.way==1){
        this.setData({
          infoData: e.detail.value,
          top: 0,
          step: Number(e.detail.target.dataset.step),
          formId: e.detail.formId
        })
      }else{
        if (e.detail.value.kname == '') {
          wx.showToast({
            title: '请输入取件人姓名',
            icon: 'none'
          });
        } else if (e.detail.value.ktel == '') {
          wx.showToast({
            title: '请输入取件人联系电话',
            icon: 'none'
          });
        } else if (!telReg.test(e.detail.value.ktel)) {
          wx.showToast({
            title: '取件人联系电话格式不正确',
            icon: 'none'
          });
        } else if (this.data.region1 == '') {
          wx.showToast({
            title: '请选择取件人地址',
            icon: 'none'
          });
        } else if (e.detail.value.kdelAddress == '') {
          wx.showToast({
            title: '请输入取件人详细地址',
            icon: 'none'
          });
        } else if (e.detail.value.Bname == '') {
          wx.showToast({
            title: '请输入办结收件人姓名',
            icon: 'none'
          });
        } else if (e.detail.value.Btel == '') {
          wx.showToast({
            title: '请输入办结收件人联系电话',
            icon: 'none'
          });
        } else if (!telReg.test(e.detail.value.Btel)) {
          wx.showToast({
            title: '办结收件人联系电话格式不正确',
            icon: 'none'
          });
        } else if (this.data.region2 == '') {
          wx.showToast({
            title: '请选择办结收件人地址',
            icon: 'none'
          });
        } else if (e.detail.value.BdelAddress == '') {
          wx.showToast({
            title: '请输入办结收件人详细地址',
            icon: 'none'
          });
        } else {
          this.setData({
            infoData: e.detail.value,
            top: 0,
            step: Number(e.detail.target.dataset.step),
            formId: e.detail.formId
          })
        }
      }   
    }
  },
  submit: function () {
    wx.showLoading({
      'title': "loading...",
      'mask': true
    });
    var that = this,
      data = {};
    data.openId = app.globalData.openId
    data.formId = that.data.formId
    data.name = that.data.infoData.name
    data.telephone = that.data.infoData.tel
    data.idCard = that.data.infoData.idCard
    data.province = that.data.infoData.address[0]
    data.city = that.data.infoData.address[1]
    data.county = that.data.infoData.address[2]
    data.address = that.data.infoData.delAddress
    data.prove = that.data.record
    data.applyReason = that.data.cause
    data.detailReason = that.data.infoData.Scause
    data.way = that.data.way
    if (that.data.way == 2) {
      data.expressWay = that.data.expressWay
      data.expressName1 = that.data.infoData.kname
      data.expressTelephone1 = that.data.infoData.ktel
      data.expressAddress1 = that.data.infoData.kaddress[0] + that.data.infoData.kaddress[1] + that.data.infoData.kaddress[2]
      data.expressDetailAddress1 = that.data.infoData.kdelAddress
      data.expressName2 = that.data.infoData.Bname
      data.expressTelephone2 = that.data.infoData.Btel
      data.expressAddress2 = that.data.infoData.Baddress[0] + that.data.infoData.Baddress[1] + that.data.infoData.Baddress[2]
      data.expressDetailAddress2 = that.data.infoData.BdelAddress
    }
    console.log(data)
    wx.request({
      url: app.globalData.adminAddress + '/crimeprove/add',
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
        } else {
          wx.showToast({
            'title': "提交失败",
            'icon': "success"
          });
        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log("提交失败");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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