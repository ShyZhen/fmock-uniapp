<script>
	// #ifdef MP-WEIXIN
	import {wxmpLogin} from 'utils/loginPlugin.js'
	// #endif
	export default {
		onLaunch: function() {
			// 如果是微信小程序登录 则直接登录获取token
			// #ifdef MP-WEIXIN

            this.$loading('登录中...')
			wxmpLogin().then(res => {
                this.$loading(false)
			}).catch(err => {
                this.$loading(false);
                setTimeout(() => {this.$toast('登陆失败！'), 500});
            })

			// #endif
		},
		onShow: function() {
			//console.log('App Show');
		},
		onHide: function() {
			//console.log('App Hide');
		}
	}
</script>

<style lang="scss">
    /* 每个页面公共css */
    @import './static/styles/base.scss';
</style>
