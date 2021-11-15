import { getValue } from '../utils/ObjectUtil.js'

const template2Vnode = new Map()
const vnode2Template = new Map()

function log() {
  console.log('template2Vnode', template2Vnode);
  console.log('vnode2Template', vnode2Template);
}

/** 获取虚拟dom中template，跟vnode的对应关系 */
function prepareRender(vm, vnode) {
  if (vnode === null) return

  // 是文本节点
  if (vnode.nodeType === 3) {
    analysisTemplateString(vm, vnode)
  }

  if (vnode.nodeType === 0) {
    setTemplate2Vnode(vnode.data, vnode)
    setVnode2Template(vnode.data, vnode)
  }

  // v-model
  vmodelAttr(vnode)

  // 是元素节点
  vnode.children.forEach(it => {
    prepareRender(vm, it)
  })
}

/** 查找文本节点中的模板字符串设置vnode，teamplate双向查找 */
function analysisTemplateString(vm, vnode) {
  const tempateStrList = vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g) || []
  vnode.template = tempateStrList
  for (let i = 0; i < tempateStrList.length; i++) {
    setTemplate2Vnode(tempateStrList[i], vnode)
    setVnode2Template(tempateStrList[i], vnode)
  }
}

/** 设置teamplate找vnode的map */
function setTemplate2Vnode(template, vnode) {
  const templateName = getTemplateName(template)
  const vnodeSet = template2Vnode.get(templateName)
  if (vnodeSet) {
    template2Vnode.set(templateName, [...vnodeSet, vnode])
  } else {
    template2Vnode.set(templateName, [vnode])
  }
}

/** 设置vnode找template的map */
function setVnode2Template(template, vnode) {
  const templateSet = vnode2Template.get(vnode)
  if (templateSet) {
    vnode2Template.set(vnode, [...templateSet, getTemplateName(template)])
  } else {
    vnode2Template.set(vnode, [getTemplateName(template)])
  }
}

/** 去除模板字符串 {{ }} */
function getTemplateName(template) {
  if (template.includes('{{') && template.includes('}}')) {
    return template.substring(2, template.length - 2)
  } else {
    return template
  }
}


/** 数据更新后进行修改 */
function renderData(vm, template) {
  console.log(`————————————————${template}:重新渲染了节点————————————————`);
  // 获取依赖更新数据的所有节点
  const _vnode = template2Vnode.get(template)
  if (!_vnode) return
  _vnode.forEach(it => {
    // 对节点进行重新渲染
    renderNode(vm, it)
  })
}

/** 渲染节点数据 */
function renderNode(vm, vnode) {
  if (vnode.nodeType === 3) {
    // 是文本节点获取属性进行渲染
    const templates = vnode2Template.get(vnode)  //获取节点所对应的属性模板
    if (templates) { //如果有则获取属性进行元素内容替换
      let text = vnode.text
      templates.forEach(it => {
        const templateValue = getNodeValue([vm._data, vnode.env], it)
        if (templateValue) {
          text = text.replace(`{{${it}}}`, templateValue)
        }
      })
      vnode.el.nodeValue = text
    }

  } else if (vnode.nodeType === 1 && vnode.tag === "INPUT") {
    // 如果节点是input节点则获取数据赋值给input.value
    const templates = vnode2Template.get(vnode)
    if (templates) {
      templates.forEach(it => {
        const templateValue = getNodeValue([vm._data, vnode.env], it)
        if (templateValue) {
          vnode.el.value = templateValue
        }
      })
    }

  } else {
    // 不是文本节点则继续遍历子元素
    for (let i = 0; i < vnode.children.length; i++) {
      renderNode(vm, vnode.children[i])
    }
  }
}

/** 获取节点所对应的文本内容 */
function getNodeValue(objs, templateName) {
  for (let i = 0; i < objs.length; i++) {
    const value = getValue(objs[i], templateName)
    if (value) return value
  }
}

/** 获取节点有v-model属性的节点，获取依赖 */
function vmodelAttr(vnode) {
  if (vnode.nodeType !== 1) return
  const attrs = vnode.el.getAttributeNames()
  if (attrs.includes('v-model')) {
    const template = vnode.el.getAttribute('v-model')
    setTemplate2Vnode(template, vnode)
    setVnode2Template(template, vnode)
  }
}


function getVnodeByTemplate(template) {
  return template2Vnode.get(template)
}

function getTemplateByVnode(vnode) {
  return vnode2Template.get(vnode)
}

function clearMap() {
  template2Vnode.clear()
  vnode2Template.clear()
}

export {
  prepareRender,
  renderNode,
  renderData,
  log,
  getVnodeByTemplate,
  getTemplateByVnode,
  clearMap
}
