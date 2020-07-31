import request from '../utils/request'
//获取当前微信用户关联账号列表
export function GetWeUserAccountList(sessionId){
    return  request({
        url:'/User/GetWeUserAccountList',
        method: 'post',
        headers:{"ASP.NET_SessionId":sessionId},
    })
}
//切换用户
export function SysUserChangingOver(data,sessionId){
    return  request({
        url:'/User/SysUserChangingOver',
        method: 'post',
        headers:{"ASP.NET_SessionId":sessionId},
        data
    })
}

export function SysUserInfoByUserId(){
    return  request({
        url:'/User/GetSysUserInfoByUserId',
        method: 'get'
    })
}
