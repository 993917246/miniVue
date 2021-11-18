
/**
 * 获取执行环境代码字符串
 * @param {string} env 
 * @return 返回用于env执行的代码
 */
function generateAnnoCode(env) {
  let codeStr = ''
  for (const key in env) {
    codeStr += `let ${key} = ${JSON.stringify(env[key])};`
  }
  return codeStr
}

/**
 * 获取字符串代码的执行结果
 * @param {*} env 环境变量代码字符串
 * @param {*} expression 逻辑代码字符串
 */
function isTrue(env, expression) {
  let result = false
  const performCode = `
  ${env}
  if (${expression}) {
    result = true
  }else {
    result = false
  }
  `
  eval(performCode)
  return result
}


export {
  generateAnnoCode,
  isTrue
}