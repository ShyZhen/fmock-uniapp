<template>
	<view>
		首页
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
		computed: mapState(['hasBinding', 'hasLogin']),
		onLoad: function () {
			console.log(this.hasLogin)
			console.log(this.hasBinding)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
