import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(Router)

import RegProgress from '@/views/register/regProgress'
import {GetWeUserAccountList} from "@/api/userInfo"//获取当前登录的用户名称与机构
import Register from './modules/register'
import Repair from './modules/repairReport'
import ShareOrder from './modules/shareOrder'
import DispatchReport from './modules/dispatchReport'
import ServiceReport from './modules/serviceReport'
import VisitReport from './modules/visitReport'
import verifyReport from './modules/verifyReport'
import userInfo from './modules/userInfo'
import ServiceList from './modules/serviceList'
import StatsList from './modules/statsList'
import StatsTable from './modules/statsList'
import MechainList from './modules/serviceList'
import StatisDetail from './modules/serviceList'
import StatisRecord from './modules/serviceList'
import ListDetail from './modules/serviceList'
import Receivable from './modules/receivable'
import Invoice from './modules/invoice'
import DrawInvoice from './modules/drawInvoice'
import Course from './modules/videoPlayer'
import Player from './modules/videoPlayer'
import AppRegister from "./modules/appRegister"
import Scan from "./modules/scan"

import Test2 from '@/views/test2'
import Test1 from '@/views/test1'
import Test from '@/views/test'
import App from '@/App'


const router = new Router({


  // 项目打包路由地址
  routes: [
    // ...Register, //注册
    // ...userInfo,//我的页面
    // ...Repair,  // 报修
    // ...ShareOrder, // 搜索和详情页面
    // ...DispatchReport, // 派修
    // ...ServiceReport, // 服务
    // ...VisitReport, // 回访
    // ...verifyReport,  // 审核
    // ...Receivable,//收款
    // ...Invoice,//开票
    // ...DrawInvoice,//申请发票
    // ...ServiceList,//服务导航
    // ...StatsList,//统计视图
    // ...StatsTable,//统计列表
    // ...ListDetail,//列表详情
    // ...MechainList,//统计(机构)
    // ...StatisDetail,//个人统计详情
    // ...StatisRecord,//订单记录
    // ...Course,//课程列表
    // ...Player,//视频播放
    // ...AppRegister,//软件统计
    // ...Scan,//扫码关注

    // {
    //   path: '/progress',
    //   name: 'progress',
    //   component: RegProgress
    // }



    // 本地测试路由地址
    {
      path: '/',
      name: 'App',
      component: App,
      redirect:"/test",
      children:[
        {
          path: '/test',
          name: 'Test1',
          component: Test1,
        },
        {
          path: 't',
          name: 'Test',
          component: Test,
          redirect:'/test2',
          children:[
            ...Register, //注册
            ...userInfo,
            ...Repair,  // 报修
            ...ShareOrder, // 搜索和详情页面
            ...DispatchReport, // 派修
            ...ServiceReport, // 服务
            ...VisitReport, // 回访
            ...verifyReport,  // 审核
            ...Receivable,//收款
            ...Invoice,//开票
            ...DrawInvoice,//申请发票
            ...ServiceList,//服务导航
            ...StatsList,//统计(人员)
            ...StatsTable,//统计列表
            ...MechainList,//统计(机构)
            ...ListDetail,//列表详情
            ...StatisDetail,//个人统计详情
            ...StatisRecord,//订单记录
            ...Course,//课程列表
            ...Player,//视频播放
            ...AppRegister,//软件统计
            ...Scan,//扫码关注
            {
              path: '/test2',
              name: 'Test2',
              component: Test2,
            }
          ]
        }
      ]
    },

  ],
  scrollBehavior(to, from, savedPosition){
    if(savedPosition){
      return savedPosition
    }else{
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

router.beforeEach((to, from, next) => {

  //通过传过来的地址获取sid，并且保存
  if(to.params.sid){
    store.dispatch("getSid", to.params.sid);
    // GetWeUserAccountList(to.params.sid).then(data => {
    //   let userAccount = JSON.stringify(data.data[0])
    //   localStorage.setItem('userAccount',userAccount)
    // });
  }

  next()
})


export default router
