import VNode from '../vdom/vnode.js'
import { mergeAttr } from '../utils/ObjectUtil.js'
import { getVnodeByTemplate, clearMap, prepareRender } from './render.js'
import { checkBind } from './grammer/v-bind.js'
import { vmodel } from './grammer/v-model.js'
import { vfor } from './grammer/v-for.js'
import { checkOn } from './grammer/v-on.js'

function mount(vm, el) {
  // vm._vnode = constructVNode(vm, el)
  return constructVNode(vm, el)
}


/**
 * 创建虚拟节点
 * @param {*} vm vue实例
 * @param {*} elm 节点实例
 * @param {*} parent 父级vnode
 * @returns 
 */
function constructVNode(vm, elm, parent = null) {
  let vnode = analysisAttr(vm, elm, parent)  // 绑定v-model v-for
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

  checkBind(vm, vnode) // 绑定v-bind
  checkOn(vm, vnode)

  //获取当前dom元素所有子元素，包括换行  如果nodeType =0 代表是for元素的模板需要获取父级的children列表
  const childs = vnode.nodeType === 0 ? vnode.parent.el.childNodes : vnode.el.childNodes
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

/** 重新渲染节点 */
function reBuild(vm, nameSpace) {
  const vnode = getVnodeByTemplate(nameSpace) //获取依赖改动数据的所有dom节点
  for (let i = 0; i < vnode.length; i++) {
    vnode[i].parent.el.innerHTML = '' //清空父组件的所有子元素
    vnode[i].parent.el.appendChild(vnode[i].el) //还原最原始的子组件
    const result = constructVNode(vm, vnode[i].el, vnode[i].parent)  //获取重新渲染的节点
    vnode[i].parent.children = [result] //插入父元素
    clearMap() //清空所有依赖关系
    prepareRender(vm, vm._vnode) //重新获取依赖关系
  }
}


export {
  mount,
  reBuild
}

