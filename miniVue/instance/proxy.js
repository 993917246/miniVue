import { renderData } from './render.js'
import { reBuild } from './mount.js'

/**
 * 生成代理data
 * @param {*} vm vue实例
 * @param {*} data data对象
 * @param {*} namespace 命名空间，当前属性的完整名称
 */
function ProxyData(vm, data, namespace) {
  let proxy = null
  if (data instanceof Array) {
    proxy = ProxyArray(vm, data, namespace)
  } else if (data instanceof Object) {
    proxy = ProxyObject(vm, data, namespace)
  } else {
    throw Error('typeof data only object or array!')
  }
  return proxy
}

/**
 * 设置对象代理
 * @param {*} vm vue实例
 * @param {*} data data对象
 * @param {*} namespace 命名空间，当前属性的完整名称
 */
function ProxyObject(vm, data, namespace) {
  let proxy = {} //创建新的代理对象

  for (const key in data) {

    // 将代理数据挂在proxy上
    Object.defineProperty(proxy, key, {
      configurable: true, //设置此属性可修改，删除
      get() {
        return data[key]
      },
      set(newVal) {
        console.log(`${getNamespace(namespace, key)}设置了新值:`, newVal);
        data[key] = newVal
        // 重新渲染元素节点
        renderData(vm, getNamespace(namespace, key))
      }
    })

    // 将代理数据挂在vue实例上
    Object.defineProperty(vm, key, {
      configurable: true,
      get() {
        return data[key]
      },
      set(newVal) {
        console.log(`${getNamespace(namespace, key)}设置了新值:`, newVal);
        data[key] = newVal
        // 重新渲染元素节点
        renderData(vm, getNamespace(namespace, key))
      }
    })

    // 判断当前属性是否是对象，对对象深层递归代理
    if (data[key] instanceof Object) {
      proxy[key] = ProxyData(vm, data[key], getNamespace(namespace, key))
    }
  }
  return proxy
}

/**
 * 设置数组代理
 * @param {*} vm vue实例
 * @param {*} data data数组
 * @param {*} namespace 命名空间，当前属性的完整名称
 */
function ProxyArray(vm, arr, namespace) {
  const obj = {
    eleType: 'Arrya',
    toString() {
      return this.join(',')
    },
    push() { },
    pop() { },
    shift() { },
    unshift() { }
  }
  defArrayFunc.call(vm, obj, 'push', namespace, vm)
  defArrayFunc.call(vm, obj, 'pop', namespace, vm)
  defArrayFunc.call(vm, obj, 'shift', namespace, vm)
  defArrayFunc.call(vm, obj, 'unshift', namespace, vm)
  arr.__proto__ = obj
  return arr
}

/**
 * 代理Array原型的各类方法
 * @param {*} obj 新原型
 * @param {*} func 代理方法名
 * @param {*} namespace 命名空间
 * @param {*} vm vue实例
 */
function defArrayFunc(obj, func, namespace, vm) {
  Object.defineProperty(obj, func, {
    enumerable: true,
    configurable: true,
    value(...args) {
      const newArray = Array.prototype[func].apply(this, args) //更改数据
      reBuild(vm, getNamespace(namespace, '')) // 重新挂载节点并收集依赖
      renderData(vm, getNamespace(namespace, '')) // 重新渲染数据
      return newArray
    }
  })
}

/**
 * 获取作用域命名
 * @param {*} namespace 原命名空间
 * @param {*} key 命名空间下属性
 * @returns obj.key ?
 */
function getNamespace(namespace, key) {
  if (namespace == null || namespace == "") {
    return key;
  } else if (key == null || key == "") {
    return namespace;
  } else {
    return namespace + "." + key;
  }
}


export {
  ProxyData
}