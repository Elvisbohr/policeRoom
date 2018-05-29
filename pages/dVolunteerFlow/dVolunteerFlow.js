// pages/dVolunteerFlow/dVolunteerFlow.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sexArr: [
            { id: 1, name: '男', checked: 'true' },
            { id: 2, name: '女' }
        ],
        sex: 1,
        birthday: '请选择',//出生年月
        region: ['省份', '城市', '县区'],
        region1: ['省份', '城市', '县区'],
        imgsrc1: '../../images/add.png',
        imgsrc2: '../../images/add.png',
        imgsrc3: '../../images/add.png'
    },
    //   选择性别
    sexChange: function (e) {
        let that = this;
        let i = parseInt(e.detail.value - 1);
        let sex = that.data.sexArr[i].id;
        that.setData({
            sex: sex
        })
    },
    // 选择出生年月
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({

            birthday: e.detail.value
        })
    },
    // 选择地址
    bindRegionChange: function (e) {
        if (e.currentTarget.dataset.index == '1') {
            this.setData({
                region: e.detail.value
            })
        } else if (e.currentTarget.dataset.index == '2') {
            console.log(e.detail.value)
            let natives = e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
            this.setData({
                region1: e.detail.value,
                natives: natives
            })
        }
    },
    // 调用手机相册和照相机
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                if (e.currentTarget.dataset.index == '1') {
                    var tempFilePaths = res.tempFilePaths
                    let form = 'oneInchPhoto'
                    // 上传
                    that.myUploadTitlePic(tempFilePaths, form)
                    that.setData({
                        imgsrc1: res.tempFilePaths[0]
                    });
                } else if (e.currentTarget.dataset.index == '2') {
                    // 上传
                    var tempFilePaths = res.tempFilePaths;
                    let form = 'idCardFront';
                    that.myUploadTitlePic(tempFilePaths, form)
                    that.setData({
                        imgsrc2: res.tempFilePaths[0]
                    });
                } else if (e.currentTarget.dataset.index == '3') {
                    // 上传
                    var tempFilePaths = res.tempFilePaths;
                    let form = 'idCardBack'
                    that.myUploadTitlePic(tempFilePaths, form);
                    that.setData({
                        imgsrc3: res.tempFilePaths[0]
                    });
                }
            }
        })
    },
    myUploadTitlePic: function (tempFilePaths, form) {
        const that = this
        let upFile = null;
        console.log(typeof (tempFilePaths))
        console.log(form)
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
                let newStr = result.data[0]
                if (result.status === 200) {
                    if (form == 'oneInchPhoto') {
                        that.setData({
                            oneInchPhoto: newStr
                        })
                    } else if (form == 'idCardFront') {
                        that.setData({
                            idCardFront: newStr
                        })
                    } else if (form == 'idCardBack') {
                        that.setData({
                            idCardBack: newStr
                        })
                    }

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
    // 表单提交
    onFlow: function (e) {
        console.log(e)
        let that = this;
        let data = {};
        data = e.detail.value;  //所以input的数据
        data.sex = that.data.sex;   //性别
        data.birthday = that.data.birthday;  //生日
        data.province = that.data.region[0] //省
        data.city = that.data.region[1]     //市
        data.county = that.data.region[2]  //区
        data.natives = that.data.natives //籍贯
        data.oneInchPhoto = that.data.oneInchPhoto //一寸照
        data.idCardFront = that.data.idCardFront //身份证正面
        data.idCardBack = that.data.idCardBack //身份证反面
        data.formId = e.detail.formId
        // 进行判断
        if(data == undefined||data == null){
            console.log('完蛋!错了')
        }else{
            let str = ''
            if(data.name == ""){
                str = '请输入姓名';
            } else if (data.sex == ""){
                str = '请选择性别';
            } else if (data.birthday == "" || data.province == "请选择") {
                str = '请选择生日';
            } else if (data.nationality == "") {
                str = '请选择国籍';
            } else if (data.idCard == "") {
              str = '请输入身份证号';
            } else if (data.nation == "") {
                str = '请选择民族';
            } else if (data.province == "" || data.province=="省份") {
                str = '请选择省份';
            } else if (data.city == "" || data.city == "城市") {
                str = '请选择城市';
            } else if (data.county == "" || data.county =="县区") {
                str = '请选择县区';
            } else if (data.address == "") {
                str = '请选择详细地址';
            } else if (data.natives == "" || data.natives == undefined) {
                str = '请选择籍贯';
            } else if (data.telephone == "") {
                str = '请选择联系电话';
            } else if (data.emergencyContact == "") {
                str = '请选择紧急联系人';
            } else if (data.emergencyContactTelephone == "") {
                str = '请选择紧急联系人电话';
            } else if (data.selfInfo == "") {
                str = '请选择自我评价';
            } else if (data.oneInchPhoto == "" || data.oneInchPhoto == undefined) {
                str = '请选择一寸照';
            } else if (data.idCardFront == "" || data.idCardFront == undefined) {
                str = '请选择身份证正面';
            } else if (data.idCardBack == "" || data.idCardBack == undefined) {
                str = '请选择身份证背面';
            }else{
                // str = '提交成功';
                that.updata(data);
            }
            wx.showToast({
                title: str,
                icon: 'loading',
                duration: 2000
            })
        }

        
    },
    updata(data){
      console.log(data)
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/volunteer/apply',
            data: data,
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('提交成功', res)
                if (res.data.status === 200) {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000
                    });
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 2
                        })
                    }, 2000)
                }
                
            },
            fail: function () {
                wx.showLoading('请求数据失败');
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