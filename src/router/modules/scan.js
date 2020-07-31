export default [
  {
    path: '/serviceList/:sid/scan',
    name: 'scan',
    component: () => import('@/views/scan'),
    meta: {
      keepAlive: false,
      title: '扫一扫'
    }
  }
]
