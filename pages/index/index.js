

var t = getApp(), a = t.requirejs("core"), e = (t.requirejs("icons"), t.requirejs("wxParse/wxParse"));
var QQMapWX = t.requirejs('qqmap-wx-jssdk.min');
var isLoc = false;
Page({
	data : {
    city: t.globalData.city,
		route : "home",
		icons : t.requirejs("icons"),
		shop : {},
		indicatorDots : !1,
		autoplay : 1,
		interval : 5e3,
		duration : 500,
		circular : !0,
		storeRecommand : [],
		total : 0,
		page : 1,
		loaded : !1,
		loading : !0,
		indicatorDotsHot : !1,
		autoplayHot : !0,
		intervalHot : 5e3,
		durationHOt : 1e3,
		circularHot : !0,
		hotimg : "/static/images/hotdot.jpg",
		notification : "/static/images/notification.png",
    show:false,
    floor:{},
    citys:[]
	},
	getShop : function () {
		var that = this;
		a.get("shop/get_shopindex", {}, function (a) {
      console.log(a)
      e.wxParse("wxParseData", "html", a.copyright, that, "5"),
        that.setData({
				shop : a
			})
		})
	},
	onReachBottom : function () {
		this.data.loaded || this.data.storeRecommand.length == this.data.total || this.getRecommand()
	},
  look_more:function(e){
    
    wx.navigateTo({
      url: '/pages/goods/index/index'+'?cate',
    })
  },
  //获取楼层数据 
  getFloor:function(){
    var that = this;
    a.get("goods/get_floor", {}, function (res) {
          console.log(res);
          that.setData({
          show: true,
          floor: res.floors
        })
      })

  },
	getRecommand : function () {
		var t = this;
		t.setData({
			loading : !0
		}),
		a.get("shop/get_recommand", {
			page : t.data.page
		}, function (a) {
			var e = {
				loading : !1,
				total : a.total
			};
			t.setData({
				loading : !1,
				total : a.total,
				show : true
			}),
			a.list || (a.list = []),
			a.list.length > 0 && (t.setData({
					storeRecommand : t.data.storeRecommand.concat(a.list),
					page : a.page + 1
				}), a.list.length < a.pagesize && (e.loaded = !0))
		})
    this.setData({
      show: true
    })
	},
	onLoad : function (t) {
    console.log('aaaaaaaaaaaaaaaaaaaa', t, isLoc)
    var app = getApp();
    var self = this;
    if (isLoc) {
      var address = getApp().globalData.city;
      this.setData({ address: address });
    }
    else{
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          app.globalData.lat = latitude;
          app.globalData.lng = longitude;
          // 实例划API核心类
          var map = new QQMapWX({
            key: 'LAWBZ-2CHCD-MCK4X-PSTUA-NJZJJ-IHFQ2' // 必填
          });
          // 调用接口
          map.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude,
            },
            coord_type: 1,
            success: function (res) {
              var city = res.result.ad_info.city;
              console.log('successs', res, city);
              //方便调试，，，，，，，，，，到时候要去掉
              var city = '广州市';

              if (city != undefined) {
                //获取城市列表
                a.get("shop/get_citys", {}, function (a) {
                  if (a.citys)
                  {
                    for (var k in a.citys) {
                      if (a.citys[k].name == city)
                      {
                        var city_id = parseInt(a.citys[k].id);
                        app.globalData.city_id = city_id;
                      }
                    }
                  }

                  let city_arr = a.citys; 
                  //城市数组
                  self.setData({
                    citys: city_arr
                    })
                })

                //判断当前用户是否在常州市 或 广州市
                if (city == '常州市' || city == '广州市'){
                  a.alert('亲这是小程序公测版，暂不发货，谢谢配合')
                }
                else{
                  /*
                  wx.redirectTo({
                    url: '/pages/error/error?type=1'
                  })
                  return false;
                  */
                }
                self.setData({
                  //当前所在城市
                  city: city
                });
                getApp().globalData.city = city;
              }
              
            },
            fail: function (res) {
              wx.redirectTo({
                url: '/pages/error/error?type=2'
              })
              return false;
            }
          });
        },
        fail: function (res) {
          wx.redirectTo({
            url: '/pages/error/error?type=2'
          })
          return false;
        }
      })
    }	
	},
	onShow : function () {
		var a = t.getCache("sysset");
		wx.setNavigationBarTitle({
			title : a.shopname || "商城首页"
		})
		this.getShop()
		// this.getRecommand()
    //获取楼层
    this.getFloor()
	},
	onShareAppMessage : function () {
		return a.onShareAppMessage()
	},
	imagesHeight : function (t) {
		var a = t.detail.width,
		e = t.detail.height,
		o = t.target.dataset.type,
		i = {},
		s = this;
		wx.getSystemInfo({
			success : function (t) {
				i[o] = t.windowWidth / a * e,
				(!s.data[o] || s.data[o] && i[o] < s.data[o]) && s.setData(i)
			}
		})
	}
})
