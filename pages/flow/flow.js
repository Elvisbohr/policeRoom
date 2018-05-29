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
        region3: [],
        date: '',
        array: ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '僳僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'],
        top: 0,
        files: '',
        infoData:{},
        flow:true,
        noflow:false,
        relation: 1,
        relation1: 1,
        sex: 1,
        way: 1,
        expressWay:1,
        sexArr:[
          { id: 1, name: '男' },
          { id: 2, name: '女' }
        ],
        relaArr: [
          { id: 1, name: '监护人' },
          { id: 2, name: '户主' }
        ],
        relationArr: [
          { id: 1, name: '随父申报' },
          { id: 2, name: '随母申报' }
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
    // 调用手机相册和照相机
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              wx.showLoading({
                'title': "上传中...",
                'icon': 'loading'
              });
              wx.uploadFile({
                url: app.globalData.adminAddress + '/upload',
                filePath: res.tempFilePaths[0],
                name: 'file',
                success: function (result) {
                  wx:wx.hideLoading()
                  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                  that.setData({
                    files: res.tempFilePaths[0]
                  });
                }
              })
            },
            fail: function (res) {
              wx.showToast({
                'title': '网络错误',
                'icon': 'loading'
              });
            }
        })
    },
    previewImage: function (e) {
        console.log(e)
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: [this.data.files] // 需要预览的图片http链接列表
        })
    },
    // 图片上传

    // 上一步按钮事件
    next: function (e) {
        this.setData({
            top: 0,
            step: Number(e.currentTarget.dataset.step),
        })
    },
    // 下一步按钮事件
    prev: function (e) {
        this.setData({
            top: 0,
            step: Number(e.currentTarget.dataset.step),
        })
    },
    // 图片预览
    previewImg: function () {
        wx.previewImage({
            urls: ['https://djfy.djfy365.com/mall/upload/d-img/a1.jpg']  // 当前显示图片的http链接
        })
    },
    previewImg2: function () {
        wx.previewImage({
            urls: ['https://djfy.djfy365.com/mall/upload/d-img/a2.jpg']  // 当前显示图片的http链接
        })
    },
    // 选择民族
    bindPickerChange: function (e) {
        console.log(e)
        this.setData({
            index: e.detail.value
        })
    },
    // 选择出生年月
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    // 选择地址
    bindRegionChange: function (e) {
        console.log(e)
        if (e.currentTarget.dataset.index=='1'){
          this.setData({
            region: e.detail.value
          })
        } else if(e.currentTarget.dataset.index == '2'){
          this.setData({
            region1: e.detail.value
          })
        } else if (e.currentTarget.dataset.index == '3') {
          this.setData({
            region2: e.detail.value
          })
        } else if (e.currentTarget.dataset.index == '4') {
          this.setData({
            region3: e.detail.value
          })
        }
        
    },
    //选择
    choose: function (e) {
        // 选择性别
        if(e.currentTarget.dataset.index=='sex'){
          this.setData({
            sex: e.currentTarget.dataset.value
          })
        // 选择申请人与婴儿关系
        } else if (e.currentTarget.dataset.index == 'rela') {
          this.setData({
            relation: e.currentTarget.dataset.value
          })
        // 请选择随父申报还是随母申报
        } else if (e.currentTarget.dataset.index == 'relation') {
          this.setData({
            relation1: e.currentTarget.dataset.value
          })
        // 选择领取方式
        } else if (e.currentTarget.dataset.index == 'way') {
          this.setData({
            way: e.currentTarget.dataset.value
          })
        // 选择快递方式
        } else if (e.currentTarget.dataset.index == 'expressWay') {
          this.setData({
            expressWay: e.currentTarget.dataset.value
          })
        }
    },
    // 获取input信息验证
    onFlow:function(e){
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
        } else if (!telReg.test(e.detail.value.tel)){
          wx.showToast({
            title: '联系电话格式不正确',
            icon: 'none'
          });
        } else if (e.detail.value.idCard == '') {
          wx.showToast({
            title: '请输入身份证号',
            icon: 'none'
          });
        } else if (!idReg.test(e.detail.value.idCard)) {
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
        if (e.detail.value.Fname == '') {
          wx.showToast({
            title: '请输入父/母姓名',
            icon: 'none'
          });
        } else if (e.detail.value.FidCard == '') {
          wx.showToast({
            title: '请输入父/母身份证号',
            icon: 'none'
          });
        } else if (!idReg.test(e.detail.value.FidCard)) {
          wx.showToast({
            title: '父/母身份证号码格式不正确',
            icon: 'none'
          });
        } else {
          this.setData({
            top: 0,
            step: Number(e.detail.target.dataset.step),
          })
        }
      } else if (e.detail.target.dataset.index == "4") {
        if (e.detail.value.newName == '') {
          wx.showToast({
            title: '请输入婴儿姓名',
            icon: 'none'
          });
        } else if (e.detail.value.date == '') {
          wx.showToast({
            title: '请选择婴儿出生年月',
            icon: 'none'
          });
        } else if (e.detail.value.family == null) {
          wx.showToast({
            title: '请选择民族',
            icon: 'none'
          });
        } else if (this.data.region1 == '') {
          wx.showToast({
            title: '请选择婴儿籍贯地址',
            icon: 'none'
          });
        } else {
          this.setData({
            top: 0,
            step: Number(e.detail.target.dataset.step),
          })
        }
      } else if (e.detail.target.dataset.index == "5") {
        if (this.data.files == '') {
          wx.showToast({
            title: '请选择照片',
            icon: 'none'
          });
        } else {
          this.setData({
            top: 0,
            step: Number(e.detail.target.dataset.step),
          })
        }
      } else if (e.detail.target.dataset.index == "6") {
        if (this.data.way == 1) {
          this.setData({
            infoData: e.detail.value,
            top: 0,
            step: Number(e.detail.target.dataset.step),
            formId: e.detail.formId
          })
        } else {
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
          } else if (this.data.region2 == '') {
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
          } else if (this.data.region3 == '') {
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
      var that=this,
          data={};
      data.applyName = that.data.infoData.name
      data.openId = app.globalData.openId
      data.formId = that.data.formId
      data.applyTelephone = that.data.infoData.tel
      data.applyIdCard = that.data.infoData.idCard
      data.province = that.data.infoData.address[0]
      data.city = that.data.infoData.address[1]
      data.county = that.data.infoData.address[2]
      data.address = that.data.infoData.delAddress
      data.relation = that.data.relation
      data.follow = that.data.relation1
      data.parentName = that.data.infoData.Fname
      data.parentIdCard = that.data.infoData.FidCard
      data.bobyName = that.data.infoData.newName
      data.bobySex = that.data.sex
      data.ethnic = that.data.infoData.family
      data.birthday = that.data.infoData.date
      data.nativeProvince = that.data.infoData.newAddress[0]
      data.nativeCity = that.data.infoData.newAddress[1]
      data.nativeCounty = that.data.infoData.newAddress[2]
      data.declareIdImg = that.data.files
      data.way = that.data.way
      if (that.data.way==2){
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
        url: app.globalData.adminAddress + '/newborn/add',
        data: data,
        method: 'POST',
        header: {'content-type': 'application/x-www-form-urlencoded'},
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
                delta: 2,
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