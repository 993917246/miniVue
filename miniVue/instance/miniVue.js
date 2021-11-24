import { ProxyData } from './proxy.js'
import { mount } from './mount.js'
import {
  prepareRender,
  renderNode,
} from './render.js'

let uid = 0
export default class miniVue {
  constructor(options = {}) {

    // 初始化vue对象
    this._init(options)

    // 调用created生命周期
    options.created && options.created.call(this)

    // 调用_render渲染元素内容
    this._render()
  }


  _init(options) {
    const vm = this
    // 初始化
    vm.uid = uid++ //vm唯一id
    vm._isVue = true //是否是vue实例

    // 初始化data
    if (options.data) {
      vm._data = ProxyData(vm, options.data, '')
    }

    // 初始化computed
    if (options.computed) {
      vm._computed = options.computed
      for (const key in options.computed) {
        vm[key] = options.computed[key]()
      }
    }

    // 初始化methods
    if (options.methods) {
      vm._methods = options.methods
      for (const key in options.methods) {
        vm[key] = options.methods[key]
      }
    }

    // 初始化vnode虚拟dom并挂载
    if (options.el) {
      const rootDom = document.querySelector(options.el)
      vm._vnode = mount(vm, rootDom)
      prepareRender(vm, vm._vnode) //收集依赖 绑定指令
    }
  }


  _render() {
    renderNode(this, this._vnode)
  }
}