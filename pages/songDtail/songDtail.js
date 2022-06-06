// pages/songDtail/songDtail.js
import request from "../../utils/request";

// 获取全局实例
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    songInfo: {}, //歌曲详情
    musicId: "", //音乐id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.setData({
      musicId,
    });
    this.getMusicInfo(musicId);

    /* 如果用户操作系统的控制音乐播放/暂停按钮，页面不知道 ，导致页面显示是否播放的状态和真实的音乐播放状态不一致
      解决方案：
        1、通过控制音频的实例区监听音乐的播放和暂停
        2、
      */

    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true,
      });
    }
    // 创建控制音乐播放的实例对象
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(true);
      // console.log("play");
      // 修改全局音乐播放状态

      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(false);
      // console.log("pause");
      // 修改全局音乐播放状态
    });
    this.backgroundAudioManager.onStop(() => {
      // 修改音乐为停止状态
      this.changePlayState(false);
    });
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay,
    });
    // 修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取音乐详情
  async getMusicInfo(musicId) {
    let songInfo = await request("/song/detail", { ids: musicId });
    this.setData({
      songInfo: songInfo.songs[0],
    });
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.songInfo.name,
    });
  },

  // 点击播放、暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    /* this.setData({
      isPlay,
    }); */
    let { musicId } = this.data;
    this.musicContal(isPlay, musicId);
  },

  // 控制音乐播放、暂停的功能函数
  async musicContal(isPlay, musicId) {
    // 音乐播放

    if (isPlay) {
      // 获取音乐播放链接
      let musicLinkData = await request("/song/url", { id: musicId });
      let musicLink = musicLinkData.data[0].url;

      // 设置音乐链接
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.songInfo.name;
    } else {
      //音乐暂停
      this.backgroundAudioManager.pause();
    }
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
