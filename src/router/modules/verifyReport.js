export default [
  {
    path: '/serviceList/:sid/verify',
    name: 'verify',
    component: () => import('@/views/verifyReport/verifyList'),
    meta: {
      keepAlive: true,
      title: '审核列表',
      routerAlive: true
    }
  },
]
