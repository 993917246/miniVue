
/** 从obj中获得name的值（name是个字符串 name.a） */
function getValue(obj, name) {
  if (!obj) return
  const nameList = name.split('.')
  let value = obj
  for (let i = 0; i < nameList.length; i++) {
    value = value[nameList[i]] || undefined
    if (!value) return
  }
  return value
}


/** 设置obj中data数据为value */
/** data ~= obj.x */
function setValue(obj, data, value) {
  if (!obj) return
  const attrList = data.split('.')
  let temp = obj
  for (let i = 0; i < attrList.length - 1; i++) {
    if (temp[attrList[i]]) {
      temp = temp[attrList[i]]
    } else {
      return
    }
  }
  if (temp[attrList[attrList.length - 1]]) {
    temp[attrList[attrList.length - 1]] = value
  }
}

export {
  getValue,
  setValue
}
