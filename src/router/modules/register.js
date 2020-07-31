export default [{
    path: '/toggleUser/:sid/register',
    name: 'Register',
    component: () => import('@/views/register/register'),
    meta: {
      title: "注册登记"
    }
  },
  {
    path: '/toggleUser/:sid/register/success',
    name: 'regsuccess',
    component: ()=> import('@/views/register/regSuccess'),
    meta: {
      title: "注册成功"
    }
  },
]
