<template>
    <view>
        <navBar :logo="logo" :leftIcon="leftIcon" 
                :leftWords="leftWords" :input="input"
                :rightIcon="rightIcon"
                :rightImg="rightImg"
                :rightWords="rightWords"
                :title="title"
                @rightClick="rightClick()"
                @inputClick="inputClick()"></navBar>
        关注
        <button type="primary" @tap="test()">sdddd</button>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
    export default {
        data() {
            return {
                logo: '/static/img/FMOCK-LOGO.png',
                leftIcon: '',
                leftWords: '',
                rightImg: '/static/img/write.png',
                rightIcon: '',
                rightWords: '',
                input: true,
                title: ''
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
            console.log(this.hasLogin)
            console.log(this.hasBinding)
        },
        methods: {
            ...mapActions(['initLoginState']),
            
            rightClick() {
                console.log('navbar右侧图标点击方法ff')
            },
            inputClick() {
                console.log('跳转到搜索页面ff')
            },

            test() {
                console.log(this.hasLogin)
                console.log(this.hasBinding)
            }
        }
    }
</script>

<style>

</style>
