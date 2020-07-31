export default [{
  path: '/serviceList/:sid/dispatch',
  name: 'dispatch',
  component: () => import('@/views/dispatchReport/dispatchList'),
  meta: {
    keepAlive: true,
    title: '派修列表'
  }
}, {
  path: '/serviceList/:sid/dispatch/detail/dispatchOrder',
  name: "dispatchOrder",
  component: () => import('@/views/dispatchReport/dispatchOrder'),
  meta: {
    title: '派修订单'
  },
}, {
  path: '/serviceList/:sid/dispatch/detail/editDispatchOrder',
  name: "editDispatchOrder",
  component: () => import('@/views/dispatchReport/editDispatchOrder'),
  meta: {
    title: '派修订单修改'
  },
}]
