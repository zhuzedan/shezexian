// pages/newPoint/index.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk');
var qqmapsdk = new QQMapWX({
  key: 'VIRBZ-B676P-WDCDC-LVCZD-PUSHO-3NFWZ'
});
import {
  getAreaList,
  getStreetList
} from '../../api/base'
import {
  insertCheckPoint
} from '../../api/mine'

function tao(content) {
  wx.showToast({
    title: content,
    icon: "none"
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUnit: false, //单位弹层控制
    businessTypeNull: null, //类型设置初始值
    type: ['公益', '商业'],
    businessTypeIndex: 0,
    categoryCodeNull: null,
    areaOrgCodeNull: null,
    streetOrgCodeNull: null,
    index1: 0,
    index2: 0,
    index3: 0,
    index4: 0,
    area: [],
    occupation: '',
    // 表单字段
    name: '', //单位名
    creditCode: '',
    businessType: '', //类型
    categoryCode: '', // 类别
    areaOrgCode: '', //区域
    streetOrgCode: '', //街道
    connectName: '', //联系人
    address: '',
    longitude: '',
    latitude: '',
    connectTel: '', //电话
  },
  // 双向绑定-单位名称
  getName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  // 双向绑定-统一信用代码
  getCreditCode: function (e) {
    this.setData({
      creditCode: e.detail.value
    });
  },
  // 双向绑定-类型选择器
  getBusinessType: function (e) {
    this.setData({
      businessTypeNull: 111222333,
      businessTypeIndex: e.detail.value,
      businessType: this.data.type[e.detail.value]
    })
    // console.log(this.data.businessType);
    // console.log(businessTypeIndex,this.data.businessTypeIndex);
  },
  // 双向绑定-类别选择器
  getCategoryCode: function (e) {
    if (this.data.businessTypeIndex == 0) {
      this.setData({
        categoryCodeNull: 111222333,
        index2: e.detail.value,
        categoryCode: this.data.welfareCategory[e.detail.value].id
      })
      // console.log(this.data.index2);
      // console.log(this.data.welfareCategory[this.data.index2]);
    }
    if (this.data.businessTypeIndex == 1) {
      this.setData({
        categoryCodeNull: 111222333,
        index2: e.detail.value,
        categoryCode: this.data.businessCategory[e.detail.value].id
      })
    }
  },
  // 双向绑定-区域:
  getAreaOrgCode: function (e) {
    let orgCode = this.data.area[e.detail.value].id
    this.setData({
      areaOrgCodeNull: 111222333,
      index3: e.detail.value,
      areaOrgCode: this.data.area[e.detail.value].id
    });
    getStreetList(orgCode).then((res) => {
      if (res.code == 200) {
        let street = [];
        let length = res.data.length
        for (var i = 0; i < length; i++) {
          let obj = {
            id: res.data[i].orgCode,
            name: res.data[i].name
          }
          street.push(obj)
        }
        if (street.length == 0) {
          console.log('该区域下无街道');
          let orgArr = ['全域']
          let obj = {
            id: orgCode,
            name: '全域'
          }
          street.push(obj)
          this.setData({
            street,
            orgArr
          })
        }
        else {
          let orgArr = res.data.map(item => {
            return item.name
          })
          this.setData({
            street,
            orgArr
          })
        }
      }
    })
  },
  // 双向绑定-街道
  getStreetOrgCode: function (e) {
    this.setData({
      streetOrgCodeNull: 112233,
      streetOrgCode: this.data.street[e.detail.value].id,
      index4: e.detail.value
    });
    console.log(this.data.streetOrgCode);
  },
  // 双向绑定-联系人
  getConnectName: function (e) {
    this.setData({
      connectName: e.detail.value
    });
  },
  // 双向绑定-详细地址
  getAddress: function (e) {
    this.setData({
      address: e.detail.value
    });
    var _this = this;
    qqmapsdk.geocoder({
      address: '宁波市'+e.currentTarget.dataset.area+e.currentTarget.dataset.street+_this.data.address,
      success: function (res) { //成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          latitude: latitude,
          longitude: longitude
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  // 双向绑定-联系人电话
  getConnectTel: function (e) {
    this.setData({
      connectTel: e.detail.value
    });
  },
  // 确定按钮
  submit(e) {
    console.log(e.currentTarget.dataset);
    const {
      name,
      creditCode,
      businessType,
      categoryCode,
      areaOrgCode,
      streetOrgCode,
      connectName,
      connectTel,
      address,
      latitude,
      longitude
    } = this.data

    // 判断输入内容是否空值
    if (name == '') {
      tao('单位名不能为空')
      return;
    }
    if (creditCode == '') {
      tao('统一信用代码不能为空')
      return;
    }
    if (latitude == '' && longitude == '') {
      tao('请选择位置')
      return;
    }
    if (businessType == '') {
      tao('请选择类型')
      return;
    }
    if (categoryCode == '') {
      tao('请选择类别')
      return;
    }
    if (areaOrgCode == '') {
      tao('请选择区域')
      return;
    }
    if (streetOrgCode == '') {
      tao('请选择街道')
      return;
    }
    if (connectName == '') {
      tao('联系人不能为空')
      return;
    }
    if (address == '') {
      tao('详细地址不能为空')
      return;
    }
    if (connectTel == '') {
      tao('联系人电话不能为空')
      return;
    }
    if (connectTel.length != 0 && connectTel.length != 11) { //输入的手机号不足11位提示
      tao('请输入11位手机号')
      return;
    }
    if (connectTel.length == 11) { //输入的手机号满足11位
      //正则匹配开头是1总长度为11的号码
      let regex = /^(((1[35789][0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
      if (!regex.test(connectTel)) {
        tao('手机号格式有误')
        return;
      }
    }

    wx.showModal({
      title: '',
      content: '确认提交吗？',
      complete: (res) => {
        if (res.confirm) {
          insertCheckPoint(name,this.data.creditCode, this.data.businessTypeIndex, this.data.categoryCode, this.data.areaOrgCode, this.data.streetOrgCode, address, connectName, connectTel, this.data.latitude, this.data.longitude).then((res) => {
            if (res.code == 200) {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              wx.switchTab({
                url: '../mine/index',
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'error'
              })
            }
          })
        } else if (res.cancel) {
          tao('取消提交')
        }
      }
    })
  },
  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    getAreaList().then((res) => {
      if (res.code == 200) {
        let area = [];
        let length = res.data.length
        for (var i = 0; i < length; i++) {
          let obj = {
            id: res.data[i].orgCode,
            name: res.data[i].name,
          }
          area.push(obj)
        }
        let areaName = area.map(item => {
          return item.name
        })
        this.setData({
          areaName,
          area
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let category = wx.getStorageSync('category')
    if (category) {
      let arr1 = category[1].cate_two.map(item => {
        return item.title
      })
      let arr2 = category[2].cate_two.map(item => {
        return item.title
      })
      let categoryRange = [arr1, arr2]
      let welfareCategory = category[1].cate_two
      let businessCategory = category[2].cate_two
      this.setData({
        categoryRange,
        welfareCategory,
        businessCategory
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})