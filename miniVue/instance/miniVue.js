import {
  ProxyData
} from './proxy.js'
import {
  mount
} from './mount.js'
import {
  prepareRender,
  renderNode,
  log
} from './render.js'

let uid = 0
export default class miniVue {
  constructor(options = {}) {
    console.log(options);

    // 初始化vue对象
    this._init(options)

    // 调用_render渲染元素内容
    this._render()
  }


  _init(options) {
    const vm = this
    // 初始化
    vm.uid = uid++ //vm唯一id
    vm._isVue = true //是否是vue实例

    // 执行beforeCreate生命周期
    options.beforeCreate && options.beforeCreate.call(vm)

    // 注入代理后的data
    if (options.data) {
      vm._data = ProxyData(vm, options.data, '')
    }

    // 创建vnode虚拟dom
    if (options.el) {
      const rootDom = document.querySelector(options.el)
      vm._vnode = mount(vm, rootDom)
      prepareRender(vm, vm._vnode)
      log()
    }
  }


  _render() {
    renderNode(this, this._vnode)
  }
}