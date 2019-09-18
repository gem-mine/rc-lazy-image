# rc-lazy-image
---

图片懒加载组件，提供异步加载等相关功能。

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Image from '@gem-mine/rc-lazy-image';
ReactDOM.render(<NdLazyimg src='xxx.jpg' />, container);
```


### 基本用法

```jsx
import Image from '@gem-mine/rc-lazy-image'

const props = {
  width: 200,
  height: 200,
}

class App extends React.Component {
  
  render() {
    return (
      <div>
        <Image {...props}
          src='//gcdncs.101.com/v0.1/static/fish/script/swfupload/a801236bjw1ez812gy3g8j20rs0rs0z5.jpg' />
        <Image {...props}
          src='//gcdncs.101.com/err.jpg' />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```

### 事件

```jsx
import Image from '@gem-mine/rc-lazy-image'

const props = {
  threshold: 500,
  appear: () => {
    console.log('threshold trigger')    
  }
};

ReactDOM.render(
  <div>
    <Image
      {...props}
      src={'//gcdncs.101.com/v0.1/static/fish/script/swfupload/a801236bjw1ez812gy3g8j20rs0rs0z5.jpg'}
    />
  </div>,
  mountNode,
);

```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| threshold | 指定距离底部多少距离时触发加载 | Number | 0 |
| event | 指定触发事件，默认为'scroll' | String | `scroll` |
| container | 指定容器，默认为window | React.Node | `window` |
| parent | 可以指定动画效果作用于元素的哪个父级元素 | String \| Number | - |
| appear | 元素出现在可视窗口时触发appear钩子函数 | Function | null |
| load | 元素图片的加载完后触发load钩子函数 | Function | null |
| error | 图片加载出错时触发error钩子函数 | Function | null |
| node_type | 指定生成的节点类型，默认为'img' | String | `img` |
| placeholder | 占位元素，除了支持普通的图片外，还支持react组件 | String \| React.Node | 默认占位图 |

fork from [react-lazyimg-component](https://github.com/zhansingsong/react-lazyimg-component)
