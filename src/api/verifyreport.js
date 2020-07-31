import request from '../utils/request'

//获取审核记录列表
export function GetReviewRecordList(data,sid){
    return request({
        url:'/AfterSaleReview/GetReviewRecordList',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}



