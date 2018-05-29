// pages/sdfb/sdfb.js
var app = getApp();
Page({
  data: {
    inputTitle: '',//当前文章标题
    origin: '人民群众',
    curType: '',//当前编辑的类型
    categoryId: '',//当前模块id
    tabMenu: '',//当前模块名称
    tagArr: [],//当前模块的分类标签
    labelId: '',//当前标签id
    listId: '',//文章id
    typeArr: {
      'textareaValue': '',
      'imgUrls': [],
      //'tempImgUrls': [],
      'videoSrc': '',
      'tempVideoSrc': '',
      'voiceSrc': ''
    },//填写内容集合
    imgSrc: [],
    imgCover: ''
  },
  onLoad: function (options) {
    this.setData({
      labelId: options.id
    })
  },
  onReady: function () {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: res.data,
        })
      },
    })
  },
  //修改标签
  tagChange: function (e) {
    this.setData({
      tagIndex: e.detail.value
    });
  },
  //选择多张图片
  chooseImage: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    //1.选择接口
    wx.chooseImage({
      count: 6, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //2.显示loading页面
        wx.showLoading({
          'title': "上传中...",
          'mask': true,
          'success': function () {
            //2.上传图片
            that.uploadImage(res.tempFilePaths, 0, index, 'imgUrls');
          }
        });
      }
    })
  },
  //失去焦点
  loseFocus: function (e) {
    var that = this,
      inputType = e.currentTarget.dataset.inputType;
    if (inputType === 'text') {
      that.setData({
        'inputTitle': e.detail.value
      });
    } else if (inputType === 'textarea') {
      var typeArr = that.data.typeArr,
        index = e.currentTarget.dataset.index;
      typeArr.textareaValue = e.detail.value;
      that.setData({
        typeArr: typeArr
      });
    } else if (inputType === 'origin') {
      that.setData({
        'origin': e.detail.value
      });
    }
  },
  //选择视频
  uploadVideo: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index;
    //1.选择视频接口
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: ['front', 'back'],
      success: function (res) {
        //2.显示loading页面
        wx.showLoading({
          'title': "视频较大，稍等一下",
          'mask': true,
          'success': function () {
            //2.上传视频
            that.uploadImage([res.tempFilePath], 0, index, 'videoSrc')
          }
        });
      },
      fail: function (res) {
      }
    })
  },
  //提交数据
  formSubmit: function (e) {
    wx.showLoading({
      'title': "loading...",
      'mask': true
    });
    var that = this, data = {}, url = "";
    data.categoryId = that.data.categoryId;//小标签id
    data.communityId = wx.getStorageSync('communityInfo').id;//社区id
    data.content = e.detail.value.content;//内容
    data.createUserId = wx.getStorageSync('userInfo').userId;//用户id
    data.origin = that.data.origin;    //来源名称
    data.imgs = that.data.typeArr.imgUrls;//图片集合
    data.labelId = that.data.labelId;//分类id
    data.title = e.detail.value.sTitle;//标题
    data.video = that.data.typeArr.videoSrc;//视频地址

    if (!that.data.userInfo) {
      data.origin = e.detail.value.origin || '人民群众';
    }
    url = app.globalData.adminAddress + '/api/article/save';
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
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
      },
      fail: function (res) {
        wx.hideLoading();
        console.log("提交失败");
      }
    })
  },
  /*上传图片
   *imgUrls------->图片数组
   *initNum------->要上传的图片在imgUrls中的下标
   *index--------->当前要上传的类别的下标
  */
  uploadImage: function (imgUrls, initNum, index, uploadType) {
    var that = this;
    //1.判断是否上传完毕
    if (initNum < imgUrls.length) {
      //2.开始上传
      wx.uploadFile({
        url: app.globalData.adminAddress + '/api/upload',
        filePath: imgUrls[initNum],
        name: 'file' + initNum,
        success: function (res) {
          var data = JSON.parse(res.data).data;
          //3.同步数据
          var typeArr = that.data.typeArr;
          if (uploadType == "imgUrls") {
            typeArr.imgUrls.push(data[0]);
            //typeArr.tempImgUrls.push(imgUrls[initNum]);
            //4.继续上传下一张图片
            that.uploadImage(imgUrls, (initNum + 1), index, 'imgUrls');
          } else if (uploadType == "videoSrc") {
            wx.hideLoading();
            typeArr.videoSrc = data[0];
            typeArr.tempVideoSrc = imgUrls[initNum];
          }
          that.setData({
            typeArr: typeArr
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
  //删除图片接口
  removeFile: function (e) {
    var that = this,
      removeIndex = parseInt(e.currentTarget.dataset.removeIndex),
      typeArr = that.data.typeArr;
    typeArr.imgUrls.splice(removeIndex, 1);
    that.setData({
      typeArr: typeArr
    });
  },
  //选择标签
  setChecked: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      arr = that.data.tagArr;
    for (var i = 0; i < arr.length; i++) {
      if (i === parseInt(index)) {
        arr[i].iconShow = false;
        arr[i].curClass = "on";
      } else {
        arr[i].iconShow = true;
        arr[i].curClass = "";
      }
    }
    that.setData({
      'categoryId': arr[index].id,
      'tagArr': arr
    })
  },
  // 选择封面图
  chooseCover: function () {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        _this.setData({
          imgCover: res.tempFilePaths[0]
        });
      },
    })
  }
})