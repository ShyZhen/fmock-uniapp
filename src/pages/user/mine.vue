<template>
    <view class="content">
        <view>
            <view>
                <img :src="this.user.avatar" alt="">
                {{this.user.id}}
                {{this.user.name}}
                {{this.user.bio}}
                {{this.user.fans_num}}
                {{this.user.followed_num}}
            </view>
            <view>
                <uni-grid :column="3" :showBorder="false" :square="true" @change="change">
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-write.png" mode="widthFix" />
                        <text class="text">创作</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-collection.png" mode="widthFix" />
                        <text class="text">搜藏</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-comment.png" mode="widthFix" />
                        <text class="text">评论</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-video.png" mode="widthFix" />
                        <text class="text">已购买课程</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-history.png" mode="widthFix" />
                        <text class="text">历史观看</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-tab.png" mode="widthFix" />
                        <text class="text">标签</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-attestation.png" mode="widthFix" />
                        <text class="text">认证</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-notification.png" mode="widthFix" />
                        <text class="text">消息中心</text>
                    </uni-grid-item>
                    <uni-grid-item>
                        <image class="image" src="/static/img/u-logout.png" mode="widthFix" />
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
    .image {
        width: 55upx;
        height: 55upx;
    }

    .text {
        font-size: 24upx;
        margin-top: 10upx;
    }
</style>
