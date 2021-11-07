import VNode from '../../vdom/vnode.js'
import { getValue } from '../../utils/ObjectUtil.js'

/**
 * 
 * @param {*} vm vue实例
 * @param {*} instructions 指令值 
 * @param {*} elm dom实例
 * @param {*} parent 父元素vnode
 */
function vfor(vm, instructions, elm, parent) {
  // 生成循环元素的特殊vnode   nodeType = 0 不会进行render渲染
  const vnode = new VNode({
    tag: elm.nodeName,
    el: elm,
    children: [],
    text: '',
    data: getInstructions(instructions)[2],
    parent,
    nodeType: 0,
    key: null
  })
  vnode.instructions = instructions //记录vfor的指令
  parent.el.removeChild(elm) //移除原有的vfor的DOM实例
  const childrensNode = analysisInstructions(vm, instructions, elm, parent)
  return vnode
}

/**
 * 创建v-for DOM 插入parent中
 * @param {*} vm vue实例
 * @param {*} instructions 指令值
 * @param {*} elm 需要循环的dom实例
 * @param {*} parent 父元素vnode
 * @returns 循环之后的dom实例数组
 */
function analysisInstructions(vm, instructions, elm, parent) {
  const inset = getInstructions(instructions)
  let dataSet = getValue(vm._data, inset[2])
  if (!dataSet) throw Error(`v-for:vm._data中不存在${inset[2]}值`)
  const childrensNode = []
  for (let i = 0; i < dataSet.length; i++) {
    const node = document.createElement(elm.nodeName)
    node.innerHTML = elm.innerHTML
    const env = getForEnv(inset[0], dataSet[i], i)
    node.setAttribute('env', JSON.stringify(env))
    parent.el.appendChild(node)
    childrensNode.push(node)
  }
  return childrensNode
}


/**
 * 获取每条For元素的env单独作用域数据
 * @param {*} instructions 指令值
 * @param {*} value 作用域数据
 * @param {*} index
 * @returns env 作用域数据
 */
function getForEnv(instructions, value, index) {
  let result
  if (instructions.includes('(') && instructions.includes(')')) {
    result = instructions.trim().replace('(', '').replace(')', '').split(',')
  } else {
    result = instructions.split(',')
  }
  if (!result) throw Error(`v-for:变量不存在！`)
  const env = {}
  env[result[0]] = value
  if (result >= 2) {
    env[result[1]] = index
  }
  return env
}

/**
 * 解析指令值
 * @param {*} instructions (it,index) in list 
 * @returns ['(it,index)','in','list']
 */
function getInstructions(instructions) {
  const inset = instructions.trim().split(' ')
  if (inset.length !== 3 || (inset[1] !== 'in' && inset[1] !== 'of')) {
    throw Error(`v-for:${instructions}，指令值传入不正确!`)
  }
  return inset
}

export {
  vfor
}