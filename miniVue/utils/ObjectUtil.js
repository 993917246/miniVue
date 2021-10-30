
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

export {
  getValue
}