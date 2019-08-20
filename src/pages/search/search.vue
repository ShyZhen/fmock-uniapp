<template>
    <view class="content">
        <navBar :logo="logo"
                :showInput="showInput"
                @rightClick="rightClick()"
                @leftClick="leftClick()">
        </navBar>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'

    export default {
        data() {
            return {
                logo: '',
                showInput: true
            }
        },
        components: {
            navBar
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad: function () {

            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态 并跳转到首页
            if (!this.hasLogin) {
                this.$toLogin()
            }
        },
        methods: {
            ...mapActions(['initLoginState']),

            rightClick() {
                console.log('right')
            },
            leftClick() {
                console.log('left')
            },
        }
    }
</script>

<style>

</style>
