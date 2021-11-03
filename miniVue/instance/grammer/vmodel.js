import { setValue } from '../../utils/ObjectUtil.js'

/** vmodel */
function vmodel(vm, elm, data) {
  elm.onchange = e => {
    setValue(vm._data, data, e.target.value)
  }
}

export {
  vmodel
}