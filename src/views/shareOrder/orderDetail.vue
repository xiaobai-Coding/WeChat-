<template>

  <transition type="transition" mode="out-in" appear  name="fade">
    <div class="order-detail " >
      <!-- 报修详情 -->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.State >= 0 && orderDetail.State != 6">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">报修信息<span style="font-size: 0.9rem;margin-left: 18px;float: right;color: rgb(153, 157, 156);display: inline-block;margin-top: 12px;">({{orderDetail.rptRcd.RecordBy}}于{{orderDetail.rptRcd.RecordDate}}提交)</span></div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <p style="margin-top: 13.3px;margin-bottom: 26.6px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;">报修单号:</span>
          <span style="display: inline-block;color: #2f86f6">{{orderDetail.rptRcd.RptRecordNo}}</span>
        </p>
        <p style="margin-top: 13.3px;margin-bottom: 13.3px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">机构名称:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.rptRcd.OrganName}}</span>
        </p>
        <md-field-item solid title="联系人员" :content="orderDetail.rptRcd.ContactBy" style="border: 0 solid black"/>
        <p style="margin-top: 13.3px;margin-bottom: 26.6px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">联系电话:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)"><a :href="'tel://'+orderDetail.rptRcd.ContactTel" style="text-decoration: underline">{{orderDetail.rptRcd.ContactTel}}</a></span>
        </p>
        <p style="margin: 13.3px 0;">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">报修问题:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.rptRcd.Problem}}</span>
        </p>
        <div class="rpt-detail detail-img">
          <header style="font-size:1rem;display: inline-block;width: 5.3rem;color: rgb(153, 157, 156)">问题图片:</header>
          <span v-if="rptImg.length == 0" style="color: #333;display: inline-block">无</span>
          <ul>
            <li v-for="(item, index) in rptImg" @click="showViewer0(index, $event)" :key="index">
              <img class="img" :src="item" />
            </li>
          </ul>
        </div>
        <md-image-viewer v-model="isViewerShow0" :list="rptImg" :has-dots="true" :initial-index="viewerIndex"></md-image-viewer>
      </md-field>

      <!-- 派修 -->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.State >= 1 && orderDetail.State != 6">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">派修信息<span style="font-size: 0.9rem;margin-left: 18px;float: right;color: rgb(153, 157, 156);display: inline-block;margin-top: 12px;">({{orderDetail.assRcd.RecordBy}}于{{orderDetail.assRcd.RecordDate}}派修)</span></div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <p style="margin-top: 13.3px;margin-bottom: 13.3px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;">派修单号:</span>
          <span style="display: inline-block;color: #2f86f6">{{orderDetail.assRcd.AssRecordNo}}</span>
        </p>
        <p style="margin: 20.3px 0 10.3px;">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">服务人员:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.assRcd.ServicePerson}}</span>
        </p>
        <md-field-item solid title="服务方式:" :content="orderDetail.assRcd.ServiceType" style="border: 0 solid black"/>
        <md-field-item solid title="计划日期:" :content="orderDetail.assRcd.PlanDate" style="border: 0 solid black"/>
        <md-field-item solid title="计划工时:" :content="orderDetail.assRcd.PlanHours" style="border: 0 solid black"/>
        <p style="margin: 13.3px 0;">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">派修备注:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.assRcd.Mark}}</span>
        </p>
      </md-field>

      <!-- 服务 -->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.State >= 2 && orderDetail.State != 6">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">服务及费用明细</div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <p style="margin-top: 13.3px;margin-bottom: 26.6px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;">服务单编号:</span>
          <span style="display: inline-block;color: #2f86f6">{{orderDetail.svcRcd.ServiceNo}}</span>
        </p>
        <p style="margin: 13.3px 0;">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">服务时间:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.svcRcd.StartDate}}至{{orderDetail.svcRcd.EndDate}}</span>
        </p>
        <md-field-item solid title="实际工时:" :content="orderDetail.svcRcd.RealHours+'小时'"  style="border: 0 solid black"/>
        <p style="margin-top: 13.3px;margin-bottom: 26.6px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">问题现象:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.svcRcd.Problem}}</span>
        </p>
        <p style="margin: 13.3px 0;">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">维修情况:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.svcRcd.Condition}}</span>
        </p>
        <md-field-item solid title="配件列表:" content @click="showPopUp" ><span slot="right" style="color: #0bb20c;font-size: 1.2rem;">详情</span></md-field-item>
        <!--费用列表-->
        <ul class="cost-listAll">
          <li><md-field-item solid title="配件费:" :content="totalPartPrice"></md-field-item></li>
          <li><md-field-item solid title="检修费:" :content="orderDetail.svcRcd.CheckPrice + '(元)'" ></md-field-item></li>
          <li><md-field-item solid title="运费:" :content="orderDetail.svcRcd.RunPrice+ '(元)'" ></md-field-item></li>
          <li><md-field-item solid title="交通费:" :content="orderDetail.svcRcd.JtPrice+ '(元)'" ></md-field-item></li>
          <li><md-field-item solid title="住宿费:" :content=" orderDetail.svcRcd.ZsPrice+ '(元)'" ></md-field-item></li>
          <li><md-field-item solid title="其它费:" :content="orderDetail.svcRcd.OtherPrice+ '(元)'" ></md-field-item></li>
        </ul>
        <!-- 总额 -->
        <p style="margin: 13.3px 0;">
          <span style="width: 2.5rem;display: inline-block;color: #999d9c;vertical-align:top;">合计:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem);font-weight: bold">{{totalPrices}}(元)</span>
        </p>
        <!--服务单照片-->
        <div class="detail-img clear">
          <header style="font-size:1rem;color: #999d9c;width: 5.3rem;display: inline-block;" >服务单照片:</header>
          <span v-if="sImg.length == 0" style="display: inline-block;color: #333;">无</span>
          <ul>
            <li v-for="(item, index) in sImg" @click="showViewer(index, $event)" :key="index">
              <img class="img" :src="item" />
            </li>
          </ul>
        </div>

        <!--//设备列表-->
        <md-popup v-model="isPopupShow" position="bottom" v-if="orderDetail.svcPartsList.length>0" >
          <md-popup-title-bar only-close @cancel="hidePopUp('mask')"></md-popup-title-bar>
          <div class="products-popup">
            <svcList :svcListData="orderDetail.svcPartsList" style="border-top:0 "/>
          </div>
        </md-popup>

      </md-field>

      <!--用户意见-->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.State >= 2 && orderDetail.State != 6">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">用户意见</div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <md-field-item solid title="技术水平:" :content="orderDetail.svcRcd.Technical" style="border: 0 solid black"/>
        <md-field-item solid title="服务态度:" :content="orderDetail.svcRcd.Requiements" style="border: 0 solid black"/>
        <p style="margin-top: 13.3px;margin-bottom: 26.6px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">建议要求:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.svcRcd.Attitude}}</span>
        </p>

        <p style="margin: 13.3px 0;">
          <span style="width: 4.13rem;display: inline-block;color: #999d9c;vertical-align:top;text-align: right">签字人:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem);margin-left: 1.2rem">{{orderDetail.svcRcd.SignBy}}</span>
        </p>
        <md-field-item solid title="签字日期:" :content="orderDetail.svcRcd.SignDate" style="font-size:1rem;border: 0 solid black"/>
        <md-image-viewer v-model="isViewerShow" :list="sImg" :has-dots="true" :initial-index="viewerIndex"></md-image-viewer>
      </md-field>

      <!-- 回访 -->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.State >= 3 && orderDetail.State != 6">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">服务回访:</div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <div v-for="(person, index) in orderDetail.persAppraiseList" :key="'persAppraiseList-'+index">
          <md-field-item solid title="回访人员:"  :content="person.Name" style="border: 0 solid black"/>
          <md-field-item solid title="评价等级:" :content="person.VLevel" style="border: 0 solid black"/>
        </div>
        <p style="margin: 13.3px 0;">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">整体评价:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)">{{orderDetail.visitRcd.Comment}}</span>
        </p>
      </md-field>


      <!-- 收款 -->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.rcvRcd.CollectState == '1'">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">收款信息:</div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <md-field-item solid title="付款方名称:"  :content="orderDetail.rcvRcd.OrganName" style="border: 0 solid black"/>
        <p style="margin-top: 13.3px;margin-bottom: 14.6px">
          <span style="width: 5.3rem;display: inline-block;color: #999d9c;vertical-align:top;">付款方电话:</span>
          <span style="display: inline-block;width: calc(100% - 6.28rem)"><a :href="'tel://'+orderDetail.rcvRcd.PayPhone" style="text-decoration: underline">{{orderDetail.rcvRcd.PayPhone}}</a></span>
        </p>
        <md-field-item solid title="付款方地址:"  :content="orderDetail.rcvRcd.PayAddress" style="border: 0 solid black"/>
        <md-field-item solid title="付款方式:"  :content="orderDetail.rcvRcd.CollMethod" style="border: 0 solid black"/>
        <md-field-item solid title="付款日期:"  :content="orderDetail.rcvRcd.CollDate" style="border: 0 solid black"/>
        <md-field-item solid title="收款人:"  :content="orderDetail.rcvRcd.CollectionByName" style="border: 0 solid black"/>
        <md-field-item solid title="实收金额:"  :content="orderDetail.rcvRcd.RealPrice" style="border: 0 solid black">
          <span slot="right">元</span>
        </md-field-item>
        <md-field-item solid title="减免金额:"  :content="orderDetail.rcvRcd.NoPrice" style="border: 0 solid black">
          <span slot="right">元</span>
        </md-field-item>
      </md-field>

      <!--发票信息-->
      <md-field plain style="border: 0.8rem solid #fff;background: #FFFFFF;margin-bottom: 1rem" v-if="orderDetail.rcvRcd.BillState > 0">
        <div style="font-size: 1.1rem;margin:0.2rem 0 0.4rem;">发票信息:</div>
        <div style="border-bottom: 1px solid  #e1e1e1"></div>
        <md-field-item solid title="开户行:" :content="orderDetail.rcvRcd.Bank" style="border: 0 solid black"/>
        <md-field-item solid title="发票编号:" :content="orderDetail.rcvRcd.BillNo" style="border: 0 solid black"/>
        <md-field-item solid title="发票种类:" :content="orderDetail.rcvRcd.BillType" style="border: 0 solid black"/>
        <md-field-item solid title="发票日期:" :content="orderDetail.rcvRcd.BillDate" style="border: 0 solid black"/>
        <md-field-item solid title="开票人:" :content="orderDetail.rcvRcd.BillBy" style="border: 0 solid black"/>
        <md-field-item solid title="开票金额:" :content="orderDetail.rcvRcd.Receivable" style="border: 0 solid black">
          <span slot="right">元</span>
        </md-field-item>
      </md-field>

      <!--间隔-->
      <div style="height: 2rem;width: 100%"></div>
      <!--按钮-->
      <div class="all-btn">
        <ul class="all-btn-position">
          <!--我的报修-->
          <!--<li @click="refuseOrder" v-if="orderDetail.State == 0 && orderStyle =='repair'" style="color: #2f86f6;border-right: 1px solid #e1e1e1;width: 49.6%">撤销</li>&lt;!&ndash;只客户可见，报修之后状态为待派修时才显示 显示状态为客户和待派修&ndash;&gt;-->
          <li @click="deleteOrder" v-if="orderDetail.State == 0 && orderStyle =='repair'" style="width: 100%;text-align: center;color: red">删除</li><!--只客户可见，报修之后状态为待派修时才显示 显示状态为客户和待派修-->
        </ul>

        <ul class="all-btn-position">
          <!--我的派修-->
          <!---->
          <li @click="refuseOrder" v-if="orderDetail.State == 0 && orderStyle =='dispatch'" style="color: #2f86f6;border-right: 1px solid #e1e1e1;width: 49.6%">撤销</li><!--只经理可见，报修之后状态为待派修时才显示 显示状态为经理和待派修-->
          <li @click="dispatchOrder" v-if="orderDetail.State == 0 && orderStyle =='dispatch'" style="color: #1aad19">派修</li><!--只经理可见，报修之后状态为待派修时才显示 显示状态为经理和待派修-->
        </ul>

        <ul class="all-btn-position">
          <!--我的派修-->
          <li @click="editOrder" v-if="orderDetail.State == 1 && orderStyle =='dispatch'" style="width: 100%;text-align: center;color: #2f86f6">编辑</li><!--只经理可见，报修之后状态为待服务时才显示 显示状态为经理和待服务-->
        </ul >

        <ul class="all-btn-position">
          <!--我的服务-->
          <li @click="serviceOrder" v-if="orderDetail.State == 1 && orderStyle =='service'" style="width: 100%;text-align: center;color: #1aad19">服务</li><!--只工程师可见，报修之后状态为待服务时才显示 显示状态为工程师（满足服务人员是自己的条件）和待服务-->
          <li @click="serviceOrder" v-if="orderDetail.State == 2 && orderStyle =='service'" style="width: 100%;text-align: center;color: #2f86f6">编辑</li><!--只工程师可见，报修之后状态为待服务时才显示 显示状态为工程师和待回访-->
        </ul>


        <ul class="all-btn-position">
          <!--回访-->
          <!--     -->
          <li @click="visitOrder" v-if=" orderDetail.State == 2 && orderStyle =='visit' " style="width: 100%;text-align: center;color: #1aad19">回访</li><!--只客服可见，报修之后状态为待回访时才显示 显示状态为客服和待回访-->
          <li @click="visitOrder" v-if="orderDetail.State == 3 && orderStyle =='visit' && accountAll.AssNoPassReason == ''" style="width: 100%;text-align: center;color: #2f86f6">编辑</li><!--只客服可见，报修之后状态为待回访时才显示 显示状态为工程师和待回访-->
        </ul>

        <ul class="all-btn-position">
          <!--审核-->
          <li @click="refuseVerify.open=true" v-if="orderDetail.State == 3 && orderStyle =='verify' && accountAll.AssNoPassReason == ''" style="color: red;border-right: 1px solid #e1e1e1;width: 100%">审核</li><!--只财务可见，报修之后状态为待审核时才显示 显示状态为财务和待审核-->
        </ul>


        <ul class="all-btn-position">
          <!--收款-->
          <li @click="receivables" v-if="orderDetail.State >= 2  && orderStyle =='receivableList'" style="color: green;border-right: 1px solid #e1e1e1;width: 100%">收款</li><!--只财务可见，报修之后状态为待审核时才显示 显示状态为财务和待审核-->
        </ul>


        <ul class="all-btn-position">
          <!--开票-->
          <li @click="drawInvoice" v-if="orderDetail.State == 2 && orderStyle =='detail'" style="color: darkblue;width: 100%">发票</li><!--只财务可见，报修之后状态为待审核时才显示 显示状态为财务和待审核-->
        </ul>


      </div>

      <!--弹框-->
      <md-dialog title="删除" :closable="false" v-model="warnDialog.open" :btns="warnDialog.btns"></md-dialog>
      <md-dialog title="撤销" :closable="true" v-model.trim="refuseDialog.open" :btns="refuseDialog.btns">
        <input class="refuse-input" v-iosbugfixed autofocus type="text" placeholder="请输入退回原因" style="font-size:1rem; width: 100%;padding: 0.5em 0;border:0; border-bottom: 1px solid #eee;
           outline: none;" v-model="refuseInput"/>
      </md-dialog>
      <md-dialog title="审核" :closable="true" v-model.trim="refuseVerify.open" :btns="refuseVerify.btns">
        <input class="refuse-input" v-iosbugfixed autofocus type="text" placeholder="请输入拒绝原因" style="font-size:1rem; width: 100%;padding: 0.5em 0;border:0; border-bottom: 2px solid #eee;
           outline: none;" v-model="refuseVerifyTxt"/>
        <span style="color: red;font-size: 12px;">*审核不通过需要填写原因</span>
      </md-dialog>
    </div>
  </transition>
</template>

<script>
import {
  Dialog,
  TabBar,
  Swiper,
  SwiperItem,
  Field,
  FieldItem,
  Toast,
  Icon,
  ImageViewer,
  Popup,
  PopupTitleBar
} from "mand-mobile";
import {BanAssRecord,Review,BanRptRecord,DeleteRptRecord} from "@/api/dispatchreport";
import svcList from "@/views/shareOrder/svcList";
import rptProduct from "@/views/shareOrder/rptProduct";
import { GetRptRecordDetailApi } from "@/api/shareorderapi";
import repairReportDetail from "@/components/detailPage/repairReportDetail";
import dispatvhReportDetail from "@/components/detailPage/dispatvhReportDetail";
import serviceReportDetail from "@/components/detailPage/serviceReportDetail";
import {GetWeUserAccountList} from "@/api/userInfo"//获取当前登录的用户名称与机构
export default {
  data() {
    return {
      isLoading: true,
      userRight:0,//用户权限（5系统管理员 7检测机构 10经理 11客服  12工程师）
      current: 0,
      htmlHight:'',//可视高度
      items: [
        { name: 0, label: "报修信息" },
        { name: 1, label: "派修信息" },
        { name: 2, label: "服务信息" }
      ],
      rptRecordId: this.$store.getters.recordId,
      SettlementId:'',//服务单号
      isViewerShow0: false,
      isViewerShow: false,
      url: this.$store.getters.url,
      viewerIndex: 0,
      isPopupShow: false,//设备展示列表
      headers: this.$store.getters.sid,
      orderDetail: {},
      repImgs: [],
      serviceImgs: [],
      accountAll:{},//用户信息与所有服务编号
      orderStyle:'',//菜单名称，
      warnDialog: {//删除
        open: false,
        btns: [
          {
            text: "取消"
          },
          {
            text: "确定",
            warning: true,
            handler: this.onBasicConfirm
          }
        ]
      },
      refuseDialog: {//撤销
        open: false,
        btns: [
          { text: "取消", handler: this.onRefuseCancle },
          { text: "确定", warning: true, handler: this.onRefuseConfirm }
        ]
      },
      refuseVerify: {//点击审核拒绝的弹框
        open: false,
        btns: [
          { text: "不通过", warning: true, handler: this.onRefuseOrder },
          { text: "通过",  handler: this.onConfirmOrder }
        ]
      },
      refuseVerifyTxt: "",//拒绝原因
      refuseInput:'',//撤销原因
    };
  },
  components: {
    [Dialog.name]: Dialog,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [ImageViewer.name]: ImageViewer,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    repairReportDetail,
    dispatvhReportDetail,
    serviceReportDetail,
    [TabBar.name]: TabBar,
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    svcList,
    rptProduct
  },
  created () {
     this.$loading.show()
  },
  mounted() {
    this.htmlHight = window.screen.height + 'px'
    GetWeUserAccountList(this.$store.getters.sid).then(data => {
      this.userRight = data.data[0].RoleList[0].roleid;//用户权限
    });
    // this.userRight = JSON.parse(localStorage.getItem('userAccount')).RoleList[0].roleid;//用户权限
    this.getDetail();//根据报修单号详细信息
    this.accountAll = this.$store.getters.accountAll;//vuex用户信息与所有服务编号
    this.orderStyle = this.$store.getters.getOrderStyle;//菜单名称
  },
  filters: {
    stateTxt(val) {
      if (val == 0) {
        return (val = "等待派修");
      } else if (val == 1) {
        return (val = "等待服务");
      } else if (val == 2) {
        return (val = "等待回访");
      } else if (val == 3) {
        return (val = "等待审核");
      } else if (val == 4) {
        return (val = "审核完成");
      } else {
        return (val = "");
      }
    }
  },
  computed: {
    rptImg() {
      let imgs = [];
      for (var i = 0; i < this.repImgs.length; i++) {
        let img =
          this.url +
          "/userfile/problemImg/" +
          this.rptRecordId +
          "/" +
          // "/thumbnail/"
          this.repImgs[i].name;

        imgs.push(img);
      }
      return imgs;
    },
    sImg() {
      //this.rptRecordId
      let imgs1 = [];
      for (var i = 0; i < this.serviceImgs.length; i++) {
        let img =
          this.url +
          "/userfile/serviceImg/" +
          +this.SettlementId+
          "/" +
          // this.rptRecordId +
          // "/thumbnail/" +
          this.serviceImgs[i].name;
        imgs1.push(img);
      }
      return imgs1;
    },
    total() {
      return "0";
    },
    totalPartPrice() {
      let totalPrice = 0;
      for (let val in this.orderDetail.svcPartsList) {
        totalPrice += parseFloat(this.orderDetail.svcPartsList[val].PartsPrice);
      }
      return totalPrice + "(元)";
    },
    totalPrices() {
      return parseFloat(this.orderDetail.svcRcd.Receivable) + "";
    }
  },
  methods: {
    delay(){
            setTimeout(() => {
                this.isLoading = false;
            }, 300);
        },
    /**
     * 收款
     **/
    receivables(){
      this.$store.dispatch("getRptId", this.accountAll.RptRecordId);
      this.$store.dispatch("setSettlementId", this.accountAll.SettlementId);
      this.$store.dispatch("saveAssRecordId", this.accountAll.AssRecordId);
      this.$router.push({name:"receivables"});
    },
    /**
     * 发票
     * */
    drawInvoice(){
      this.$store.dispatch("getRptId", this.accountAll.RptRecordId);
      this.$store.dispatch("setSettlementId", this.accountAll.SettlementId);
      this.$store.dispatch("saveAssRecordId", this.accountAll.AssRecordId);
      this.$router.push({name:"drawInvoice"});
    },
    //获取到订单的详细信息
    getDetail() {
      let self = this;
      GetRptRecordDetailApi({ rptRecordId: this.rptRecordId },this.$store.getters.sid).then(res => {
        Toast.loading("加载中...");
        console.log(res)
        if (res.data.success == 1) {
          if(res.data.result.svcRcd.SettlementId != 0){
            this.SettlementId = res.data.result.svcRcd.SettlementId
          }
          setTimeout(() => {
            Toast.hide();
            res.data.result.assRcd.PlanHours += '（小时）';
            self.orderDetail = res.data.result;
            console.log(self.orderDetail)
            // 获取用户图片
            // repImgs为第一张图片
            // serviceImgs为第二张图片
            if (res.data.result.rptRcd.ProblemImg.length) {
              self.repImgs = JSON.parse(res.data.result.rptRcd.ProblemImg);
            }
            if (res.data.result.svcRcd.ServicePhotos.length) {
              self.serviceImgs = JSON.parse(
                res.data.result.svcRcd.ServicePhotos
              );
            }
             this.$loading.hide()
          }, 0);
        } else {
          //提示错误信息
          alert(res.data.result);
        }
      }).catch(err => {
          alert("加载失败，请检查您的网络");
      });
    },

    showViewer(index) {
      this.viewerIndex = index;
      this.isViewerShow = true;
    },

    /**
     * 点击设备详情详情
     **/
    showPopUp() {
      if (this.orderDetail.svcPartsList.length > 0) {
        this.isPopupShow = true;
      } else {
        alert("暂无配件信息！");
      }
    },

    /**
     *设备列表关闭按钮
     * @param type
     */
    hidePopUp(type) {
      this.isPopupShow = false;
    },

    showViewer0(index) {
      this.viewerIndex = index;
      this.isViewerShow0 = true;
    },

    // 报修的删除
    deleteOrder(){
      this.warnDialog.open = true;
    },

    // 删除函数
    onBasicConfirm() {
      let self = this;
      DeleteRptRecord({ rptRecordId: this.accountAll.RptRecordId }, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            alert("删除成功！");
            self.warnDialog.open = false;
            this.$router.push({
              'name':'report',
              params:{
                actOder:'刷新'
              }
            })
          } else {
            alert(res.data.result);
          }
        })
        .catch(err => {
          alert("连接失败，请检查您的网络！");
        });
    },

    // 撤销
    refuseOrder(){
      this.refuseDialog.open = true;
    },

    //撤销取消
    onRefuseCancle() {
      this.refuseInput = "";
      this.refuseDialog.open = false;
    },

    //撤销函数
    onRefuseConfirm() {
      let self = this;
      if (this.refuseInput.length != 0) {
        BanRptRecord({rptRecordId: this.accountAll.RptRecordId, NoPassReason: this.refuseInput}, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            alert("撤销成功！");
            self.refuseDialog.open = false;
            self.refuseInput = "";
            this.$router.push({name:'dispatch',params:{ actOder:'刷新'}})

          } else {
            alert(res.data.result);
          }
        })
          .catch(err => {
            alert("连接失败，请检查您的网络！");
          });
      } else {
        alert("打回原因不能为空！");
      }
    },

    // 派修
    dispatchOrder(){
      this.$router.push({
        name: "dispatchOrder",
        params:{
          RecordBy:this.orderDetail.rptRcd.RecordBy
        }
      });
      this.$store.dispatch("getRecordId", this.accountAll.RptRecordId);//报修号
    },

    // 派修编辑
    editOrder() {
      this.$router.push({
        name: "editDispatchOrder",
        params:{
          RecordBy:this.orderDetail.rptRcd.RecordBy
        }
      });
      this.$store.dispatch("saveAssRecordId", this.accountAll.AssRecordId);
    },

    // 服务与编辑
    serviceOrder(){
      this.$store.dispatch("getRptId", this.accountAll.RptRecordId);
      this.$store.dispatch("saveAssRecordId", this.accountAll.AssRecordId);
      this.$store.dispatch("setSettlementId", this.accountAll.SettlementId);
      this.$router.push({ name: "serviceOrder"});
    },

    //回访与编辑
    visitOrder(){
      this.$store.dispatch("saveAssRecordId", this.accountAll.AssRecordId);
      this.$store.dispatch("setSettlementId", this.accountAll.SettlementId);
      this.$store.dispatch("getRptId", this.accountAll.RptRecordId);
      this.$router.push({ name: "visitOrder" });
    },

    // 审核
    // verifyRefuseOrder(){
    //   this.refuseVerify.open = true;
    // },
    //审核拒绝确定函数
    onRefuseOrder() {
      this.$store.dispatch("saveAssRecordId", this.accountAll.AssRecordId);
      let id = this.$store.getters.getAssRecordId;
      if (this.refuseVerifyTxt) {
        // 发送拒绝请求
        BanAssRecord({assRecordId: id, NoPassReason: this.refuseVerifyTxt}, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            this.refuseVerify.open = false;
             Dialog.alert({
                content:'操作成功',
                onConfirm:()=>{
                  this.$router.push({name:'verify',params:{ actOder:'刷新'}})
                }
                })
          }
        });
      } else {
        alert("拒绝原因不能为空！");
      }
    },

    //点击通过的请求
    onConfirmOrder() {
      this.$store.dispatch("getRecordId", this.accountAll.RptRecordId);
      let self = this;
      Review({ rptRecordId: this.$store.getters.recordId }, this.$store.getters.sid).then(res => {
        if (res.data.success == 1) {
          // alert("操作成功");
          this.refuseVerify.open = false;
            Dialog.alert({
                content:'操作成功',
                onConfirm:()=>{
                  this.$router.push({name:'verify',params:{ actOder:'刷新'}})
                }
                })
        } else {
            alert(JSON.stringify(res.data.result));
          }
      }).catch(err => {
        if (err) {
          alert("网络异常， 请检查您的网络！");
        }
      });
    },
  }
};
</script>

<style lang="scss">
  .all-btn{
    width: calc(100%);
    height: 4rem;
    position: absolute;
    bottom: 0;
    z-index: 999;
    margin-left: -20px;
    margin-bottom: -20px;
  }
  .all-btn li{
    width: 50%;
    height: 3.5rem;
    float: left;
    background: #fff;
    text-align: center;
    line-height: 3.5rem;
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: #1aad19;
    border-top: 1px solid #e1e1e1;
  }
  /*.all-btn-position{*/
    /*position: absolute;*/
    /*bottom: 0;*/
  /*}*/
  .cost-listAll .md-field-item-title{
    width: 3.3rem!important;
    text-align: right!important;
  }
  .cost-listAll{
    height: 8.8rem;
  }
  .cost-listAll li{
    width: 50%;
    float: left;
  }
.order-detail {
  overflow: auto;
  background: $bg-color;
  padding: 0.625rem;
  height: 100%;
  .md-popup-box{
    height: 70%!important;
    overflow-y: scroll;
  }
  header {
    .order-state {
      font-size: $ft-size1;
      padding: 1rem;
      background: $bg-color;
    }
  }
  .md-field-item-title {
    font-size: $ft-size1;
  }
  .md-field-item-control {
    font-size: $ft-size1;
    color: #666;
  }
  .detail-img {
    width: 100%;
    height: 100%;
    header {
      font-size: $ft-size1;
      padding-top: 0.8rem;
      padding-bottom: 0.4rem;
    }
    ul {
      width: 100%;
      font-size: 0;
      li {
        position: relative;
        display: inline-block;
        width: 22%;
        padding-bottom: 22%;
        margin-right: 2%;
        margin-top: 2%;
        box-sizing: border-box;
        border-radius: 2px;
        overflow: hidden;
        list-style: none;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        &::after {
          content: "";
          display: table;
          clear: both;
        }
      }
    }
  }
  .md-popup-box {
    height: 80%;
    overflow-y: scroll;
    /*overflow: hidden;*/
    left: 0;
    right: 0;
    bottom: 0;
    .products-popup {
      /*height: 100%;*/
      overflow-y: scroll;
      position: relative;
      background: #fff;
    }
  }
}

</style>
