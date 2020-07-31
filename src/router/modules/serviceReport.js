export default [{
    path: '/serviceList/:sid/service',
    name: 'service',
    component: () => import('@/views/serviceReport/serviceList'),
    meta:{
      keepAlive: true,
      title: '服务列表'
    }
  },
  {
    path: "/serviceList/:sid/service/detail/serviceOrder",
    name: "serviceOrder",
    component: () => import('@/views/serviceReport/serviceOrder'),
    meta: {
      keepAlive:false,
      title: '服务订单'
    }
  },
  {
    path: '/serviceList/:sid/service/detail/serviceOrder/serviceProduct',
    name: 'serviceProduct',
    component: () => import('@/views/serviceReport/serviceProduct'),
    meta: {
      title: '服务产品'
    }
  },
  {
    path: '/serviceList/:sid/service/detail/serviceOrder/serviceEvaluate',
    name: 'serviceEvaluate',
    component: () => import('@/views/serviceReport/serviceEvaluate'),
    meta: {
      title: '客户意见'
    }
  },
]
