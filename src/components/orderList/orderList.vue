<template>
  <div class="order-box" :style="{height:listHeight}">
    <md-scroll-view
      bouncing
      ref="scrollView"
      :auto-reflow="true"
      :scrolling-x="false"
      :pageIndex="pageNum"
      @end-reached="onEndReached"
      @refreshing="$_onRefresh"
    >
      <!-- 下拉刷新列表 -->
      <md-scroll-view-refresh
        slot="refresh"
        slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
        :scroll-top="scrollTop"
        :is-refreshing="isRefreshing"
        :is-refresh-active="isRefreshActive"
      ></md-scroll-view-refresh>
      <!--卡片-->
      <div class="order-list" style="border: 1px solid" :style="{borderColor:getColor(item)}" v-for="(item, index) in orders" :key="index" :class="item.State >= 2 && item.RealPrice == '0'?'card-border':''">
        <div :style="{background:getColor(item)}" style="width: 60px;height: 60px;border-radius: 50%;background: #0bb20c;position: absolute;bottom: 60px;right: 20px;transform: rotate(-45deg);text-align: center;line-height: 60px;color: #f7f7f7;opacity: 0.5">{{getStateTitle(item)}}</div>
        <div class="order-header">
          <!--报检机构-->
          <div class="order-content-header">{{item.OrganName}}</div>
          <md-icon name="info" style="font-size: 1.3rem;margin-right: 12px;width: 2rem;text-align: center" @click="halfYearBtn(item)"></md-icon>
          <!--状态信息-->
          <div class="order-state">
            <md-icon name="warn" color="red" v-show="item.State == 5"></md-icon>
            {{item | stateShow}}
          </div>
        </div>
        <!--分割线-->
        <div class="Divi-line"></div>
        <div class="order-content" @click="jumpToOrderDetail(item.RptRecordId,index,item)">
          <ul class="order-content-info">
            <li>
              <div class="title" :class="getsize">报修编号：</div>
              <div class="cont">{{item.RptRecordNo}}</div>
            </li>
            <li>
              <div class="title" :class="getsize">报修日期：</div>
              <div class="cont">{{item.RecordDate}}</div>
            </li>
            <li>
              <div class="title" :class="getsize">联系信息：</div>
              <div class="cont">{{item.ContactBy}} {{item.ContactTel}}</div>
            </li>
            <li class="order-problem">
              <div class="title" style="min-width:5rem;">报修问题：</div>
              <div class="cont">{{item.Problem}}</div>
            </li>
            <li class="order-problem" v-show="item.ServicePersonName != ''">
              <div class="title" style="min-width:5rem;">服务人员：</div>
              <div class="cont">{{item.ServicePersonName}}</div>
            </li>
            <li v-show="item.State == 3 && item.AssNoPassReason != '' ">
              <div class="title">拒绝原因：</div>
              <div class="cont">{{item.AssNoPassReason}}</div>
            </li>
            <li v-show="item.State == 6 && item.RptNoPassReason != ''">
              <div class="title">撤销原因：</div>
              <div class="cont">{{item.RptNoPassReason}}</div>
            </li>
          </ul>
        </div>
        <div style="width:100%;height:2px;background:#fafafa;"></div>
      </div>


      <!-- 加载更多数据 -->
      <md-scroll-view-more slot="more" :is-finished="IsFinish"></md-scroll-view-more>
    </md-scroll-view>
  </div>
</template>
<script>
import {
  Dialog,
  Toast,
  Icon,
  ScrollView,
  ScrollViewRefresh,
  ScrollViewMore
} from "mand-mobile";
import {
  BanAssRecord,
  CancelAssFix,
  DeleteRptRecord,
  BanRptRecord,
  Review
} from "@/api/dispatchreport";
import OrderFilter from "@/components/orderList/orderFilter";
import OrderHeader from "@/components/orderList/orderHeader";
import verifyList from "@/views/verifyReport/verifyList"; //父组件
import {dateFormat} from "../../../static/script/dateFormat";
export default {
  components: {
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
    [ScrollViewRefresh.name]: ScrollViewRefresh,
    OrderFilter,
    OrderHeader,
    verifyList
  },
  name: "OrderList",
  props: ["orders", "orderStyle", "IsFinish","pageIndex"],
  inject: ["reload"],
  data() {
    return {
      url: "",
      headers: {},
      num: 5,
      index: "",
      id: "",
      pageNum: 0,
      refuseInput: "",
      refuseVerifyTxt: "",
      FontSize: 1,
      oder:'',
      // top:true,
      listHeight: document.body.clientHeight / 16 - 7.2 + "rem"
    };
  },
  beforeMount() {
    this.url = this.$store.getters.url;
    this.headers = this.$store.getters.sid;
    console.log(this.orders)
  },
  filters: {
    stateShow(val) {
      if (val.State == 0) {
        return (val = "待派修");
      } else if (val.State == 1) {
        return (val = "待服务");
      } else if (val.State == 2) {
        return (val = "待回访");
      } else if (val.State == 3 && val.AssNoPassReason == "") {
        return (val = "待审核");
      } else if (val.State == 4) {
        return (val = "已完成");
      } else if (val.State == 5) {
        return (val = "未通过");
      } else if (val.State == 6) {
        return (val = "无效订单");
      } else if (val.State == 3 && val.AssNoPassReason != "") {
        return (val = "审核拒绝");
      }
    }
  },
  computed: {
    getsize() {
      return "s-" + sessionStorage.getItem("num");
    },
    getColor(state){
      return function (state) {
        let color = '#fff';
        if(state.CollectState == 0 && this.orderStyle == "receivableList"){
          color = "red";
        }else if(state.CollectState == 1 && this.orderStyle == "receivableList") {
          color = "green";
        }
        return  color;
      }
    },
    getStateTitle(state){
      console.log(state)
      return function (state) {
        let title = '';
        if(state.CollectState == 0 && this.orderStyle == "receivableList"){
          title = "未收款";
        }else if(state.CollectState == 1 && this.orderStyle == "receivableList") {
          title = "已收款";
        }
        return  title;
      }
    }
  },
  created () {

},
  mounted(){

  },
  methods: {
    //半年数据
    halfYearBtn(item){
      let objDemo = {};
      objDemo['StartData'] = dateFormat(new Date((new Date().getTime() - 15724800000)));
      objDemo['EndData'] = dateFormat(new Date());
      objDemo['id'] = item.CustomerId;
      objDemo['type'] = '检测站';
      objDemo['name'] = item.organName;
      this.$store.dispatch('saveAgencyId',objDemo)
      this.$router.push({name:'listDetail'})
    },
    //跳转进入订单详情
    jumpToOrderDetail(id,index,item) {
      if(item.State == 6){
        alert('订单失效：'+item.RptNoPassReason);
      }else {
        console.log(this.orderStyle)
        this.$router.push({name: "detail",});
        this.$store.dispatch('saveOrderStyle',this.orderStyle);
        this.$store.dispatch("getRecordId", id);//报修编号
        this.$store.dispatch('saveAccountAll',this.orders[index])
      }
    },

    // 加载数据
    onEndReached() {
      if(this.pageIndex == 0){
        this.pageNum = 0
      }
      if(this.IsFinish){
        this.pageNum = -1
        this.$refs.scrollView.finishLoadMore();
      }else{
        console.log(this.pageNum)
        Toast.loading('加载中...')
        setTimeout(() => {
          this.pageNum++;
        this.$emit("loadMoreData", this.pageNum);
        this.$refs.scrollView.finishLoadMore();
        Toast.hide()
      }, 2000);
      }
    },
    // 下拉刷新
    $_onRefresh() {
      // async data
      setTimeout(() => {
        this.$emit("dropDownData", 0);
        this.pageNum = 0;
        this.$refs.scrollView.finishRefresh();
      }, 1000);
    },
    refresh(done) {
      this.$emit("showHeader", true);
      this.top = true;
      done();
    },
  }
};
</script>
<style lang="scss" scoped>

.Divi-line{
  width: 96%;
  border-bottom: 1px solid #e1e1e1;
  margin-top: 15px;
  margin-left: 2%;
}
.title {
  width: 6rem;
  color: #999d9c;
}
.cont {
  font-size: $ft-size12;
  font-weight: bold;
  width: calc(100% - 6rem);
}
.order-box {
  background: $bg-color;
  .card-border{
    border: 1px solid red!important;
  }
  .order-list {
    margin-left: 0.625rem;
    margin-right: 0.625rem;
    box-sizing: border-box;
    box-shadow: 0 5px 12px #e3e3e3;
    background: #fff;
    margin-top: 1rem;
    margin-bottom: 0.2rem;
    position: relative;
    .order-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 0.6rem 0;
      height: 60px;
      .order-content-header {
        padding: 0.3rem 0.5rem;
        font-weight: bold;
        font-size: $ft-size12;
        width: calc(100% - 6.5rem);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .order-state {
        background: #1aad19;
        width: 4.5rem;
        text-align: center;
        border-radius: 8px;
        color: #fff;
        font-size: $ft-size1;
      }
    }
    .order-content {
      font-size: $ft-size12;
      margin-top: 10px;
      .order-content-info {
        padding-bottom: 0.7rem;
        li {
          padding: 0 1rem;
          margin-bottom: 0.1rem;
          display: flex;
          justify-content: start;
          div.cont {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
          }
        }
      }
    }
    .operate-btns {
      padding: 0.7rem 0;
      font-size: $ft-size12;
      color: $color;
      .btn-group {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row-reverse;
        .btn-ml {
          font-size: $ft-size12;
        }
      }
    }
    input.refuse-input {
      padding: 1em 0;
      border-bottom: 1px solid #eee;
      outline: none;
    }
  }
}
</style>
