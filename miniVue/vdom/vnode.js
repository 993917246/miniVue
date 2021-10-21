/**
 * vnode
 * tag ： 标签类型
 * elm ： 对应的真实节点
 * children ： 当前虚拟节点的子节点
 * text ： 当前虚拟节点中的文本
 * data ： VNodeData类型的
 * parent ： 父级的VNode节点
 * nodeType ： 节点类型
 * key
 */
export default class VNode {
  constructor(options) {
    for (const key in options) {
      this[key] = options[key]
    }
    this.env = {}
    this.instructions = null
    this.template = []
  }
}