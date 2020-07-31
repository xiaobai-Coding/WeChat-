import request from '../utils/request'

//获取课程列表
export function GetCourseList(data,sid){
  return request({
    url:'/VOD/GetCourseList',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}

//获取视频列表
export function GetVideoList(data,sid){
  return request({
    url:'/VOD/GetVideoList',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}

//获取视频播放地址
export function GetVideoPlayAuth(data,sid){
  return request({
    url:'/VOD/GetVideoPlayAuth',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}


//视频计时
export function KeeSession(data,sid){
  return request({
    url:'/VOD/KeeSession',
    method:"post",
    headers:{"ASP.NET_SessionId":sid},
    data
  })
}


