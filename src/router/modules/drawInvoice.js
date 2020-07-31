export default [{
  path: '/invoice/:sid',
  name: 'invoice',
  component: () => import('@/views/drawInvoice/invoice'),
  meta: {
    title: "开票"
  }
}]
