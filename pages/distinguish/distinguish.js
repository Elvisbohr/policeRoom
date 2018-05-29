const app = getApp()
Page({
  data: {
    userInfo: {},
    counting: false//倒计时
  },
  onLoad: function () {
    this.daojishi();//一进来就拍照倒计时
    this.ctx = wx.createCameraContext()//创建摄像头对象
  },
  //倒计时
  daojishi: function () {
    var that = this;
    if (!that.data.counting) {
      //开始倒计时5秒
      countDown(that, 5);
    }
  }
})
//倒计时函数 在page外

function countDown(that, count) {
  if (count == 0) {
    //等于0时拍照 
    that.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({
          src: res.tempImagePath
        })
        wx.showToast({
          title: '认证成功',
          success:function(){
            setTimeout(function () {
              wx.switchTab({
                url: '../mine/mine'
              })
            }, 2000)
          }
        })
      }
    })
    that.setData({
      counting: false
    })
    return;
  }
  // wx.showLoading({//加载时显示倒计时
  //   title: '拍照倒计时' + count + '秒',
  // })

  setTimeout(function () {
    wx.hideLoading()
  }, 1000)
  that.setData({
    counting: true,
  })
  setTimeout(function () {
    count--;
    countDown(that, count);
  }, 1000);
}
