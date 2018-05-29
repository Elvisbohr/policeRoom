Component({

  behaviors: [],

  properties: {
    arr: {
      type: Array,
      value: [],
      observer: function () {}
    }
  },
  data: {}, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { },
  moved: function () { },
  detached: function () { },

  methods: {
    onTap: function (e) {
      let temp = e.currentTarget.dataset.temp
      console.log(temp)
      console.log(typeof(temp))
      var myEventDetail = {myId: temp} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    onMyButtonTap: function () {

    },
    _myPrivateMethod: function () {

    },
    _propertyChange: function (newVal, oldVal) {

    }
  }
})