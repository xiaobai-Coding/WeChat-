import request from "../utils/request";


/*
* 用户提交发票信息
*/
//发票信息
export function GetWaitDrawInvoiceList(data,sid) {
  return request({
    url:'/InvoiceCollect/GetWaitDrawInvoiceList',
    method:"post",
    headers: {
      "ASP.NET_SessionId": sid
    },
    data
  })
}
//发票提交
export function UserSubmitInvoiceOrder(data,sid) {
  return request({
    url:'/InvoiceCollect/UserSubmitInvoiceOrder',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}

/**
 * 收款
 */
// 收款页面卡片信息
export function ReceiveMoneyDetail(data,sid) {
  return request({
    url:'/InvoiceCollect/ReceiveMoneyDetail',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}
//收款提交
export function CollectMoney(data,sid) {
  return request({
    url:'/InvoiceCollect/CollectMoney',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}


/**
 * 服务人员开发票
 */
//获取发票信息数据
export function GetInvoiceCardInfo(data,sid) {
  return request({
    url:'/InvoiceCollect/GetInvoiceCardInfo',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}

//获取需要开发票的列表
export function GetWaitInvoiceList(data,sid) {
  return request({
    url:'/InvoiceCollect/GetWaitInvoiceList',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}

//提交发票
export function DrawInvoice(data,sid) {
  return request({
    url: '/InvoiceCollect/DrawInvoice',
    method: "post",
    headers: {"ASP.NET_SessionId": sid},
    data
  })
}

