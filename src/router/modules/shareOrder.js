export default [{
  path: '/serviceList/:sid/detail',
  name: 'detail',
  component: () => import('@/views/shareOrder/orderDetail'),
  meta: {
    title: '订单详情'
  }
}, {
  path: '/serviceList/:sid/search',
  name: 'search',
  component: () => import('@/views/shareOrder/searchOrder'),
  meta: {
    title: "订单查询"
  }
}, ]
