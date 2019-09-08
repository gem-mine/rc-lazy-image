import React, { Component } from 'react'
import Util from './util'

/**
 * withLazyimg
 *
 * @param {Object} config
 *
 * support picture tag
 * picturefill:https://github.com/scottjehl/picturefill
 *
 */

function withLazyimg (config = {}) {
  /**
   * default configurations
   *
   */

  const _defaults = {
    threshold: 0,
    event: 'scroll',
    container: window,
    skip_invisible: true,
    parent: undefined,
    appear: null,
    force: false,
    load: null,
    error: null,
    node_type: 'img',
    placeholder:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
  }

  let EventHandler = {
    addHandler: function (oElement, sEvent, fnHandler) {
      oElement.addEventListener
        ? oElement.addEventListener(sEvent, fnHandler, false)
        : oElement.attachEvent('on' + sEvent, fnHandler)
    },
    removeHandler: function (oElement, sEvent, fnHandler) {
      oElement.removeEventListener
        ? oElement.removeEventListener(sEvent, fnHandler, false)
        : oElement.detachEvent('on' + sEvent, fnHandler)
    }
  }

  class Lazyimg extends Component {
    constructor (props) {
      super(props)
      // 待加载或已加载images
      this.lazyimgs = []
      // 初始化状态
      this.initState(props, true)
      // 缓存el
      this.el = null
    }

    initState (props, isInit) {
      // 过滤props
      let { configProps, originalProps } = Util.filterProps(props)
      let settings = Object.assign({}, _defaults, props.config, configProps)

      // 设置state
      if (isInit) {
        this.state = {
          // src: settings.placeholder,
          isLoaded: false,
          isFailed: false
        }
      } else {
        this.setState({
          // src: settings.placeholder,
          isLoaded: false,
          isFailed: false
        })
      }
      // 缓存当前image
      this.currentImg = {
        id: Util.uid(),
        src: settings.src,
        srcSet: settings.srcSet,
        nodeType: settings.node_type,
        loaded: false,
        failed: false,
        once: true,
        onCallback: Util.throttle(() => {
          // 处理在detach之后，存在延迟执行回调函数
          this.currentImg && !this.currentImg.isDetach && this.check()
        }, 300),
        onCb: this.check.bind(this),
        settings: settings,
        originalProps: originalProps,
        proxyImg: new Image(),
        detach: this.detach.bind(this),
        isDetach: false,
        isAnimation: false
      }
      this.lazyimgs.push(this.currentImg)
    }

    // check
    check () {
      let el = this.el
      let currentImg = this.currentImg
      let { src, loaded, once, settings, proxyImg } = currentImg
      // skip invisible
      if (settings.skip_invisible && !Util.isVisible(el)) {
        return
      }
      // process
      if (settings.force || (Util.inTheViewport(el, settings) && !loaded && once)) {
        // execute once
        currentImg.once = false
        // appear hook
        if (settings.appear && typeof settings.appear === 'function') {
          settings.appear.call(this, el, settings)
        }

        proxyImg.onload = () => {
          // 已加载标识
          currentImg.loaded = true
          // 设置状态
          this.setState({
            // src: src,
            isLoaded: true,
            isFailed: false
          })
        }
        // proxyImg error
        proxyImg.onerror = () => {
          // 已加载标识
          currentImg.failed = true
          // 设置状态
          this.setState({
            isFailed: true
          })
        }

        // proxy img
        proxyImg.src = src
        // support srcset
        // srcSet(react: https://reactjs.org/docs/dom-elements.html)
        if (settings.srcSet !== undefined) {
          proxyImg.srcset = settings.srcSet
        }
      }
    }

    // detach for init binding
    detach () {
      // 缓存el
      let el = this.el
      let currentImg = this.currentImg
      let {
        onCb,
        onCallback,
        settings,
        proxyImg,
        detach,
        isDetach
      } = currentImg
      // detach bind event
      if (settings.event.indexOf('scroll') === 0) {
        EventHandler.removeHandler(settings.container, settings.event, onCallback)
      } else {
        EventHandler.removeHandler(el, settings.event, onCb)
      }
      // bind size event
      EventHandler.removeHandler(window, 'resize', onCallback)

      // null
      proxyImg.onload = null
      proxyImg.onerror = null
      proxyImg = null
      onCallback = null
      onCb = null
      detach = Util.noop
      isDetach = true
      currentImg.proxyImg = proxyImg
      currentImg.onCallback = onCallback
      currentImg.onCb = onCb
      currentImg.detach = detach
      currentImg.isDetach = isDetach
    }
    // init
    init () {
      // initialization
      this.check()
      let el = this.el
      let { onCb, onCallback, settings } = this.currentImg
      // bind events
      if (settings.event.indexOf('scroll') === 0) {
        // passive of Event : http://www.cnblogs.com/ziyunfei/p/5545439.html
        // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        EventHandler.addHandler(settings.container, settings.event, onCallback)
      } else {
        EventHandler.addHandler(el, settings.event, onCb)
      }
      EventHandler.addHandler(window, 'resize', onCallback)
    }

    // 过滤已加载的图片
    filterLoadedImages (props) {
      let el = this.el
      let { src, srcSet } = props
      let loadedLazyImg = Util.isExistImage(this.lazyimgs, src)
      if (loadedLazyImg && loadedLazyImg.loaded) {
        if (loadedLazyImg.nodeType === 'img') {
          el.setAttribute('src', src)
          if (srcSet !== undefined) {
            el.setAttribute('srcset', srcSet)
          }
        } else {
          el.style.backgroundImage = "url('" + src + "')"
        }
        return true
      }
      return false
    }

    componentDidMount () {
      this.init()
    }
    shouldComponentUpdate (nextProps) {
      // debugger;
      if (this.props.src !== nextProps.src) {
        if (this.filterLoadedImages(nextProps)) {
          return false
        }
        this.initState(nextProps)
        this.init()
      }
      return true
    }

    componentDidUpdate () {
      let el = this.el
      let currentImg = this.currentImg
      let {
        settings,
        detach,
        isDetach,
        loaded,
        failed,
      } = currentImg
      // 处理回调函数及清除工作
      if (loaded) {
        // load hook
        if (settings.load && typeof settings.load === 'function') {
          settings.load.call(this, el, currentImg)
        }

        // clear up
        !isDetach && detach()
      }
      if (failed) {
        // error hook
        if (settings.error && typeof settings.error === 'function') {
          settings.error.call(this, el, currentImg)
        }
        // clear up
        !isDetach && detach()
      }
    }

    componentWillUnmount () {
      let currentImg = this.currentImg
      currentImg && !currentImg.isDetach && currentImg.detach()
      currentImg.settings = null
      currentImg.originalProps = null
      currentImg = null
      this.el = null
      this.detach = null
      this.lazyimgs.length = 0
      this.lazyimgs = null
    }

    render () {
      let currentImg = this.currentImg
      let { settings, originalProps, src, srcSet, nodeType } = currentImg
      let children = null
      let lazyImgProps = {
        ref: el => (this.el = el),
        ...originalProps
      }

      if (this.state.isLoaded) {
        if (srcSet !== undefined) {
          lazyImgProps.srcSet = srcSet
        }
        if (nodeType === 'img') {
          lazyImgProps.src = src
        } else {
          lazyImgProps.style = { backgroundImage: `url('${src}')` }
          if (originalProps.style) {
            currentImg.originalProps.style = {
              ...originalProps.style,
              ...lazyImgProps.style
            }
          }
        }
      } else {
        if (React.isValidElement(settings.placeholder)) {
          // 确保ref的获取
          nodeType = 'div'
          children = React.createElement(
            settings.placeholder.type,
            settings.placeholder.props,
            null
          )
          // 不影响placeholder的样式
          lazyImgProps = { ...lazyImgProps, className: '' }
        } else {
          if (nodeType === 'img') {
            lazyImgProps.src = settings.placeholder
          } else {
            lazyImgProps.style = {
              backgroundImage: `url('${settings.placeholdersrc}')`
            }
          }
        }
      }
      return React.createElement(nodeType, lazyImgProps, children)
    }
  }

  // defaultProps
  Lazyimg.defaultProps = {
    config: config
  }

  return Lazyimg
}

export { withLazyimg }

export default withLazyimg()
