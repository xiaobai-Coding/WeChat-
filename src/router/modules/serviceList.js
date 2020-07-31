export default [{
  path: '/serviceList/:sid',
  name: 'serviceList',
  component: () => import('@/views/serviceList/serviceList'),
  meta: {
    title: "服务"
  }
}]
