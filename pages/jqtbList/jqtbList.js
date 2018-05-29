// pages/jmjyList/jmjyList.js
var app = getApp();
Page({
  data:{
    serverAddress:app.globalData.serverAddress,
    dTypeArr:{'jqtb':'警情通报','zrwl':'社区有你'},
    titleArr:{'jqtb':'警情通报','zrwl':'好事帮帮'},
    dType:"",
    collection:{},
    nowTitle:""
  },
  onLoad:function(options){
    var that = this;
    //1.动态修改标题
    for(var i=0; i<app.globalData.tabMenus.length; i++){
      if(app.globalData.tabMenus[i].id === parseInt(options.dTypeId)){
        wx.setNavigationBarTitle({
          title: app.globalData.tabMenus[i].title
        });
        that.setData({
          nowTitle: app.globalData.tabMenus[i].title
        });
      }
    }
    //2.获取当前类型列表数据
    wx.request({
      url: app.globalData.adminAddress+"/api/tabMenuList",
      data: {'dTypeID':options.dTypeId},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        var collection = res.data.data;
        console.log(collection)
        //3.重新计算时间
        for(var s=0; s<collection.lists.length; s++){
          var date = new Date(collection.lists[s].time).getTime(),
              nowTime = new Date().getTime(),
              timeDiffer = nowTime - date,
              timeStr = "";
          if(timeDiffer < (60*1000)){
            timeStr = "刚刚";
          }else if(timeDiffer <= (60*60*1000)){
            timeStr = Math.round(timeDiffer/(60*1000))+"分钟之前";
          }else if(timeDiffer <= (24*60*60*1000)){
            timeStr = Math.round(timeDiffer/(60*60*1000))+"小时之前";
          }else if(timeDiffer <= (5*24*60*60*1000)){
            timeStr = Math.round(timeDiffer/(24*60*60*1000))+"天之前";
          }else if(timeDiffer > (5*24*60*60*1000)){
            timeStr = date;
          }
          collection.lists[s].time = timeStr;
        }

        that.setData({
          collection:res.data.data
        });
      },
      fail: function(res) {
        wx.showToast({
          title:'网络错误',
          icon:'loading'
        })
      }
    })
  },
  skipUrl:function(e){
    var that = this,
        dIndex = e.currentTarget.dataset.dIndex;
    wx.navigateTo({
      url: '../djwhDetail/djwhDetail?dType='+that.data.dType+"&dIndex="+dIndex
    })
  },
  skipJyxc:function(){
    wx.navigateTo({
      url: '../jyxc/jyxc?dType=zrwl'
    })
  }
})