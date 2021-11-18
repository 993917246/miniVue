import { getValue, mergeAttr } from '../../utils/ObjectUtil.js'
import { generateAnnoCode, isTrue } from '../../utils/code.js'

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
 * @param {string} value 属性值命名空间
 */
function vbind(vm, vnode, name, value) {
  const k = name.split(':')
  if (/^{[\w\W]+}$/.test(value)) {
    const str = value.substring(1, value.length - 1).trim()
    const expressionList = str.split(',')
    const result = analysisExpression(vm, vnode, expressionList)
    vnode.el.setAttribute(k[1], result)
  } else {
    const v = getValue(vm._data, value)
    vnode.el.setAttribute(k[1], v)
  }
}

/**
 * 获取执行后代码的结果
 * @param {*} vm vue实例
 * @param {*} vnode 虚拟dom
 * @param {Array} expressionList 指令列表
 */
function analysisExpression(vm, vnode, expressionList) {
  const env = mergeAttr(vm._data, vnode.env)
  const envCode = generateAnnoCode(env)
  let result = ''

  expressionList.forEach(it => {
    const code = it.split(':')
    if (isTrue(envCode, code[1])) {
      result += code[0] + ','
    }
  })

  if (result.length > 0) {
    result = result.substring(0, result.length - 1)
  }
  return result
}



export {
  checkBind
}