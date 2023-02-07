import { $requst,$requstLogin } from '../utils/request'
// 用户登录
export const appLogin = (userName,password) => {
  return $requstLogin({
    url: '/api/app-login/login',
    method: 'POST',
    data: {
      userName: userName,
      password: password
    }
  })
}
// 获取当前用户信息
export const getUserInfo = () => {
  return $requst({
    url: '/api/app-base/queryUserInfo',
    method: 'GET'
  })
}