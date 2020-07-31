import request from '../utils/request'

// 获取机构数据列表
export function GetOrganStatistics(data){
  return request({
    url:'/AfterSaleStatistic/GetOrganStatistics',
    method:"post",
    data
  })
}
//获取用户数据列表
export function GetServiceStatistics(data){
  return request({
    url:'/AfterSaleStatistic/GetServiceStatistics',
    method:"post",
    data
  })
}
//获取检测机构详情
export function GetOrganDetails(data){
  return request({
    url:'/AfterSaleStatistic/GetOrganDetails',
    method:"post",
    data
  })
}
//获取用户数据详情
export function GetServiceDetails(data){
  return request({
    url:'/AfterSaleStatistic/GetServiceDetails',
    method:"post",
    data
  })
}
