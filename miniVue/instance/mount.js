import VNode from '../vdom/vnode.js'
import { vmodel } from './grammer/vmodel.js'
import { vfor } from './grammer/vfor.js'
import { mergeAttr } from '../utils/ObjectUtil.js'

export function mount(vm, el) {
  // vm._vnode = constructVNode(vm, el)
  return constructVNode(vm, el)
}



// 创建虚拟节点
function constructVNode(vm, elm, parent = null) {
  let vnode = analysisAttr(vm, elm, parent)
  if (!vnode) {
    vnode = new VNode({
      tag: elm.nodeName,
      el: elm,
      children: [],
      text: getNodeText(elm),
      data: null,
      parent,
      nodeType: elm.nodeType,
      key: null
    })

    // 这是vnode的作用域数据
    if (elm.nodeType == 1 && elm.getAttribute("env")) {
      vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute("env")));
    } else {
      vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
    }
  }

  //获取当前dom元素所有子元素，包括换行  如果nodeType =0 代表是for元素的模板需要获取父级的children列表
  // const childs = vnode.nodeType === 0 ? vnode.parent.el.childNodes : vnode.el.childNodes
  const childs = vnode.el.childNodes
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

/** 绑定指令并获取指令返回的对象 */
function analysisAttr(vm, elm, parent) {
  if (elm.nodeType === 1) {
    const attr = elm.getAttributeNames()

    // 设置v-model
    if (attr.includes('v-model')) {
      return vmodel(vm, elm, elm.getAttribute('v-model'))
    }

    // 设置v-for
    if (attr.includes('v-for')) {
      return vfor(vm, elm.getAttribute('v-for'), elm, parent)
    }
  }
}

