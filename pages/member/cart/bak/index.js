var t = getApp(),
  e = t.requirejs("core"),
  i = t.requirejs("foxui"),
  a = t.requirejs("jquery");
var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  that.setData({ list: list })
}
Page({
  data: {
    delBtnWidth: 180,
    route: "cart",
    icons: t.requirejs("icons"),
    merch_list: !1,
    list: !1,
    edit_list: []
  },
  onLoad: function (e) {
    t.url(e);
    this.initEleWidth();
  },
  onShow: function () {
    this.get_cart()
  },
  get_cart: function () {
    var t, i = this;
    e.get("member/cart/get_cart", {}, function (e) {
      console.log('eeeeeeeeeee',e)
      t = {
        show: !0,
        ismerch: !1,
        ischeckall: e.ischeckall,
        total: e.total,
        cartcount: e.total,
        totalprice: e.totalprice,
        empty: e.empty || !1
      }, void 0 === e.merch_list ? (t.list = e.list || [], i.setData(t)) : (t.merch_list = e.merch_list || [], t.ismerch = !0, i.setData(t))
    })
  },
  edit: function (t) {
    var i, s = e.data(t),
      c = this;
    switch (s.action) {
      case "edit":
        this.setData({
          edit: !0
        });
        break;
      case "complete":
        this.allgoods(!1), this.setData({
          edit: !1
        });
        break;
      case "move":
        i = this.checked_allgoods().data, a.isEmptyObject(i) || e.post("member/cart/tofavorite", {
          ids: i
        }, function (t) {
          c.get_cart()
        });
        break;
      case "delete":
        i = this.checked_allgoods().data, a.isEmptyObject(i) || e.confirm("是否确认删除该商品?", function () {
          e.post("member/cart/remove", {
            ids: i
          }, function (t) {
            c.get_cart()
          })
        });
        break;
      case "pay":
        this.data.total > 0 && wx.navigateTo({
          url: "/pages/order/create/index"
        })
    }
  },
  checkall: function (t) {
    e.loading();
    var i = this,
      a = this.data.ischeckall ? 0 : 1;
    e.post("member/cart/select", {
      id: "all",
      select: a
    }, function (t) {
      i.get_cart(), e.hideLoading()
    })
  },
  update: function (t) {
    var i = this,
      a = this.data.ischeckall ? 0 : 1;
    e.post("member/cart/select", {
      id: "all",
      select: a
    }, function (t) {
      i.get_cart()
    })
  },
  number: function (t) {
    var a = this,
      s = e.pdata(t),
      c = i.number(this, t),
      r = s.id,
      o = s.optionid;
    1 == c && 1 == s.value && "minus" == t.target.dataset.action || s.value == s.max && "plus" == t.target.dataset.action || e.post("member/cart/update", {
      id: r,
      optionid: o,
      total: c
    }, function (t) {
      a.get_cart()
    })
  },
  selected: function (t) {
    e.loading();
    var i = this,
      a = e.pdata(t),
      s = a.id,
      c = 1 == a.select ? 0 : 1;
    e.post("member/cart/select", {
      id: s,
      select: c
    }, function (t) {
      i.get_cart(), e.hideLoading()
    })
  },
  allgoods: function (t) {
    var e = this.data.edit_list;
    if (!a.isEmptyObject(e) && void 0 === t) return e;
    if (t = void 0 !== t && t, this.data.ismerch) for (var i in this.data.merch_list) for (var s in this.data.merch_list[i].list) e[this.data.merch_list[i].list[s].id] = t;
    else for (var i in this.data.list) e[this.data.list[i].id] = t;
    return e
  },
  checked_allgoods: function () {
    var t = this.allgoods(),
      e = [],
      i = 0;
    for (var a in t) t[a] && (e.push(a), i++);
    return {
      data: e,
      cartcount: i
    }
  },
  editcheckall: function (t) {
    var i = e.pdata(t).check,
      a = this.allgoods(!i);
    this.setData({
      edit_list: a,
      editcheckall: !i
    }), this.editischecked()
  },
  editischecked: function () {
    var t = !1,
      e = !0,
      i = this.allgoods();
    for (var a in this.data.edit_list) if (this.data.edit_list[a]) {
      t = !0;
      break
    }
    for (var s in i) if (!i[s]) {
      e = !1;
      break
    }
    this.setData({
      editischecked: t,
      editcheckall: e
    })
  },
  edit_list: function (t) {
    var i = e.pdata(t),
      a = this.data.edit_list;
    void 0 !== a[i.id] && 1 == a[i.id] ? a[i.id] = !1 : a[i.id] = !0, this.setData({
      edit_list: a
    }), this.editischecked()
  },
  url: function (t) {
    var i = e.pdata(t);
    wx.navigateTo({
      url: i.url
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "";
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件  
  delItem: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {
          //获取列表中要删除项的下标  
          var index = e.target.dataset.index;
          var id = e.target.dataset.id

          that.delete_item(id);

          var list = that.data.list;
          //移除列表中下标为index的项  
          list.splice(index, 1);
          //更新列表的状态  
          that.setData({
            list: list
          });

          

        } else {
          initdata(that)
        }
      }
    })

  },
  delete_item:function(i){
    console.log(i);
    var that = this
    e.post("member/cart/remove", {
      ids: i
    }, function (t) {
      that.get_cart()
    })
  ;
},





  onShareAppMessage: function () {
    return e.onShareAppMessage()
  }
})