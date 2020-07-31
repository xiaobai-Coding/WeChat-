import request from '../utils/request'

//获取当前微信用户申请记录列表
export function GetWeUserRegisterRequest(data){
    return request({
        url:'/User/GetWeUserRegisterRequest',
        method:"post",
        headers:{"ASP.NET_SessionId":data.sid},
        data:data.datas
    })
}
//微信用户申请注册
export function UserRegister(data,sid){
    return request({
        url:'/User/UserRegister',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}