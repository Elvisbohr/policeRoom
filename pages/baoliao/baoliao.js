var app = getApp()
Page({
  data: {
    address: '',
    video: '',
    quList: [],
    quText: '',
    curQuId: -1,
    dizhiIcon: '../../images/dizhi.png',
    iconPic: '../../images/icon-pic.png',
    iconCamera: '../../images/icon-camera.png',
    iconShoot: '../../images/icon-shoot.png',
    preImg: [],
    preImgTitle: '',
    preVideo: '',
    upImags: '',
    upTitleImags: '',
    submitTitle: '',
    submitText: ''
  },
  titleInp: function (e) {
    this.setData({
      submitTitle: e.detail.value
    })
  },
  textInp: function (e) {
    this.setData({
      submitText: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    const that = this
    let mynum = Number(e.detail.value) + 1
    console.log(mynum)
    console.log(typeof(mynum))
    let arr = this.data.quList
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].id == Number(mynum)) {
        that.setData({
          quText: arr[i].name,
          curQuId: arr[i].id
        })
      }
    }
    console.log(that.data.quText)
  },
  onLoad: function (options) {
    const that = this
    // 获取地址
    this.setData({
      address: app.globalData.address
    })
    wx.setNavigationBarTitle({
      title: '我要报料'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2979ff'
    })
    // 请求接口 区列表
    wx.request({
      url: app.globalData.adminAddress + '/district',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          that.setData({
            quList: res.data.data
          })
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
  goTi: function () {
    const that = this
    console.log(this.data.upImags)
    if (this.data.submitTitle.length === 0) {
      wx.showToast({
        title: '请输入标题',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if (this.data.submitText.length === 0) {
      wx.showToast({
        title: '请输入内容',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if (this.data.preImgTitle.length === 0) {
      wx.showToast({
        title: '请上传头图',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if (this.data.curQuId === -1) {
      wx.showToast({
        title: '请选择区域',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    var o={};
    o.title= that.data.submitTitle
      o.content=that.data.submitText
       o. imgUrls= that.data.upImags
         o. cover= that.data.upTitleImags
           o. district=that.data.curQuId
            o.video= that.data.video
             o.anonymous= 2
               o.openId=app.globalData.openId
                o.lbs= '123'
                o.show= 1
                console.log("视频")
                console.log(o)
    wx.request({
      url: app.globalData.adminAddress + '/snapshot/upload',
      data: {
        title: that.data.submitTitle,
        content: that.data.submitText,
        imgUrls: that.data.upImags,
        cover: that.data.upTitleImags,
        district: that.data.curQuId,
        video: that.data.video,
        anonymous: 2,
        openId: app.globalData.openId,
        lbs: '123',
        show: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1000
          })
          wx.navigateBack()
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
  myUpload: function (tempFilePaths) {
    const that = this
    // 上传
    for (let i = 0, len = tempFilePaths.length; i < len; i++) {
      wx.uploadFile({
        url: app.globalData.adminAddress + '/upload',
        filePath: tempFilePaths[i],
        name: 'file',
        formData: {},
        success: function (res) {
          let result = JSON.parse(res.data)
          console.log(result)
          if (result.status === 200) {
            let newStr = result.data[0]
            let oldStr = that.data.upImags
            let conStr = ''
            if (oldStr.length === 0) {
              conStr = newStr
            } else {
              conStr = oldStr + ',' + newStr
            }
            that.setData({
              upImags: conStr
            })
          } else {
            wx.showToast({
              title: result.data.msg,
              icon: 'loading',
              duration: 1000
            })
          }
        }
      })
    }
  },
  myUploadTitlePic: function (tempFilePaths) {
    const that = this
    let upFile = null
    console.log(typeof (tempFilePaths))
    upFile = tempFilePaths[0]
    // 上传
    wx.uploadFile({
      url: app.globalData.adminAddress + '/upload',
      filePath: upFile,
      name: 'file',
      formData: {},
      success: function (res) {
        let result = JSON.parse(res.data)
        console.log(result)
        if (result.status === 200) {
          let newStr = result.data[0]
          that.setData({
            upTitleImags: newStr
          })
        } else {
          wx.showToast({
            title: result.data.msg,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },
  myUploadVideo: function (tempFilePaths) {
    const that = this
    let upFile = null
    upFile = tempFilePaths
    // 上传
    wx.uploadFile({
      url: app.globalData.adminAddress + '/upload',
      filePath: upFile,
      name: 'file',
      formData: {},
      success: function (res) {
        let result = JSON.parse(res.data)
        console.log(result)
        if (result.status === 200) {
          let newStr = result.data[0]
          that.setData({
            video: newStr
          })
        } else {
          wx.showToast({
            title: result.data.msg,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },
  goPic: function () {
    const that = this
    let len = that.data.preImg.length
    let remain = 9 - len
    if (len >= 9) {
      console.log('不能超过9张')
      wx.showToast({
        title: '最多选择9张照片',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.chooseImage({
        count: remain, // 默认9
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          let tempArr = that.data.preImg
          let resultArr = tempArr.concat(tempFilePaths)
          // 上传
          that.myUpload(tempFilePaths)
          // 预览
          that.setData({
            preImg: resultArr
          })
        }
      })
    }
  },
  goTitlePic: function () {
    const that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        // 上传
        that.myUploadTitlePic(tempFilePaths)
        // 预览
        that.setData({
          preImgTitle: tempFilePaths[0]
        })
      }
    })
  },
  goCamera: function () {
    const that = this
    let len = that.data.preImg.length
    let remain = 9 - len
    if (len >= 9) {
      console.log('不能超过9张')
      wx.showToast({
        title: '最多选择9张照片',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.chooseImage({
        count: remain, // 默认9
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          let tempArr = that.data.preImg
          let resultArr = tempArr.concat(tempFilePaths)
          // 上传
          that.myUpload(tempFilePaths)
          // 预览
          that.setData({
            preImg: resultArr
          })
        }
      })
    }
  },
  goShoot: function () {
    const that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log('视频路径---')
        console.log(res.tempFilePath)
        // 上传
        that.myUploadVideo(res.tempFilePath)
        // 预览
        that.setData({
          preVideo: res.tempFilePath
        })
      }
    })
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