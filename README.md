# FMock

## package.json
 - ~~quill medium-editor vue-quill-editor 为三套dom富文本编辑器解决方案，只适用于H5，更换方案的话可以删掉~~
 - ~~vue-color vcolorpicker 为通用方案插件需要的依赖，如果不需要颜色选择的话，可以删掉~~
 - 目前H5使用quill编辑器；小程序使用原生编辑器；移动端不做复杂操作，pc端中加入代码、引用等其他功能

## Init Info
 - 初始化程序后发现富文本编辑器的按钮显示异常，参考 https://ask.dcloud.net.cn/question/76628，解决方案如下：
 将 `9392`, `9528`, `9923`, `11452`行中的`button`改成`uni-button`
 具体如下：
 ```
    [].forEach.call(_this.container.querySelectorAll('uni-button, select'), function (input) {

    var input = document.createElement('uni-button');

    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('uni-button')), _icons2.default);

    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('uni-button')), _icons2.default);
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev:h5
npm run dev:mp-weixin
```

### Compiles and minifies for production
```
npm run build:h5
npm run build:mp-weixin
```
