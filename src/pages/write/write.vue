<template>
    <view>
        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
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
                leftIcon: 'iconioscloseempty',
                rightWords: '发布',
                title: '发布主题内容'
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
                this.toLogin()
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


            toLogin() {
                uni.reLaunch({
                    url: '../login/login'
                });
            },
        }
    }
</script>

<style>

</style>
