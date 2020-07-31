export default [
  {
  path: '/serviceList/:sid/statsList',
  name: 'statsList',
  component: () => import('@/views/statsList/statsList'),
  meta: {
    keepAlive: true,
    title: "人员统计"
    }
  },
  {
    path: '/serviceList/:sid/mechainList',
    name: 'mechainList',
    component: () => import('@/views/statsList/mechanList'),
    meta: {
      keepAlive: true,
      title: "机构统计"
    }
  },
  {
    path: '/serviceList/:sid/listDetail',
    name: 'listDetail',
    component: () => import('@/views/statsList/listDetail'),
    meta: {
      title: "列表详情"
    }
  },
  {
    path: '/serviceList/:sid/statsTable',
    name: 'statsTable',
    component: () => import('@/views/statsList/statsTable'),
    meta: {
      title: "统计列表"
    }
  },
  {
    path: '/serviceList/:sid/statsTable/statisDetail',
    name: 'statisDetail',
    component: () => import('@/views/statsList/statisDetail'),
    meta: {
      keepAlive: true,
      title: "详情"
    }
  },
  {
    path: '/serviceList/:sid/statsTable/statisDetail/statisRecord',
    name: 'statisRecord',
    component: () => import('@/views/statsList/statisRecord'),
    meta: {
      title: "订单记录"
    }
  },

]
