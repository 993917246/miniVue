import VNode from '../vdom/vnode.js'


export function mount(vm, el) {
  // vm._vnode = constructVNode(vm, el)
  return constructVNode(vm, el)
}



// 创建虚拟节点
function constructVNode(vm, elm, parent = null) {
  const vnode = new VNode({
    tag: elm.nodeName,
    el: elm,
    children: [],
    text: getNodeText(elm),
    data: null,
    parent,
    nodeType: elm.nodeType,
    key: null
  })

  const childs = vnode.el.childNodes //获取当前dom元素所有子元素，包括换行

  // 遍历所有子节点递归获取子元素vnode
  childs.forEach(it => {
    const childNodes = constructVNode(vm, it, vnode)

    // 将所有子节点vnode添加到父级children中
    if (childNodes instanceof VNode) {
      vnode.children.push(childNodes)
    } else {
      vnode.children = [...vnode.children, ...childNodes]
    }

  })

  return vnode;
}


/** 获取el中的文本 */
function getNodeText(elm) {
  if (elm.nodeType === 3) {
    return elm.nodeValue
  } else {
    return ""
  }
}