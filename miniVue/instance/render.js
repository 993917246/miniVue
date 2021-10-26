const template2Vnode = new Map()
const vnode2Template = new Map()


/** 获取虚拟dom中template，跟vnode的对应关系 */
export function prepareRender(vm, vnode) {
  if (vnode === null) return

  // 是文本节点
  if (vnode.nodeType === 3) {
    analysisTemplateString(vm, vnode)
  }

  // 是元素节点
  if (vnode.nodeType === 1) {
    vnode.children.forEach(it => {
      prepareRender(vm, it)
    })
  }
}


/** 查找文本节点中的模板字符串设置vnode，teamplate双向查找 */
function analysisTemplateString(vm, vnode) {
  const tempateStrList = vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g) || []
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
  console.log(template);
  if (template.includes('{{') && template.includes('}}')) {
    return template.substring(2, template.length - 2)
  } else {
    return template
  }
}



export function getTemplate2Vnode() {
  console.log('template2Vnode', template2Vnode);
  return template2Vnode
}

export function getVnode2Template() {
  console.log('vnode2Template', vnode2Template);
  return vnode2Template
}