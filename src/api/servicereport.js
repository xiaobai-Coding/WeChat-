import request from '../utils/request'

//上传图片
export function UploadFile(data,sid){
  return request({
    url:'/AfterSaleService/UploadFile',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}

//获取服务记录列表
export function GetServiceRecordList(data,sid){
    return request({
        url:'/AfterSaleService/GetServiceRecordList',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//根据服务记录Id获取服务配件列表
export function GetServicePartsListByServiceId(data,sid){
    return request({
        url:'/AfterSaleService/GetServicePartsListByServiceId',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//根据派修记录Id获取服务记录
export function GetServiceRecordByAssId(data,sid){
    return request({
        url:'/AfterSaleService/GetServiceRecordByAssId',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//服务
export function ProblemService(data,sid){
    return request({
        url:'/AfterSaleService/ProblemService',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}

