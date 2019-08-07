
// 加载层
function loading(text, config) {
    if (text === false) {
        uni.hideLoading();
    } else {
        text = text || '';
        let options = Object.assign({
            title: text,
            mask: true,
        }, config || {});
        uni.showLoading(options);
    }
}

// 弹窗
function toast(text, config) {
  let options = Object.assign({
    title: text,
    icon: 'none',
    duration: 2000,
  }, config || {});
  uni.showToast(options);
}

export { loading, toast }