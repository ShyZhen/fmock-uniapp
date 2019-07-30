<template>
    <view>
        关注
        <button type="primary" @tap="test()">sdddd</button>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
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
            test() {
                console.log(this.hasLogin)
                console.log(this.hasBinding)
            }
        }
    }
</script>

<style>

</style>