export default [{
  path: '/toggleUser/:sid',
  name: 'toggleUser',
  component: () => import('@/views/userInfo/toggleUser'),
  meta: {
    title: '我的'
  }
}]
