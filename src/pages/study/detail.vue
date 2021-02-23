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
          <view class="video-js vjs-big-play-centered" ref="video">
          </view>
        </view>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <video id="fmock-video-context"
               :poster=videoPoster :src=videoSrc :controls=videoControls :danmu-list="danmuList" :enable-danmu="enableDanmu" :danmu-btn="danmuBtn"
               @error="videoErrorCallback" @play="videoPlay" @ended="videoEndCallback" @timeupdate="videoTimeUpdate">
        </video>
        <!-- #endif -->

      </view>
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
      danmuBtn: false,
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

  onReady: function() {
    // #ifdef H5
    this.initH5Video()
    // #endif

    // #ifndef H5 || MP-ALIPAY
    this.videoContext = uni.createVideoContext('fmock-video-context')
    // #endif

    this.title = '动态获取视频标题'
  },

  // 销毁H5video对象
  onUnload: function() {
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
      const that = this
      const video = document.createElement('video')
      video.id = 'video'
      video.style = 'width: 100%;height: 100%;'
      video.poster = this.videoPoster
      video.controls = this.videoControls
      video.setAttribute('playsinline', true) //IOS微信浏览器支持小窗内播放
      video.setAttribute('webkit-playsinline', true) //ios 10中设置可以让视频在小du窗内播放
      video.setAttribute('x5-video-player-type', 'h5') //安卓 声明启用同层H5播放器 可以在video上面加东西
      const source = document.createElement('source')
      source.src = this.videoSrc
      video.appendChild(source)
      this.$refs.video.$el.appendChild(video)
      this.H5video = videojs('video', {
        playbackRates: [0.5, 1.0, 1.5, 2.0], //播放速度
        autoDisable: true,
        preload: 'none', //auto - 当页面加载后载入整个视频 meta - 当页面加载后只载入元数据 none - 当页面加载后不载入视频
        fluid: true, // 自适应宽高
        muted: false, //  是否静音
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        autoplay: false, //如果true,浏览器准备好时开始回放。 autoplay: "muted", //自动播放属性,muted:静音播放
        screenshot:true,
        controlBar: {
          volumePanel: { //声音样式
            inline: false // 不使用水平方式
          },
          timeDivider: true, // 时间分割线
          durationDisplay: true, // 总时间
          progressControl: true, // 进度条
          remainingTimeDisplay: true, //当前以播放时间
          fullscreenToggle: true, //全屏按钮
          pictureInPictureToggle: true, //画中画
        }
      }, function() {
        this.on('error', function() {
          that.videoErrorCallback()
        });
        this.on('play', function() {
          that.videoPlay()
        });
        this.on('ended', function() {
          that.videoEndCallback()
        });
        this.on('timeupdate', function() {
          that.videoTimeUpdate(this.currentTime())
        })
      })
    },
    // #endif

    videoErrorCallback: function(e) {
      this.$toast('this video not support')
    },
    videoPlay: function() {
      console.log('触发开始播放')
    },
    videoEndCallback: function() {
      console.log('触发视频播放结尾事件')
    },
    videoTimeUpdate: function(e) {
      // #ifdef H5
      console.log(e)
      // #endif

      // #ifndef H5 || MP-ALIPAY
      console.log(e.target.currentTime)
      // #endif
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

/* #ifdef H5 */
.video-js .vjs-big-play-button{
  font-size: 2.5em;
  line-height: 2.3em;
  height: 2.5em;
  width: 2.5em;
  -webkit-border-radius: 2.5em;
  -moz-border-radius: 2.5em;
  border-radius: 2.5em;
  background-color: #73859f;
  background-color: rgba(115,133,159,.5);
  border-width: 0.15em;
  margin-top: -1.25em;
  margin-left: -1.75em;
}
/* 中间的播放箭头 */
.vjs-big-play-button .vjs-icon-placeholder {
  font-size: 1.63em;
}
/* 加载圆圈 */
.vjs-loading-spinner {
  font-size: 2.5em;
  width: 2em;
  height: 2em;
  border-radius: 1em;
  margin-top: -1em;
  margin-left: -1.5em;
}
/*点击屏幕播放/暂停*/
.video-js.vjs-playing .vjs-tech {
  pointer-events: auto;
}
/* #endif */
</style>
