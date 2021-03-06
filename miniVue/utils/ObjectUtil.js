
/**
 * 从obj中获得name的值（name是个字符串 name.a）
 * @param {*} obj  通常为vm._data || vnode.dev
 * @param {*} name 属性值命名空间
 * @returns 
 */
function getValue(obj, name) {
  if (!obj) return
  const nameList = name.split('.')
  let value = obj
  for (let i = 0; i < nameList.length; i++) {
    value = value[nameList[i]]
    if (value === undefined) return
  }
  return value
}


/**
 * 设置obj中data数据为value
 * @param {*} obj 通常为vm._data
 * @param {*} data 属性值命名空间 obj.a.b.c
 * @param {*} value 新值
 * @returns 
 */
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
  if (temp[attrList[attrList.length - 1]] !== undefined) {
    temp[attrList[attrList.length - 1]] = value
  }
}

/** 合并两个对象，需要考虑响应式数据获取 */
function mergeAttr(obj1, obj2) {
  if (obj1 == null) {
    return clone(obj2);
  }
  if (obj2 == null) {
    return clone(obj1);
  }
  let result = {};
  let obj1Attrs = Object.getOwnPropertyNames(obj1);
  for (let i = 0; i < obj1Attrs.length; i++) {
    result[obj1Attrs[i]] = obj1[obj1Attrs[i]];
  }
  let obj2Attrs = Object.getOwnPropertyNames(obj2);
  for (let i = 0; i < obj2Attrs.length; i++) {
    result[obj2Attrs[i]] = obj2[obj2Attrs[i]];
  }
  return result;
}

/** 深度克隆 */
function clone(obj) {
  if (obj instanceof Array) {
    return cloneArray(obj);
  } else if (obj instanceof Object) {
    return cloneObject(obj);
  } else {
    return obj;
  }
}

function cloneObject(obj) {
  let result = {};
  let names = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < names.length; i++) {
    result[names[i]] = clone(obj[names[i]]);
  }
  return result;
}

function cloneArray(obj) {
  let result = new Array(obj.length);
  for (let i = 0; i < obj.length; i++) {
    result[i] = clone(obj[i]);
  }
  return result;
}



export {
  getValue,
  setValue,
  mergeAttr,
  clone
}
