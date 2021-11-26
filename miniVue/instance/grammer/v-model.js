import { setValue } from '../../utils/ObjectUtil.js'

/**
 * vmodel
 * @param {*} vm vue实例
 * @param {*} el 真实dom
 * @param {*} data 命名空间 
 */
function vmodel(vm, el, data) {
  el.onchange = e => {
    setValue(vm._data, data, e.target.value)
  }
}

export {
  vmodel
}