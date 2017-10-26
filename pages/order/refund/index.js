var t = getApp(),
  e = t.requirejs("core"),
  a = t.requirejs("biz/order");
Page({
  data: {
    code: 1,
    tempFilePaths: "",
    delete: "",
    rtypeArr: ["退款(仅退款不退货)", "退货退款", "换货"],
    rtypeArrText: ["退款", "退款", "换货"],
    rtypeIndex: 1,
    reasonArr: ["不想要了", "卖家缺货", "拍错了/订单信息错误", "其它"],
    reasonIndex: 0,
    images: []
  },
  onLoad: function (e) {
    this.setData({
      options: e
    }),
      t.url(e),
      this.get_list()
  },
  get_list: function () {
    var t = this;
    e.get("order/refund", t.data.options,
      function (a) {
        0 == a.error ? (a.order.status < 2 && (a.rtypeArr = ["退款(仅退款不退货)"]), a.show = !0, t.setData(a)) : e.toast(a.message, "loading")
      })
  },
  submit: function () {
    var t = {
      id: this.data.options.id,
      rtype: this.data.rtypeIndex,
      reason: this.data.reasonArr[this.data.reasonIndex],
      content: this.data.content,
      price: this.data.price,
      images: this.data.images
    };
    e.post("order/refund/submit", t,
      function (t) {
        console.log(t)
        //提交退款申请成功
        if (t.error == 0) {
          wx.showModal({
            title: '提示',
            content: "提交退款申请成功，等待审核",
            success: function (res) {
              if (res.confirm) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500);
              } else if (res.cancel) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500);
              }
            }
          })
          // wx.showToast({
          //   title: t.result.message,
          //   icon:'success'
          // })
        }
        //提交退款申请失败
        else {
          wx.showModal({
            title: '提示',
            content: t.result.message,
            success: function (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                
              }
            }
          })
        }
      },
      !0)
  },
  change: function (t) {
    var a = e.data(t).name,
      i = {};
    i[a] = t.detail.value,
      this.setData(i)
  },
  upload: function (t) {
    var a = this,
      i = e.data(t),
      s = i.type,
      r = a.data.images,
      n = a.data.imgs,
      o = i.index;
    "image" == s ? e.upload(function (t) {
      r.push(t.filename),
        n.push(t.url),
        a.setData({
          images: r,
          imgs: n
        })
    }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
      images: r,
      imgs: n
    })) : "image-preview" == s && wx.previewImage({
      current: n[o],
      urls: n
    })
  },
  toggle: function (t) {
    var a = e.pdata(t),
      i = a.id;
    i = 0 == i || void 0 === i ? 1 : 0,
      this.setData({
        code: i
      })
  },
  edit: function (t) {
    this.setData({
      "order.refundstate": 0
    })
  },
  refundcancel: function (t) {
    a.refundcancel(this.data.options.id,
      function () {
        wx.navigateBack()
      })
  }
})