// pages/search/search.js
import request from "../../utils/request";
let isSend = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "", //placeholder默认内容
    hotList: [], //热搜榜数据
    keywords: "", //搜索关键字
    searchList: [], //搜索结果
    searchHistory: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaceholderContent();
    this.getTopList();
    this.getLoaclHistory();
  },
  // 获取input初始化数据
  async getPlaceholderContent() {
    let placeholderData = await request("/search/default");
    // console.log(placeholderData);
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
    });
  },

  // 获取本地存放的历史记录
  getLoaclHistory() {
    let searchHistory = wx.getStorageSync("searchHistoryList");
    if (searchHistory) {
      //  更新data
      this.setData({
        searchHistory,
      });
    }
  },

  // 获取热搜榜的数据
  async getTopList() {
    let { data } = await request("/search/hot/detail");
    // console.log(data);
    this.setData({
      hotList: data,
    });
  },

  // 获取输入框内容发请求
  handleKeyword(event) {
    // console.log(event);
    // 将关键字存入data中
    this.setData({
      keywords: event.detail.value.trim(),
    });
    /*  函数节流 */

    if (isSend) {
      return;
    }
    isSend = true;
    // 发请求获取搜索列表
    this.getSearchList();
    // 函数节流
    setTimeout(async () => {
      isSend = false;
    }, 500);
    //
  },
  // 获取搜索数据的功能函数
  async getSearchList() {
    let { keywords, searchHistory } = this.data;
    // 判断表单项内容
    if (!keywords) {
      this.setData({
        searchList: [],
      });
      return;
    }
    // 发请求获取关键字模糊匹配数据
    let {
      result: { songs },
    } = await request("/search", { keywords, limit: 10 });
    this.setData({
      searchList: songs,
    });

    // 将搜索的关键字添加到搜索历史记录中
    if (searchHistory.indexOf(keywords) !== -1) {
      searchHistory.splice(searchHistory.indexOf(keywords), 1);
    }
    searchHistory.unshift(keywords);
    this.setData({
      searchHistory,
    });
    // 存入本地
    wx.setStorageSync("searchHistoryList", searchHistory);
  },

  // 清空搜索框内容
  clearKeywords() {
    this.setData({
      keywords: "",
      searchList: [],
    });
  },

  // 删除历史记录
  deleteHistory() {
    wx.showModal({
      content: "确认删除吗",
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync("searchHistoryList");
          // 更新data数据
          this.setData({
            searchHistory: [],
          });
        }
      },
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
