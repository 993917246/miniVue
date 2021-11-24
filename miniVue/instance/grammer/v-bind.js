import { getValue, mergeAttr } from '../../utils/ObjectUtil.js'
import { generateAnnoCode, isTrue } from '../../utils/code.js'

/**
 * 搜索v-bind指令
 * @param {*} vm  vue实例
 * @param {*} vnode 虚拟dom
 */
function checkBind(vm, vnode) {
  if (vnode.nodeType !== 1) return
  const attr = vnode.el.getAttributeNames() //获取节点的所有att属性

  // 循环判断是否有符合v-bind的条件，符合的进行条件绑定
  for (let i = 0; i < attr.length; i++) {
    if (attr[i].indexOf('v-bind:') === 0 || attr[i].indexOf(':') === 0) {
      vbind(vm, vnode, attr[i], vnode.el.getAttribute(attr[i]))
    }
  }
}

/**
 * 绑定v-bind
 * @param {*} vm vue实例
 * @param {*} vnode 虚拟dom
 * @param {*} name 需要绑定的值指令 : v-bind:src
 * @param {string} value 属性值命名空间
 */
function vbind(vm, vnode, name, value) {
  const k = name.split(':') //获取绑定的属性key [''/v-bind , 'key']
  if (/^{[\w\W]+}$/.test(value)) { //判断value是个属性还是个表达式
    const str = value.substring(1, value.length - 1).trim() //将表达式去除大括号
    const expressionList = str.split(',') //将表达式拆分
    const result = analysisExpression(vm, vnode, expressionList) // 获取表达式执行结果
    vnode.el.setAttribute(k[1], result)
  } else {
    // 属性值则直接绑定属性
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
  const env = mergeAttr(vm._data, vnode.env) //获取执行环境变量
  const envCode = generateAnnoCode(env) //将执行环境变量转换成字符串代码
  let result = ''

  //遍历表达式，获取执行结果
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