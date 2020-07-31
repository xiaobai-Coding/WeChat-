import request from '../utils/request'

// 获取机构数据列表
export function appRegister(data){
  return request({
    url:'/Manage/appRegister',
    method:"post",
    data:{
      keyWord:data.keyWord,
    }
  })
}

/**
 * 获取软件版本信息
 * @returns {AxiosPromise}
 */
export function appVersionInfo(data){
  return request({
    url:'/Manage/appVersionInfo',
    method:"post",
    data:{
      AppId : data.AppId,
    }
  })
}
