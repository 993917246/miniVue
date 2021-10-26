"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareRender = prepareRender;
exports.getTemplate2Vnode = getTemplate2Vnode;
exports.getVnode2Template = getVnode2Template;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var template2Vnode = new Map();
var vnode2Template = new Map();
/** 获取虚拟dom中template，跟vnode的对应关系 */

function prepareRender(vm, vnode) {
  if (vnode === null) return; // 是文本节点

  if (vnode.nodeType === 3) {
    analysisTemplateString(vm, vnode);
  } // 是元素节点


  if (vnode.nodeType === 1) {
    vnode.children.forEach(function (it) {
      prepareRender(vm, it);
    });
  }
}
/** 查找文本节点中的模板字符串设置vnode，teamplate双向查找 */


function analysisTemplateString(vm, vnode) {
  var tempateStrList = vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g) || [];

  for (var i = 0; i < tempateStrList.length; i++) {
    setTemplate2Vnode(tempateStrList[i], vnode);
    setVnode2Template(tempateStrList[i], vnode);
  }
}
/** 设置teamplate找vnode的map */


function setTemplate2Vnode(template, vnode) {
  var templateName = getTemplateName(template);
  var vnodeSet = template2Vnode.get(templateName);

  if (vnodeSet) {
    template2Vnode.set(templateName, [].concat(_toConsumableArray(vnodeSet), [vnode]));
  } else {
    template2Vnode.set(templateName, [vnode]);
  }
}
/** 设置vnode找template的map */


function setVnode2Template(template, vnode) {
  var templateSet = vnode2Template.get(vnode);

  if (templateSet) {
    vnode2Template.set(vnode, [].concat(_toConsumableArray(templateSet), [getTemplateName(template)]));
  } else {
    vnode2Template.set(vnode, [getTemplateName(template)]);
  }
}
/** 去除模板字符串 {{ }} */


function getTemplateName(template) {
  console.log(template);

  if (template.includes('{{') && template.includes('}}')) {
    return template.substring(2, template.length - 2);
  } else {
    return template;
  }
}

function getTemplate2Vnode() {
  console.log('template2Vnode', template2Vnode);
  return template2Vnode;
}

function getVnode2Template() {
  console.log('vnode2Template', vnode2Template);
  return vnode2Template;
}