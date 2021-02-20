<!--上传视频功能demo 只作为H5端演示-->
<template>
  <view class="content">
    <view class="upload-content" :style="{paddingTop: statusH + 44 + 'px'}">
      <button @tap="uploadVideo">click me</button>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getUploadToken, getUniqueName, saveVideo, transcode } from '@/apis/files.js'
import * as qiniu from 'qiniu-js'
import Config from '@/config/config.js'
import { inArray } from '@/utils/common'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin', 'statusH']),
  },
  components: {
  },
  onLoad: function () {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 判断登录状态
    if (!this.hasLogin) {
      this.$toLogin()
    }

  },
  methods: {
    ...mapActions(['initLoginState']),

    uploadVideo: function() {
      let that = this
      uni.chooseVideo({
        count: 1,
        sourceType: ['camera', 'album'],
        success: function (res) {
          // 验证文件
          if (!that.validateVideo(res.tempFile)) {
            return false
          }

          // 生成不重复的文件名(仅H5)
          let key = that.getVideoPrefix() + that.getVideoSuffix(res.name)

          // 获取七牛上传token 七牛SDK上传
          that.$loading('上传中')
          getUploadToken('video').then(token => {
            const observable = qiniu.upload(res.tempFile, key, token.data, {}, {})
            observable.subscribe({
              next(res) {
                // console.log('上传进度:', res.total.percent)
              },
              error(err) {
                // that.$toast(err.message)
                that.$toast('上传失败，请重试')
              },
              complete(res) {
                that.saveVideoItem(res).then(r => {
                  that.$loading('转码中')
                  console.log(that.getTranscode(r.data.uuid))
                }).catch(e => {
                  console.log(e)
                })
              }
            })

          }).catch(err => {
            console.log(err)
          })
        }
      });
    },
    validateVideo: function(tempFile) {
      // 验证文件MIME
      if (tempFile.type.slice(0, 5) !== 'video') {
        this.$toast('只能上传视频类型文件')
        return false
      }

      // 验证文件名后缀
      let fileArr = tempFile.name.split('.')
      let suffix = fileArr[fileArr.length - 1]
      let typeList = ['ogm', 'wmv', 'mpg', 'webm', 'ogv', 'mov', 'asx', 'mpeg', 'mp4', 'm4v', 'avi']
      if (!inArray(typeList, suffix)) {
        this.$toast('文件类型有误')
        return false
      }

      if(tempFile.size / 1024 > 1024 * 1024){
        this.$toast('视频最大不能超过1G')
        return false
      }
      return true
    },
    getVideoPrefix: function() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return 'video/' + year + '/' + month + '/'
    },
    getVideoSuffix: function(name) {
      let key = getUniqueName('video')
      let fileArr = name.split('.')
      return key + '.' + fileArr[fileArr.length - 1]
    },
    saveVideoItem: function(item) {
      let data = {
        'key': item.key,
        'hash': item.hash,
        'url': Config.cdnUrlVideo + '/' + item.key,
      }
      return saveVideo(data)
    },
    getTranscode: function(uuid) {
      return transcode(uuid)
    }
  }
}
</script>

<style>
.content {
  padding: 0 8rpx 20rpx 8rpx;
}
</style>
