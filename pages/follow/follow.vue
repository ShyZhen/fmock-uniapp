<template>
    <view>
        关注
        <button type="primary" @tap="test()">sdddd</button>
    </view>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {

            }
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

            test() {
                console.log(this.hasLogin)
                console.log(this.hasBinding)
            }
        }
    }
</script>

<style>

</style>
