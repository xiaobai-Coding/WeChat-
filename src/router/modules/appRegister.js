export default [
  {
    path: '/serviceList/:sid/appRegister',
    name: 'appRegister',
    component: () => import('@/views/appRegister'),
    meta: {
      keepAlive: true,
      title: "软件统计",
      scrollTop:'',
    }
  },
  {
    path: '/serviceList/:sid/appRegister/editionInfo',
    name: 'editionInfo',
    component: () => import('@/components/editionInfo'),
    meta: {
      keepAlive: false,
      title: "版本详情"
    }
  },
]
