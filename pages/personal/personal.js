// pages/personal/personal.js
import request from "../../utils/request";
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 初始化一个translate保存移动的数据
    coverTransform: "tanslateY(0)",
    // 初始化动画效果
    coverTransition: "",
    userInfo: {},
    recentPlayList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取到本地存储的用户数据
    let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
    console.log(userInfo);
    if (userInfo) {
      this.setData({
        userInfo,
      });

      // 获取用户播放记录
      this.getRecentPlayList(this.data.userInfo.userId);
    }
  },

  // 获取最近播放记录
  async getRecentPlayList(userId) {
    let recentPlayListData = await request("/user/record", { uid: userId, type: 0 });
    // 修改data中的数据
    // 由于返回的数组没有唯一标识需要手动添加
    let index = 0;
    let recentPlayList = recentPlayListData.allData.slice(0, 10).map((item) => {
      item.id = index++;
      return item;
    });
    this.setData({
      recentPlayList,
    });
  },

  handleTouchStart(event) {
    this.setData({
      coverTransition: "",
    });
    // 获取起始坐标
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    // 获取移动的 坐标
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    // 判断moveDistance的值是否小于0
    if (moveDistance < 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    // 动态更新 coverTransform 中的值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
    });
  },
  handleTouchEnd() {
    // 将coverTransform的值 置为0
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: "transform 1s linear",
    });
  },

  // 跳转登录界面的回调
  toLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
