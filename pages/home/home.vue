<template>
    <view>
        首页
                <button type="primary" @tap="test()">sd</button>
    </view>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import * as LoginPlugin from '../../utils/loginPlugin.js'

    export default {
        data() {
            return {

            }
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad: function () {
            console.log(this.hasLogin)
            console.log(this.hasBinding)
        },
        methods: {
            ...mapMutations(['setLoginState']),
            test() {
                console.log(this.hasLogin)
                console.log(this.hasBinding)
				// console.log(this.setLoginState)
            }
        }
    }
</script>

<style>

</style>