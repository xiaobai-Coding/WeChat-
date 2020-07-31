import request from '../utils/request'

//获取回访记录列表
export function GetBackVisitRecordList(data,sid){
    return request({
        url:'/AfterSaleBackVisit/GetBackVisitRecordList',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//回访查询
export function GetBackVisitRecordByAssRecordId(data,sid){
    return request({
        url:'/AfterSaleBackVisit/GetBackVisitRecordByAssRecordId',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//回访
export function BackVisit(data,sid){
    return request({
        url:'/AfterSaleBackVisit/BackVisit',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}