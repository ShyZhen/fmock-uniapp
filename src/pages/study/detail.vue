<!--视频详情页 通过视频uuid获取视频详情-->
<template>
  <view class="content">
    <navBar :logo="logo" :leftIcon="leftIcon"
            :title="title"
            @leftClick="toBack()">
    </navBar>

    <view class="detail-content" :style="{paddingTop: statusH + 44 + 'px'}">
      <view>

        <!-- #ifdef H5 -->
        <view>
          <view class="video-js" ref="video">
          </view>
        </view>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <video id="fmock-video-context"
               :poster=videoPoster :src=videoSrc :controls=videoControls :danmu-list="danmuList" :enable-danmu="enableDanmu" :danmu-btn="danmuBtn"
               @error="videoErrorCallback" @ended="videoEndCallback">
        </video>
        <!-- #endif -->

      </view>
      <!-- #ifndef MP-ALIPAY -->
      <view class="uni-list uni-common-mt">
        <view class="uni-list-cell">
          <view>
            <view class="uni-label">弹幕内容</view>
          </view>
          <view class="uni-list-cell-db">
            <input v-model="danmuValue" class="uni-input" type="text" placeholder="在此处输入弹幕内容" />
          </view>
        </view>
      </view>
      <view class="uni-btn-v">
        <button @click="sendDanmu" class="page-body-button">发送弹幕</button>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from "@/components/nav-bar";

export default {
  data() {
    return {
      logo: '',
      title: '',
      leftIcon: 'iconjiantou',
      videoPoster: 'https://image.fmock.com/avatar/2020/08/user-197d90bc-6ce5-ed30-b8f6-81bc3fd41b5e.png',
      videoSrc: 'https://video.fmock.com/hls/1280/video-e9b41439-c1b0-7e54-60e5-6ad50d6d64ce.m3u8',
      videoControls: true,
      enableDanmu: true,
      danmuBtn: true,
      danmuList: [],
      danmuValue: '',

      H5video: null,
    }
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin', 'statusH']),
  },
  components: {
    navBar,
  },
  onLoad(idObj) {

    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 判断登录状态
    if (!this.hasLogin) {
      this.$toLogin()
    }

    this.idObj = idObj
    console.log(this.idObj)
  },

  onReady: function(res) {
    // #ifdef H5
    this.initH5Video()
    // #endif

    // #ifndef H5
    // #ifndef MP-ALIPAY
    this.videoContext = uni.createVideoContext('fmock-video-context')
    // #endif
    // #endif

    this.title = '动态获取视频标题'
  },

  // 销毁H5video对象
  onUnload: function() {
    console.log(this.H5video)
    // #ifdef H5
    if (this.H5video) {
      this.H5video.dispose();
    }
    // #endif
  },
  methods: {
    ...mapActions(['initLoginState']),

    // #ifdef H5
    // h5移动端使用videojs插件
    initH5Video: function() {
      const video = document.createElement('video')
      video.id = 'video'
      video.style = 'width: 100%;height: 100%;'
      video.poster = this.videoPoster
      video.controls = this.videoControls
      const source = document.createElement('source')
      source.src = this.videoSrc
      video.appendChild(source)
      this.$refs.video.$el.appendChild(video)
      this.H5video = videojs('video')
    },
    // #endif

    sendDanmu: function() {
      this.videoContext.sendDanmu({
        text: this.danmuValue,
        color: this.getRandomColor()
      });
      this.danmuValue = '';
    },
    videoErrorCallback: function(e) {
      uni.showModal({
        // content: e.target.errMsg,
        content: 'video plugin not support',
        showCancel: false
      })
    },
    getRandomColor: function() {
      const rgb = []
      for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
      }
      return '#' + rgb.join('')
    },
    videoEndCallback: function() {
      console.log('触发视频播放结尾事件')
    },
    toBack() {
      const pages = getCurrentPages()
      this.$toBack(pages.length)
    },
  }
}
</script>

<style>
.detail-content {
  height: 100%;
}
</style>
