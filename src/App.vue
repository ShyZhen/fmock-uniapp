<script>
export default {
  onLaunch: function() {
    const systemInfo = uni.getSystemInfoSync();
    // 状态栏的高度
    const ktxStatusHeight = systemInfo.statusBarHeight;
    this.$store.commit('getStatusH', ktxStatusHeight);
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
@import 'styles/base.scss';

</style>
