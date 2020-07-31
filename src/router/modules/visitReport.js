export default [{
    path: '/serviceList/:sid/visit',
    name: 'visit',
    component: () => import('@/views/visitReport/visitList'),
    meta: {
      keepAlive: true,
      title: '回访列表'
    }
  },
  {
    path: '/serviceList/:sid/visit/detail/visitOrder',
    name: 'visitOrder',
    component: () => import('@/views/visitReport/visitOrder'),
    meta: {
      title: '回访订单',
      keepAlive: true
    }
  },

  {
    path: '/serviceList/:sid/visit/detail/visitOrder/evaluate',
    name: 'evaluate',
    component: () => import('@/views/visitReport/evaluatePerson'),
    meta: {
      title: '人员评价'
    }
  },
]
