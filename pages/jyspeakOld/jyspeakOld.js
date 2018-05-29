// pages/jyspeak/jyspeak.js
var app = getApp();
Page({
  data: {
    serverAddress:app.globalData.serverAddress,
    'nowAddress':"",//当前位置
    imgstart: true,
    way:['匿名','公开'],
    wayIndex:0,
    title:""
  },
  // upload: function () {
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePaths = res.tempFilePaths
  //     }
  //   })
  // },
   //选择图片
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      // count: 3,// 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgstart:false,
          files: res.tempFilePaths
        });
      }
    })
  },
  //预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  bindDateChange:function(e){

    this.setData({
      date: e.detail.value
    })

  },
  //定位当前位置
  chooseLocation:function(){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        that.setData({
          'nowAddress':res.name
        })
      }
    })
  },
  put:function(){
    wx.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
  },
  onLoad: function (options) {
    console.log(options)
     var that = this;
      // 页面初始化 options为页面跳转所带来的参数
      wx.setNavigationBarTitle({
        title: options.title
      })
      that.setData({
        title:options.title
      });
  },
  //选择标签
  setChecked: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      arr = that.data.typeArr;
    if (arr[index].iconShow == true) {
      arr[index].iconShow = false;
      arr[index].curClass = "on";
    } else {
      arr[index].iconShow = true;
      arr[index].curClass = "";
    }
    that.setData({
      'typeArr': arr
    })
  }
})