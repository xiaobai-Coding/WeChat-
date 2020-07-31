import request from '../utils/request'

//上传图片
export function UploadFile(data,sid){
    return request({
        url:'/AfterSaleRpt/UploadFile',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}

//新增报修
export function CreateRpt(data,sid){
    return request({
        url:'/AfterSaleRpt/CreateRpt',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//根据报修记录Id获取报修记录
export function GetRptRecordById(data,sid){
    return request({
        url:'/AfterSaleRpt/GetRptRecordById',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//修改报修
export function EditRpt(data){
    return request({
        url:'/AfterSaleRpt/EditRpt',
        method:'post',
        data
    })
}
//获得报修记录列表
export function GetRptRecordList(data,sid){
    return request({
        url:'/AfterSaleRpt/GetRptRecordList',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//获得报修记录列表
export function GetRptRecordListByRecordUser(data,sid){
    return request({
        url:'/AfterSaleRpt/GetRptRecordListByRecordUser',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
export function GetCustomerList(data){
    return request({
        url:'/AfterSaleRpt/GetCustomerList',
        method:"post",
        data
    })
}
