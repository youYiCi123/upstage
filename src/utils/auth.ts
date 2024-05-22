import Cookies from 'js-cookie'

const TokenKey = 'loginToken'
const UserName = 'username'

export function getUserName() {
  return Cookies.get(UserName)
}
export const getToken = () => {
  return Cookies.get(TokenKey)
}
export function setToken(token:string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
