# nd-lazyimg
---

图片懒加载组件，提供异步加载等相关功能。

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import NdLazyimg from '@sdp.nd/nd-lazyimg';
ReactDOM.render(<NdLazyimg src='xxx.jpg' />, container);
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| errorImg | 可选参数，占位元素，在图片加载失败后显示 | React.Node 或者 图片地址(支持 base64) | error 占位图 |
| height | 可选参数，高度 | Number | - |
| lazy | 可选参数，是否懒加载 | Boolean | true |
| loadingImg | 可选参数，占位元素，在图片加载完成前显示 | React.Node 或者 图片地址(支持 base64) | loading 占位图 |
| noBorder | 可选参数，是否没有边框 | Boolean | false |
| size | 可选参数，图片缩放方式，有三种选择 `length`、`cover`、`contain` (当选择`cover` 或 `contain`时，必须填写 `width` 与 `height`) | String | `length` |
| src | 必填参数，图片地址 | String | - |
| threshold | 可选参数，指定距离底部多少距离时触发加载 | Number | 0 |
| width | 可选参数，宽度 | Number | - |
| onChange | 可选参数，元素状态(`appear`、`load`、`error`)变化时触发 | Function | 无 |
