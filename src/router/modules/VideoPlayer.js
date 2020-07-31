export default [
  {
    path: '/serviceList/:sid/course',
    name: 'course',
    component: () => import('@/views/video/course'),
    meta: {
      keepAlive: false,
      title: '课程列表',
      routerAlive: true
    }
  },
  {
    path: '/serviceList/:sid/course/player',
    name: 'player',
    component: () => import('@/views/video/player'),
    meta: {
      keepAlive: false,
      title: '课程播放',
      routerAlive: true
    }
  },
]
