import request from '../utils/request'

//获取当前微信用户申请记录列表
export function login(data){
  return request({
    url:'/Home/TestLogin',
    method:"post",
    data
  })
}



//获取当前微信用户申请记录列表
export function getWxConfig(){
  return request({
    url:'/Home/getWxConfig',
    method:"post",
  })
}
