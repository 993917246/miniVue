/**
 * vnode
 * tag ： 标签类型
 * elm ： 对应的真实节点
 * children ： 当前虚拟节点的子节点
 * text ： 当前虚拟节点中的文本
 * data ： VNodeData类型的命名空间  a.b
 * parent ： 父级的VNode节点
 * nodeType ： 节点类型
 * key
 * env 当前节点的数据作用域
 * instructions 指令值
 */
let number = 1
export default class VNode {
  constructor(options) {
    for (const key in options) {
      this[key] = options[key]
    }
    this.env = {}
    this.instructions = null
    this.template = []
    this.id = number++
  }
}