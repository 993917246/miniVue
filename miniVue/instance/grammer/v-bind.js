import { getValue } from '../../utils/ObjectUtil.js'

/**
 * 绑定v-bind
 * @param {*} vm  vue实例
 * @param {*} vnode 虚拟dom
 */
function checkBind(vm, vnode) {
  if (vnode.nodeType !== 1) return

  const attr = vnode.el.getAttributeNames()

  for (let i = 0; i < attr.length; i++) {
    if (attr[i].indexOf('v-bind:') === 0 || attr[i].indexOf(':') === 0) {
      vbind(vm, vnode, attr[i], vnode.el.getAttribute(attr[i]))
    }
  }
}

/**
 * 修改数据
 * @param {*} vm vue实例
 * @param {*} vnode 虚拟dom
 * @param {*} name 需要绑定的值指令 : v-bind:src
 * @param {*} value 属性值命名空间
 */
function vbind(vm, vnode, name, value) {
  const k = name.split(':')
  const v = getValue(vm._data, value)
  vnode.el.setAttribute(k[1], v)
}



export {
  checkBind
}