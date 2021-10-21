import VNode from '../vdom/vnode.js'



export function mount(vm, el) {
  vm._vnode = constructVNode(vm, el, null)
}

function constructVNode(vm, elm, parent) {
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


  return vnode;
}

function getNodeText(elm) {
  if (elm.nodeType === 3) {
    return elm.nodeValue
  } else {
    return ''
  }
}