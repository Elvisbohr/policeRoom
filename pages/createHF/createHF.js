// pages/createHF/createHF.js

import policeRegion from '../../data/policeRegion.js';

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateId: null,
    // 提交的数据
    submitDataStr: {
      classStr: '治安案件/刑事案件/矛盾纠纷化解',
      date: '请选择日期',
      time: '请选择时间',
      police: '请选择派出所',
      community: '请选择社区',
      detailAddress: '',
      content: '',
      handResult: '',
      victims: [
        {
          name: '',
          sex: '请选择性别',
          police: '请选择派出所',
          community: '请选择社区',
          communityArr: [],
          detailAddress: '',
          age: '请选择年龄',
          telephone: ''
        }
      ]
    },
    // 派出所及社区列表
    police: policeRegion,
    communityArr: [],
    // 案件类型
    types: [{ id: 1, text: '治安案件' }, { id: 2, text: '刑事案件' }, { id: 3, text: '矛盾纠纷化解' }],
    // 性别列表
    sexs: [{ 'id': 1, 'text': '男' }, { 'id': 0, 'text': '女' }],
    // 年龄列表
    ages: [],
    // 上传视频、图片的obj
    typeArr: {
      'firstTextareaValue': '',
      'secondTextareaValue': '',
      'firstImgUrls': [],
      'secondImgUrls': [],
      //'tempImgUrls': [],
      'firstVideoSrc': '',
      'secondVideoSrc': '',
      'firstTempVideoSrc': '',
      'secondTempVideoSrc': '',
      'voiceSrc': ''
    },
    //填写内容集合
    imgSrc: [],
    imgCover: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 生成年龄列表
    let ages = [];
    for (let i = 0; i < 120; i++) {
      ages[i] = i + 1;
    }
    this.setData({
      ages: ages
    });
    if (options.id) {
      this.getUpdateCon(options.id);
    }
  },
  // 获得需要编辑的内容
  getUpdateCon: function (id) {
    wx.showLoading({
      title: '请稍后...',
    })
    wx.request({
      url: app.globalData.adminAddress + '/api/visit/new/detail',
      data: { id: id },
      success: res => {
        let submitDataStr = this.data.submitDataStr;
        let resData = res.data.data;
        // 获得类型
        switch (resData.classId) {
          case 1:
            submitDataStr.classStr = '治安案件';
            break;
          case 2:
            submitDataStr.classStr = '刑事案件';
            break;
          case 3:
            submitDataStr.classStr = '矛盾纠纷化解';
            break;
        }
        // 日期的默认值
        let dataArr = resData.time.split(" ");
        submitDataStr.date = dataArr[0];
        submitDataStr.time = dataArr[1];
        // 派出所、社区、详细地址区分
        let policeArr = resData.address.split('派出所');
        if (policeArr.length > 1) {
          submitDataStr.police = policeArr[0] + '派出所';
          if (policeArr[1].length > 0) {
            let communityArr = policeArr[1].split('社区');
            submitDataStr.community = communityArr[0] + '社区';
          }
          let detailAddressStart = resData.address.indexOf('社区') + 2;
          let detailAddress = resData.address.substr(detailAddressStart);
          if (detailAddress.length > 0) {
            submitDataStr.detailAddress = resData.address.substr(10);
          }
        }
        // 当事人列表
        let resVictims = resData.list;
        if (resVictims.length > 0) {
          for (let i = 0; i < resVictims.length; i++) {
            if (!submitDataStr.victims[i]){
              submitDataStr.victims[i] = {
                name: '',
                sex: '请选择性别',
                police: '请选择派出所',
                community: '请选择社区',
                communityArr: [],
                detailAddress: '',
                age: '请选择年龄',
                telephone: ''
              };
            }
            console.log(resVictims[i]);
            submitDataStr.victims[i].name = resVictims[i].name;
            // 性别
            switch (resVictims[i].sex) {
              case 0:
                submitDataStr.victims[i].sex = '女';
                break;
              case 1:
                submitDataStr.victims[i].sex = '男';
                break;
            }
            // 派出所
            if (resVictims[i].address.length > 0) {
              let policeEnd = resVictims[i].address.indexOf('派出所') + 3;
              let communityStart = 0;
              if (policeEnd > 3) {
                submitDataStr.victims[i].police = resVictims[i].address.substr(0, policeEnd);
                communityStart = policeEnd;
                // 获得社区列表
                let police = this.data.police;
                let curPoliceIndex = police.findIndex(function (v) {
                  return v.text === submitDataStr.victims[i].police;
                })
                submitDataStr.victims[i].communityArr = police[curPoliceIndex].children;
              }
              // 社区
              let communityEnd = resVictims[i].address.indexOf('社区') + 2;
              let detailAddressStart = 0;
              if (communityEnd > 2) {
                submitDataStr.victims[i].community = resVictims[i].address.substr(communityStart, communityEnd);
                detailAddressStart = communityEnd;
              }
              // 详细地址
              submitDataStr.victims[i].detailAddress = resVictims[i].address.substr(detailAddressStart);
            }
            // 年龄
            submitDataStr.victims[i].age = resVictims[i].age;
            submitDataStr.victims[i].telephone = resVictims[i].telephone;
          }
        }
        // 简要案情的内容
        submitDataStr.content = resData.content;
        // 处理结果的内容
        submitDataStr.handResult = resData.handResult;
        // 图片
        let typeArr = this.data.typeArr;
        let file1 = resData.file1;
        if (file1.length > 0) {
          for (let i = 0; i < file1.length; i++) {
            if (file1[i].type === 2) {
              typeArr.firstVideoSrc = file1[i].url;
              typeArr.firstTempVideoSrc = file1[i].url;
            } else {
              typeArr.firstImgUrls.push(file1[i].url);
            }
          }
        }

        let file2 = resData.file2;
        if (file2.length > 0) {
          for (let i = 0; i < file2.length; i++) {
            if (file2[i].type === 2) {
              typeArr.secondVideoSrc = file2[i].url;
              typeArr.secondTempVideoSrc = file2[i].url;
            } else {
              typeArr.secondImgUrls.push(file2[i].url);
            }
          }
        }
        this.setData({
          submitDataStr: submitDataStr,
          typeArr: typeArr,
          updateId: resData.id
        })

        wx.hideLoading();
      }
    })
  },
  // 下拉框选择
  pickerChange: function (e) {
    let strName = e.currentTarget.dataset.strName; // submitDataStr对应的参数名称
    // 该picker的数组(有可能没有)
    let pickerArr = this.data[e.currentTarget.dataset.arrName];
    // 更新submitDataStr中的值
    let submitDataStr = this.data.submitDataStr;
    // strName为police时，相对应的更改社区选择列表;
    if (strName.indexOf('police') >= 0) {
      let nowPolice = pickerArr[e.detail.value].text;
      let oldPolice = submitDataStr[strName];
      if (nowPolice !== oldPolice) { // 选择的派出所与上次不一样
        let police = this.data.police;
        this.setData({
          'submitDataStr.community': '请选择社区',
          communityArr: police[e.detail.value].children
        })
      }
    }
    // pickerArr，为true，submitDataStr[strName]的值为数组中的相对应的值，false，submitDataStr[strName]则为value值
    if (pickerArr) {
      submitDataStr[strName] = pickerArr[e.detail.value].text;
    } else {
      submitDataStr[strName] = e.detail.value;
    }
    this.setData({
      submitDataStr: submitDataStr
    });
  },
  // 当事人情况下的下拉框选择
  victimsPoliceChange: function (e) {
    let strName = e.currentTarget.dataset.strName; // submitDataStr对应的参数名称
    let index = e.currentTarget.dataset.index; // victims对应的下标
    let key = e.currentTarget.dataset.key;
    // 更新submitDataStr中的值
    let submitDataStr = this.data.submitDataStr;
    // 该picker的数组(有可能没有)
    let pickerArr = this.data[e.currentTarget.dataset.arrName];
    // strName为police时，相对应的更改社区选择列表;
    if (strName.indexOf('police') >= 0) {
      let nowPolice = pickerArr[e.detail.value].text;
      let oldPolice = submitDataStr.victims[index][strName];
      if (nowPolice !== oldPolice) { // 选择的派出所与上次不一样
        let police = this.data.police;
        let victims = submitDataStr.victims;
        victims[index].community = '请选择社区';
        victims[index].communityArr = police[e.detail.value].children;
        this.setData({
          'submitDataStr.victims': victims
        })
      }
    }
    // pickerArr，为true，submitDataStr[strName]的值为数组中的相对应的值，false，submitDataStr[strName]则为value值
    if (pickerArr) {
      if (key) {
        if (strName.indexOf('community') >= 0) { // 如果是社区的选择，pickerArr则为当前当事人下的对应的社区列表
          submitDataStr.victims[index][strName] = submitDataStr.victims[index].communityArr[e.detail.value][key];
        } else {
          submitDataStr.victims[index][strName] = pickerArr[e.detail.value][key];
        }
      } else {
        submitDataStr.victims[index][strName] = pickerArr[e.detail.value];
      }
    } else {
      submitDataStr.victims[index][strName] = e.detail.value;
    }
    this.setData({
      submitDataStr: submitDataStr
    });
  },
  // 当事人的输入框失去焦点
  inputBlurVictim: function (e) {
    let index = e.currentTarget.dataset.index;
    let strName = e.currentTarget.dataset.strName;
    let victims = this.data.submitDataStr.victims;
    victims[index][strName] = e.detail.value;
    this.setData({
      'submitDataStr.victims': victims
    })
  },
  // 当事人添加
  addVictim: function () {
    let victims = this.data.submitDataStr.victims;
    victims.push({
      name: '',
      sex: '请选择性别',
      police: '请选择派出所',
      community: '请选择社区',
      communityArr: [],
      detailAddress: '',
      age: '请选择年龄',
      telephone: ''
    })
    this.setData({
      'submitDataStr.victims': victims
    })
  },
  // 删除当事人
  removeVictim: function (e) {
    let victims = this.data.submitDataStr.victims;
    let index = e.currentTarget.dataset.index;
    victims.splice(index, 1);
    this.setData({
      'submitDataStr.victims': victims
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
        console.log('上传视频成功');
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
        console.log('上传视频失败');
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
            typeArr[index + 'ImgUrls'].push(data[0]);
            //typeArr.tempImgUrls.push(imgUrls[initNum]);
            //4.继续上传下一张图片
            that.uploadImage(imgUrls, (initNum + 1), index, 'imgUrls');
          } else if (uploadType == "videoSrc") {
            wx.hideLoading();
            typeArr[index + 'VideoSrc'] = data[0];
            typeArr[index + 'TempVideoSrc'] = imgUrls[initNum];
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
    let index = e.currentTarget.dataset.index;
    let types = e.currentTarget.dataset.types;
    let typeArr = this.data.typeArr;
    typeArr[types + 'ImgUrls'].splice(index, 1);
    this.setData({
      typeArr: typeArr
    });
  },
  // 提交数据
  submitFun: function (e) {
    // 1.判断日期是否选择
    let judgeResult = this.judgeSubmitData();
    if (judgeResult) {
      wx.showLoading({
        title: '请稍后',
      });
      // 拼接字符
      let data = this.stitchingData(e);
      wx.getStorage({
        key: 'userInfo',
        success: res => {
          data.userId = parseInt(res.data.userId);
          let url = '';
          if (this.data.updateId){
            url = '/api/visit/new/update';
            data.id = this.data.updateId;
          }else{
            url = '/api/visit/new/add'
          }
          console.log(data);
          console.log(url);
          wx.request({
            url: app.globalData.adminAddress + url,
            data: JSON.stringify(data),
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '提交成功',
                mask: true,
                duration: 2500
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                });
              }, 2500);
            },
            fail: res => {
              wx.showToast({
                title: '提交失败',
                mask: true,
                duration: 2500
              });
            }
          })
        }
      })
    }

  },
  // 判断数据是否填写
  judgeSubmitData: function () {
    let submitDataStr = this.data.submitDataStr;
    if (submitDataStr.classStr === '治安案件/刑事案件/矛盾纠纷化解') {
      wx.showToast({
        title: '请选择案件类型'
      });
      return false;
    } else if (submitDataStr.date === '请选择日期') {
      wx.showToast({
        title: submitDataStr.date
      });
      return false;
    } else if (submitDataStr.time === '请选择时间') {
      wx.showToast({
        title: submitDataStr.time
      });
      return false;
    } else if (submitDataStr.police === '请选择派出所') {
      wx.showToast({
        title: submitDataStr.police
      });
      return false;
    } else if (submitDataStr.community === '请选择社区') {
      wx.showToast({
        title: submitDataStr.community
      });
      return false;
    }
    return true;
  },
  // 拼接需要提交的数据
  stitchingData: function (e) {
    let submitDataStr = this.data.submitDataStr;
    let data = {};
    // 2.获取案件类型的id
    switch (submitDataStr.classStr) {
      case '治安案件':
        data.classId = 1;
        break;
      case '刑事案件':
        data.classId = 2;
        break;
      case '矛盾纠纷化解':
        data.classId = 3;
        break;
    }
    // 时间
    data.time = submitDataStr.date + " " + submitDataStr.time;
    // 地址
    data.address = submitDataStr.police + submitDataStr.community + e.detail.value.detailAddress;
    // 简要案情
    data.content = e.detail.value.content;
    data.imgUrl1 = this.data.typeArr.firstImgUrls;
    data.videoUrl1 = this.data.typeArr.firstVideoSrc;
    // 处理结果
    data.handResult = e.detail.value.handResult;
    data.imgUrl2 = this.data.typeArr.secondImgUrls;
    data.videoUrl2 = this.data.typeArr.secondVideoSrc;
    // 当事人列表
    data.victims = [];
    for (let i = 0; i < submitDataStr.victims.length; i++) {
      data.victims[i] = {};
      // 当事人的名字
      data.victims[i].name = submitDataStr.victims[i].name;
      // 当事人的性别
      if (submitDataStr.victims[i].sex === '请选择性别') {
        data.victims[i].sex = '';
      } else {
        if (submitDataStr.victims[i].sex === '男') {
          data.victims[i].sex = 1;
        } else if (submitDataStr.victims[i].sex === '女') {
          data.victims[i].sex = 0;
        }

      }
      // 当事人的地址
      let police = '';
      let community = '';
      if (submitDataStr.victims[i].police === '请选择派出所') {
        police = '';
      } else {
        police = submitDataStr.victims[i].police;
      }
      if (submitDataStr.victims[i].community === '请选择社区') {
        community = '';
      } else {
        community = submitDataStr.victims[i].community;
      }
      data.victims[i].address = police + community + submitDataStr.victims[i].detailAddress;
      // 当事人的年龄
      if (submitDataStr.victims[i].age === '请选择年龄') {
        data.victims[i].age = '';
      } else {
        data.victims[i].age = submitDataStr.victims[i].age;
      }
      // 当事人的手机号码
      data.victims[i].telephone = submitDataStr.victims[i].telephone;
    }
    return data;
  }
})