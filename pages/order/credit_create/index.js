var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
  return typeof t
}
  : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
  },
  e = getApp(), a = e.requirejs("core"), i = e.requirejs("foxui"), d = e.requirejs("biz/diyform"), r = e.requirejs("jquery");
Page({
  data: {
    icons: e.requirejs("icons"),
    member: {},
    goodsId: '',
    order: {},
    address: {},
    showTab: 0,
    showAddress: !0,
    changenum: !0,
    status: '', 
    carrierInfo: '',
    remark: '',
  },
  onLoad: function (t) {
    var i = this;
    this.setData({
      goodsId: t.id,
      areas: e.getCache("cacheset").areas
    }),
    e.url(t),
    a.get("order/creditcreate", {id: i.data.goodsId}, function (t) {
      0 == t.error && i.setData({
        order: t.order,
        address: t.address,
        show: !0,
      }), e.setCache("goodsInfo", {
        goods: t.order.goods
      }, 1800)
    })
  },
  onShow: function () {
    var i = this,
      d = e.getCache("orderAddress"),
      s = e.getCache("orderShop");
    d && (this.setData({
      address : d
    }), i.caculate(i.data.list)),
      s && this.setData({
        carrierInfo: s
      });
  },
  toggle: function (t) {
    var e = a.pdata(t),
      i = e.id,
      d = e.type,
      r = {};
    r[d] = 0 == i || void 0 === i ? 1 : 0,
      this.setData(r)
  },
  phone: function (t) {
    a.phone(t)
  },
  dispatchtype: function (t) {
    var e = a.data(t).type;
    this.setData({
      "order.dispatchtype": e
    })
  },
  number: function (e) {
    var self = this;
    var max = self.data.order.goods.total;
    var min = 1;
    var current = self.data.order.total;
    var action = a.data(e).action;
    if(action == 'minus' && current > min){
      current--;
    }else if(action == 'plus' && current < max){
      current++;
    }
    self.setData({
      "order.total": current
    })
  },
  submit: function () {
    var t = this.data,e = this;
    if (!t.submit) {
      if (d.verify(this, i)) {
        t.carrierInfo = t.carrierInfo || {};
        var s = {
          goodsid: t.order.goods.id,
          total: t.order.total,
          dispatchtype: t.order.dispatchtype,
          dispatchid: t.order.dispatchid,
          addressid: t.address ? t.address.id : 0,
          remark: t.remark,
        };
        if (1 == t.dispatchtype) {
          if ("" == r.trim(t.member.realname)) return void a.alert("请填写联系人!");
          if ("" == r.trim(t.member.mobile))  return void a.alert("请填写联系方式!");
          s.addressid = 0
        } else if (!s.addressid) {
          return void a.alert("地址没有选择!");
        }
        e.setData({
          submit: !0
        }),
        a.post("order/creditcreate/submit", s, function (t) {
          if (e.setData({
            submit: !1
          }), 0 != t.error)
            return void a.alert(t.message);
          wx.navigateTo({
            url: "/pages/order/index?status=1"
          })
        }, !0)
      }
    }
  },
  dataChange: function (t) {
    var e = this.data;
    switch (t.target.id) {
      case "remark":
        e.remark = t.detail.value;
        break;
    }
    this.setData({
      remark: e.remark,
    })
  },
  listChange: function (t) {
    var e = this.data;
    switch (t.target.id) {
      case "invoicename":
        e.invoicename = t.detail.value;
        break;
      case "realname":
        e.member.realname = t.detail.value;
        break;
      case "mobile":
        e.member.mobile = t.detail.value
    }
    this.setData({
      list: e
    })
  },
  url: function (t) {
    var e = a.pdata(t).url;
    wx.redirectTo({
      url: e
    })
  },
  onChange: function (t) {
    return d.onChange(this, t)
  },
  DiyFormHandler: function (t) {
    return d.DiyFormHandler(this, t)
  },
  selectArea: function (t) {
    return d.selectArea(this, t)
  },
  bindChange: function (t) {
    return d.bindChange(this, t)
  },
  onCancel: function (t) {
    return d.onCancel(this, t)
  },
  onConfirm: function (t) {
    return d.onConfirm(this, t)
  },
  getIndex: function (t, e) {
    return d.getIndex(t, e)
  }
})
