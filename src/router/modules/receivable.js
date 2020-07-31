export default [
  {
    path: '/receivableList/:sid',
    name: 'receivableList',
    component: () => import('@/views/receivables/receivableList'),
    meta: {
      title: "收款"
    }
  },
  {
    path: '/serviceList/:sid/verify/detail/receivables',
    name: 'receivables',
    component: () => import('@/views/receivables/receivables'),
    meta: {
      keepAlive: false,
      title: '收款',
      routerAlive: true
    }
  },
]
