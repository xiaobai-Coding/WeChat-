import request from '../utils/request'
//获取派修记录列表
export function GetAssRecordList(data,sid){
    return request({
        url:'/AfterSaleAss/GetAssRecordList',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//获取服务人员列表
export function GetServicePersonList(sid){
    return request({
        url:'/AfterSaleAss/GetServicePersonList',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
    })
}
//新增派修
export function CreateAss(data){
    return request({
        url:'/AfterSaleAss/CreateAss',
        method:'post',
        data
    })
}

//根据派修记录Id获取派修记录

export function GetAssRecordById(data,sid){
    return request({
        url:'/AfterSaleAss/GetAssRecordById',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//修改派修单
export function EditAss(data,sid){
    return request({
        url:'/AfterSaleAss/EditAss',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
//打回派修单
export function BanAssRecord(data,sid){
    return request({
        url:'/AfterSaleReview/BanAssRecord',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
export function CancelAssFix(data,sid){
    return request({
        url:'/AfterSaleAss/CancelAssFix',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
}
export function DeleteRptRecord(data,sid){
    return request({
        url:'/AfterSaleRpt/DeleteRptRecord',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
} 
export function BanRptRecord(data,sid){
    return request({
        url:'/AfterSaleAss/BanRptRecord',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
} 
export function Review(data,sid){
    return request({
        url:'/AfterSaleReview/Review',
        method:'post',
        headers:{"ASP.NET_SessionId":sid},
        data
    })
} 