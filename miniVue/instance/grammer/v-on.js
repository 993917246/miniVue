import { getValue } from '../../utils/ObjectUtil.js'

/**
 * 搜索v-on指令
 * @param {*} vm vue实例
 * @param {*} vnode 虚拟dom
 * @returns 
 */
function checkOn(vm, vnode) {
  if (vnode.nodeType !== 1) return
  const attrNames = vnode.el.getAttributeNames()
  for (let i = 0; i < attrNames.length; i++) {
    if (attrNames[i].indexOf('v-on:') === 0 || attrNames[i].indexOf('@') === 0) {
      von(vm, vnode, getEvent(attrNames[i]), vnode.el.getAttribute(attrNames[i]))
    }
  }

}

/**
 * 绑定v-on
 * @param {*} vm vue实例
 * @param {*} vnode 虚拟dom
 * @param {*} event 事件名
 * @param {*} key 事件函数值
 */
function von(vm, vnode, event, key) {
  const func = getValue(vm._methods, key)
  if (func) {
    vnode.el.addEventListener(event, () => {
      func.call(vm)
    })
  }
}

function getEvent(attrName) {
  return attrName.split(':')[1] || attrName.split('@')[1]
}


export {
  checkOn
}