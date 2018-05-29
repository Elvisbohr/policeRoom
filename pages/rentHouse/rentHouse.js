// pages/rentHouse/rentHouse.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    step:1,
    sex:1,
    book:1,
    top:0,
    houseCategory:1,
    houseUse:1,
    fire:1,
    code:1,
    sexArr:[
      { id: 1, name: '男' },
      { id: 2, name: '女' }
    ],
    bookArr:[
      { id: 1, name: '是' },
      { id: 2, name: '否' }
    ],
    houseCategoryArr:[
      { id: 1, name: '楼房' },
      { id: 2, name: '平房' },
      { id: 3, name: '临时建房' },
      { id: 4, name: '地下建筑' }
    ],
    houseUseArr:[
      { id: 1, name: '居住' },
      { id: 2, name: '办公' },
      { id: 3, name: '生产' },
      { id: 4, name: '经营' },
      { id: 5, name: '仓储' },
      { id: 6, name: '其他' }
    ],
    fireArr: [
      { id: 1, name: '有' },
      { id: 2, name: '无' }
    ],
    cordArr: [
      { id: 1, name: '是' },
      { id: 2, name: '否' }
    ],
    formId:''
  },
  next: function (e) {
    console.log(e)
    this.setData({
      top: 0,
      step: Number(e.currentTarget.dataset.step)
    })
  },
  prev: function (e) {
    console.log(e)
    this.setData({
      top: 0,
      step: Number(e.currentTarget.dataset.step)
    })
  },
  //选择
  choose: function (e) {
    if (e.currentTarget.dataset.index == 'sex') {
      this.setData({
        sex: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'book') {
      this.setData({
        book: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'houseCategory') {
      this.setData({
        houseCategory: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'houseUse') {
      this.setData({
        houseUse: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'fire') {
      this.setData({
        fire: e.currentTarget.dataset.value
      })
    } else if (e.currentTarget.dataset.index == 'code') {
      this.setData({
        code: e.currentTarget.dataset.value
      })
    }  
  },
  // 获取input信息
  onFlow: function (e) {
    // console.log(e)
    var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(e.detail.target.dataset.index=="1"){
      if (e.detail.value.name==''){
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
      } else if (e.detail.value.tel == ''){
        wx.showToast({
          title: '请输入联系电话',
          icon: 'none'
        });
      } else if (!telReg.test(e.detail.value.tel)){
        wx.showToast({
          title: '联系电话格式不正确',
          icon: 'none'
        });
      }else if (e.detail.value.idCard == '') {
        wx.showToast({
          title: '请输入身份证号',
          icon: 'none'
        });
      } else if (!idReg.test(e.detail.value.idCard)) {
        wx.showToast({
          title: '身份证号码格式不正确',
          icon: 'none'
        });
      } else if (e.detail.value.delAddress == '') {
        wx.showToast({
          title: '请输入详细地址',
          icon: 'none'
        });
      } else if (e.detail.value.code == '') {
        wx.showToast({
          title: '请输入出租房屋编号',
          icon: 'none'
        });
      }else{
        this.setData({
          top: 0,
          step: Number(e.detail.target.dataset.step),
        })
      }
    } else if (e.detail.target.dataset.index == "2") {
      if (e.detail.value.area == '') {
        wx.showToast({
          title: '请输入出租面积',
          icon: 'none'
        });
      } else if (e.detail.value.homeNum == '') {
        wx.showToast({
          title: '请输入出租间数',
          icon: 'none'
        });
      } else if (e.detail.value.bedNum == '') {
        wx.showToast({
          title: '请输入床位数',
          icon: 'none'
        });
      } else if (e.detail.value.Bcord == '') {
        wx.showToast({
          title: '请输入房产出租登记备案证号',
          icon: 'none'
        });
      } else {
        this.setData({
          top: 0,
          step: Number(e.detail.target.dataset.step),
        })
      }
    } else if (e.detail.target.dataset.index == "3"){
      if (e.detail.value.Cname == '') {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
      } else if (e.detail.value.CidCard == '') {
        wx.showToast({
          title: '请输入身份证号码',
          icon: 'none'
        });
      } else if (!idReg.test(e.detail.value.CidCard)) {
        wx.showToast({
          title: '身份证号码格式不正确',
          icon: 'none'
        });
      } else if (e.detail.value.Ccard == '') {
        wx.showToast({
          title: '请输入承租屋编码',
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
  },
  submit: function () {
    wx.showLoading({
      'title': "loading...",
      'mask': true
    });
    var that=this,
        data={};
    data.openId = app.globalData.openId
    data.formId = that.data.formId
    data.ownerName = that.data.infoData.name
    data.ownerSex = that.data.sex
    data.ownerTelephone = that.data.infoData.tel
    data.ownerIdCard = that.data.infoData.idCard
    data.address = that.data.infoData.delAddress
    data.securityCredential = that.data.book
    data.houseCode = that.data.infoData.code
    data.houseType = that.data.houseCategory
    data.houseUse = that.data.houseUse
    data.rentArea = that.data.infoData.area
    data.rentCount = that.data.infoData.homeNum
    data.bedCount = that.data.infoData.bedNum
    data.fireFacility = that.data.fire
    data.record = that.data.code
    data.recordNo = that.data.infoData.Bcord
    data.lesseeName = that.data.infoData.Cname
    data.lesseeIdCard = that.data.infoData.CidCard
    data.lesseeCode = that.data.infoData.Ccard
    wx.request({
      url: app.globalData.adminAddress + '/rental/add',
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