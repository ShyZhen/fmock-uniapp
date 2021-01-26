<!--视频列表页-->
<template>
  <view class="content">
    <nav-bar :logo="logo" :title="title"></nav-bar>

    <view class="study-content" :style="{paddingTop: statusH + 44 + 'px'}">
      <view v-for="(item, index) in videoList" :key="index" class="e-box_f e-mt10" @click="navToDetails(item.uuid)">
        {{item.poster}}
      </view>
    </view>

  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar'

export default {
  data() {
    return {
      logo: '/static/img/FMOCK-LOGO.png',
      title: '视频广场',
      showInput: true,
      videoList: []
    }
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin', 'statusH']),
  },
  components: {
    navBar,
  },
  onLoad: function () {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 判断登录状态
    if (!this.hasLogin) {
      this.$toLogin()
    }

    this.loadVideoList()
  },
  methods: {
    ...mapActions(['initLoginState']),

    loadVideoList() {
      this.videoList = [
        {'uuid':1,'poster':'www.litblc.com'},
        {'uuid':2,'poster':'www.github.com'},
        {'uuid':3,'poster':'www.google.com'},
      ];
    },
    // 视频详情页
    navToDetails(uuid){
      uni.navigateTo({
        url: `/pages/study/detail?id=${uuid}`
      })
    },
  }
}
</script>

<style>
.content {
  padding: 0 8rpx 20rpx 8rpx;
}
.study-content {
  height: 100%;
}
</style>
