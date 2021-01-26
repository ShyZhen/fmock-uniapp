<template>
  <view class="content">
    <view>
      <view class="photo-wall">
        <image :src="user.photo_wall ? user.photo_wall : '/static/img/default_photo_wall.jpg'"></image>
      </view>
      <view class="avatar">
        <image :src="user.avatar ? user.avatar : '/static/img/default_avatar.jpg'"></image>
        <button size="mini" type="primary" @click="">编辑资料</button>
      </view>
      <view>
        {{user.name}}
        {{user.id}}
      </view>
      <view>
        {{user.bio}}
      </view>
      <view>
        {{user.fans_num}}
        {{user.followed_num}}
        详细信息>
      </view>
    </view>

    <view>
      <view class="grid-list">
        <uni-grid :column="3" :showBorder="false" :square="true" @change="change">
          <uni-grid-item>
            <image src="/static/img/u-write.png" mode="widthFix" />
            <text class="text">创作</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-collection.png" mode="widthFix" />
            <text class="text">收藏</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-comment.png" mode="widthFix" />
            <text class="text">评论</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-video.png" mode="widthFix" />
            <text class="text">已购买课程</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-history.png" mode="widthFix" />
            <text class="text">历史观看</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-tab.png" mode="widthFix" />
            <text class="text">标签</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-attestation.png" mode="widthFix" />
            <text class="text">认证</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-notification.png" mode="widthFix" />
            <text class="text">消息中心</text>
          </uni-grid-item>
          <uni-grid-item>
            <image src="/static/img/u-logout.png" mode="widthFix" />
            <text class="text">退出</text>
          </uni-grid-item>
        </uni-grid>
      </view>
    </view>
  </view>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { logout } from '@/utils/loginPlugin.js'
import { getMyInfo } from '@/apis/users.js'

// 宫格
import uniGrid from '@/components/grid/uni-grid.vue'
import uniGridItem from '@/components/grid/uni-grid-item.vue'

export default {
  data() {
    return {
      user: {}
    }
  },
  onLoad: function () {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 判断登录状态 并跳转到首页
    if (!this.hasLogin) {
      this.$toLogin()
    }

    this.initUserInfo()
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin'])
  },
  components: {
    uniGrid, uniGridItem
  },
  methods: {
    ...mapActions(['initLoginState']),

    initUserInfo() {
      this.$loading()
      getMyInfo().then(res => {
        this.user = res.data
        this.$loading(false)
      }).catch(err => {
        this.$loading(false)
      })
    },

    change(e) {
      let { index } = e.detail
      switch (index) {
        case 0:
          console.log('000')
          break
        case 1:
          console.log('1111')
          break
        case 2:
          console.log('222')
          break
        case 3:
          console.log('333')
          break
        case 4:
          console.log('444')
          break
        case 5:
          console.log('555')
          break
        case 6:
          console.log('666')
          break
        case 7:
          console.log('7777')
          break
        case 8:
          this.bindLogout()
          break
        default:
          console.log(index)
      }
    },

    bindLogout() {
      this.$loading()
      logout().then(res => {
        this.$loading(false)
        this.$toLogin()
      })
    },
  }
}
</script>

<style>
.grid-list image {
  width: 55rpx;
  height: 110px;
}

.text {
  font-size: 12px;
  margin-top: 20px;
}

.photo-wall image {
  width: 100%;
  height: 160px;
}
.avatar image {
  border-radius: 50%;
  width: 81px;
  height: 81px;
}
</style>
