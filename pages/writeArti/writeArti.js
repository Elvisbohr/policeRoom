var app = getApp();
Page({
  data: {
    inputTitle: '',//当前文章标题
    categoryId: '',//分类标签当前选中的id
    tagArr: [],//分类标签数组
    typeArr: {
      'textareaValue': '',
      'imgUrls': [],
      //'tempImgUrls': [],
      'videoSrc': '',
      'tempVideoSrc': '',
      'voiceSrc': ''
    },//填写内容集合
    imgSrc: [],
    imgCover:'',
    openid:'',
    source:'人民群众'
  },
  onLoad: function (options) {
    var that = this;
    //温馨社区发布文章后修改需要获取的数据
    // var typeArr = {};
    // if (options.listId !== undefined) {
      // wx.request({
      //   url: app.globalData.adminAddress + '/api/detial',
      //   data: { 'dTypeID': options.id, 'listId': options.listId },
      //   method: 'GET',
      //   success: function (res) {
      //     //4.设置页面所需内容
      //     typeArr = {
      //       'textareaValue': res.data.data.text,
      //       'imgUrls': res.data.data.imgUrls,
      //       //'tempImgUrls': res.data.data.imgUrls,
      //       'videoSrc': res.data.data.video,
      //       'tempVideoSrc': res.data.data.video,
      //       'voiceSrc': ''
      //     };
      //     that.setData({
      //       inputTitle: res.data.data.title,
      //       origin: res.data.data.origin,
      //       typeArr: typeArr
      //     });
      //   },
      //   fail: function (res) {
      //     // fail
      //   }
      // })
    // }
    //分类下的标签获取
    wx.request({
      url: app.globalData.adminAddress + '/communityNewsLabel/list',
      method: 'GET',
      success: function (res) {
        var tagArr = res.data.data;
        for (var i = 0; i < tagArr.length; i++) {
          if (i === 0) {
            tagArr[i].curClass = "on";
            tagArr[i].iconShow = false;
          } else {
            tagArr[i].curClass = "";
            tagArr[i].iconShow = true;
          }
        }
        that.setData({
          tagArr: tagArr,
          categoryId: tagArr[0].id
        });
      },
      fail: function (res) {
        // fail
      }
    })
  },
  onReady:function(){
    wx.getStorage({
      key: 'userInfo',
      success: (res)=>{
        this.setData({
          userInfo:res.data
        })
      },
    })
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
        console.log(1111111111111)
        console.log(res)
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
          'title': "视频较大,请耐心等候...",
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
    console.log(e) 
    wx.showLoading({
      'title': "loading...",
      'mask': true
    });
    var that = this, data = {};
        data.labelId = that.data.categoryId;//小标签id
        data.title = e.detail.value.sTitle;//标题
        data.source = e.detail.value.source;//来源
        data.content = e.detail.value.content;//内容
        data.imgUrls = that.data.typeArr.imgUrls;//图片集合
        data.cover = that.data.typeArr.imgUrls[0];//封面图
        data.anonymous = 1;//是否匿名
        data.formId = e.detail.formId;//form表单提交的formid
        data.openId = app.globalData.openId;//openId
        data.video = that.data.typeArr.videoSrc;//视频地址
        console.log(data)
        if(data.title==''){
          wx.showToast({
            'title': "请填写标题",
            'icon': "none"
          });
        }else if(data.content==''){
          wx.showToast({
            'title': "请填写内容",
            'icon': "none"
          });
        } else if (data.source == '') {
          wx.showToast({
            'title': "请填写来源",
            'icon': "none"
          });
        }else{
          wx.request({
            url: app.globalData.adminAddress + '/communityNews/upload',
            data: data,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
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
        } 
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
        url: app.globalData.adminAddress + '/upload',
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
  chooseCover:function(){
    let _this = this;
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        _this.setData({
          imgCover: res.tempFilePaths[0]
        });
      },
    })
  }
})