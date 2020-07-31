export default [{
    path: '/serviceList/:sid/report',
    name: 'report',
    component: () => import('@/views/repairReport/repairList'),
    meta: {
      keepAlive: true,
      title: '我的报修'
    }
  },
  {
    path: '/serviceList/:sid/report/add',
    name: 'add',
    component: () => import('@/views/repairReport/addRepair'),
    meta: {
      title: '添加报修'
    }
  },
  {
    path: '/serviceList/:sid/report/change',
    name: 'change',
    component: () => import('@/views/repairReport/changeOrder'),
    meta: {
      keepAlive: true,
      title: '订单编辑'
    }
  },
  {
    path: '/serviceList/:sid/report/add/product',
    name: 'product',
    component: () => import('@/views/repairReport/addProduct'),
    meta: {
      title: '产品新增'
    }
  },
  {
    path: '/serviceList/:sid/report/useradd',
    name: 'useradd',
    component: () => import('@/views/repairReport/userAddRepair'),
    meta: {
      title: '添加报修'
    }
  },
]
