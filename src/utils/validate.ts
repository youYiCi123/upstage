export function isvalidUsername(str: string) {
  // const valid_map = ['admin', 'test']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.trim().length>=3
}

/* 合法uri*/
export function validateURL(textval: string) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
// 问题选项
export function validateTelephone(rule:any,value: string,callback:any) { 
  const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  if(!reg.test(value)){
    callback(new Error('请输入正确的手机号'))
  }else{
    callback()
  }
}

export function validateEmail(rule:any,value: string,callback:any) { 
  const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  if(!reg.test(value)){
    callback(new Error('请输入正确的邮箱'))
  }else{
    callback()
  }
}

/* 小写字母*/
export function validateLowerCase(str: string) {
  const reg = /^[a-z]+$/;
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str: string) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str: string) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

