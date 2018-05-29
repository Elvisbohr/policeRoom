// pages/huji/huji.js
Page({
  data: {
    curList: [],
    list1: [
      '新生儿申报',
      '非婚生子女随父、随母出生申报',
      '国（境）外出生子女出生申报',
      '收养申报',
      '部队复员、退伍、专业、自主择业军人落户',
      '开除军籍或除名落户',
      '华侨及港澳台居民回国（入境）定居、入籍申报'
    ],
    list2: [
      '市县外合法稳定住所迁入（含租赁）',
      '人才迁入',
      '市县外直系亲属投靠',
      '市县内直系亲属投靠',
      '合法稳定住所迁入（又名：购房迁移）',
      '毕业生迁入就业地',
      '毕业生迁入生源地',
      '干部、工人调动落户',
      '国家公务员、行政事业单位工作人员录用落户',
      '部队军官、离退休干部家属随军随迁落户',
      '佛教、道教出家人户口迁入'
    ],
    list3: [
      '学校录取迁出',
      '准迁迁出',
      '毕业迁出',
      '转学、退学迁出'
    ],
    list4: [
      '公民因出国、出境（在国外、境外定居的除外）被注销户口',
      '现回国（入境）要求恢复户口',
      '因判刑被注销户口现监外执行要求恢复户口'
    ],
    list5: [
      '立户',
      '分户',
      '集体户'
    ],
    list6: [
      '死亡注销',
      '宣告死亡注销',
      '出国（境）定居注销',
      '参军入伍注销',
      '宣告失踪注销'
    ]
  },
  onLoad: function (options) {
    let id = options.id
    let temp = this.data['list' + id]
    this.setData({
      curList: temp
    })
  },
  jump: function(e) {
    let name = e.currentTarget.dataset.name
    if (name === '新生儿申报') {
      wx.navigateTo({
        url: '../newborn/newborn'
      })
    } else {
      wx.showToast({
        title: '暂未开放',
        icon: 'loading',
        duration: 1000
      })
    }
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