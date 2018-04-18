# rc-qrcode
---

二维码组件，用于绘制二维码

## Usage

```js
import Qrcode from '@sdp.nd/rc-qrcode';
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(<Qrcode />, container);
```

## API

| 参数 | 说明 | 类型 | 默认值 |
|-|-|-|-|
| size         | 必选参数,二维码大小 | Number | 256 |
| text         | 必选参数,要编码的字符串 | String | '' |
| correctLevel | 纠错级别，可取0、1、2、3，数字越大说明所需纠错级别越大 | Number | 3 |
| background   | 背景色 | String | '#fff' |
| foreground   | 前景色 | String |'#000' |
| image        | 中间图片的url，只支持配置正方形图片 | String | '' |
| imageSize    | 中间图片的大小 | Number | 3 |


## License

rc-qrcode is released under the MIT license.