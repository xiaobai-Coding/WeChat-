import request from '../utils/request'

// 获取报修订单详情
export function GetRptRecordDetailApi(data,sid){
    return request({
        url:'/AfterSaleService/GetRptRecordDetail',
        method:"post",
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//根据报修单号查询报修列表（不分页）
// export function GetRptRecordListByRptNoApi(data,sid){
//     return request({
//         url:'/AfterSaleRpt/GetRptRecordListByRptNo',
//         method:"post",
//         headers:{"ASP.NET_SessionId":sid},
//         data
//     })
// }

