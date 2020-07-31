<!--发票列表-->
<template>
  <transition
    type="transition"
    mode="out-in"
    appear
    name="fade"
  >
    <div class="repairList">
      <order-header
        :pages="pages"
        @change="onChange"
        @searchData="getSearchData"
        @closeBtn="closeSerchData"
      ></order-header>
      <order-filter
        :items="items"
        :FirstState="state"
        @postData="getDataValue"
        :isFilter="isFilter"
      ></order-filter>
      <!-- <order-list
        :orders="orders"
        orderStyle="service"
        :pageIndex="pageIndex"
        @loadMoreData="loadMoreData1"
        @dropDownData="dropDownData1"
        :IsFinish="IsFinish"
      ></order-list> -->
      <div
        class="order-list"
        v-for="(item, index) in DataList"
        :key="index"
        :style="{borderColor:item.AssState == 2? 'green':'red'}"
      >
        <!-- <tag
          size="small"
          shape="square"
          font-color="green"
          type="ghost"
          style="position: absolute;right: 10px;top: 14px;"
          v-if="item.AssState == 2"
        >待回访</tag> -->
         <!-- <tag
          size="small"
          shape="square"
          font-color="green"
          type="ghost"
          style="position: absolute;right: 10px;top: 14px;"
          v-if="item.AssState == 1"
        >待服务</tag> -->
        <!-- <tag
          size="small"
          shape="square"
          font-color="red"
          type="ghost"
          style="position: absolute;right: 10px;top: 14px;"
          v-if="item.AssState != 2 "
        >待审核</tag> -->
          <!-- 状态信息 -->
         <div class="order-state">
            <md-icon name="warn" color="red" v-show="item.State == 5"></md-icon>
            {{item | stateShow}}
          </div>
        <div class="order-header">
          <!--报检机构-->
          <div class="order-content-header">{{item.OrganName}}</div>
        </div>
        <!--分割线-->
        <div class="Divi-line"></div>
        <div
          class="order-content"
          @click="jumpToOrderDetail(item.RptRecordId,index,item)"
        >
          <div class="box">
            <div v-if="item.BillState == 0" >未开票</div>
            <div  v-show="item.BillState == 1" style="background:red">已开票</div>
            <div  v-if="item.BillState == 2" style="background:#3296FA">已申请</div>
          </div>
          <ul class="order-content-info">
            <li>
              <div
                class="title"
                :class="getsize"
              >报修编号：</div>
              <div class="cont">{{item.RptRecordNo}}</div>
            </li>
            <li>
              <div
                class="title"
                :class="getsize"
              >报修日期：</div>
              <div class="cont">{{item.RecordDate}}</div>
            </li>
            <li>
              <div
                class="title"
                :class="getsize"
              >联系信息：</div>
              <div class="cont">{{item.ContactBy}} {{item.ContactTel}}</div>
            </li>
          </ul>
        </div>
        <div style="width:100%;height:2px;background:#fafafa;"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Icon, Toast, Button, InputItem, Field, Tag } from "mand-mobile";
// import { Icon, Toast } from "mand-mobile";
import Time from "../../../static/script/getDate";
import OrderList from "@/components/orderList/orderList";
import OrderHeader from "@/components/orderList/orderHeader";
import OrderFilter from "@/components/orderList/orderFilter";
// import { GetServiceRecordList } from "@/api/servicereport"; //获取服务列表
import { SysUserInfoByUserId } from "@/api/userInfo"; //获取当前登录的用户名称
import { GetBackVisitRecordList } from "@/api/visitreport"; //待回访列表

// import { GetAssRecordList } from "@/api/dispatchreport";

export default {
  name: "invoiceList",
  components: {
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    OrderList,
    OrderHeader,
    OrderFilter,
    Tag
    // [Icon.name]: Icon,
    // [Toast.name]: Toast,
    // [Button.name]: Button,
    // [InputItem.name]: InputItem,
    // [Field.name]: Field,
  },
  data() {
    return {
      current: "2",
      items: [
        [
          { value: -99, text: "全部" },
          { value: 2, text: "待回访" },
          { value: 3, text: "待审核" },
          { value: 4, text: "已完成" }
        ]
      ],
      pages: [
        { name: 1, label: "筛选", url: "filter" },
        { name: 2, label: "查询", url: "search" }
      ],
      isFilter: false, //筛选弹框
      startDate: Time.start, //开始日期
      endDate: Time.end, //结束日期
      state: 2, //待回访
      pageIndex: 0, //搜索的页数
      url: "", //点击hander事件的名称
      customerId: -99, //初始值
      loginUserName: "", //登录账户的用户名称
      orders: [], //传给子的数据
      savereCording: [], //保存上次的数据
      IsFinish: false, //是否为最后一页数据
      renovate: false, //是否开启刷新
      searchStr: "", // 用户输入的内容
      // 查询出来的数据列表
      DataList: [],
      renovate: false, //是否开启刷新
      getTrueName: JSON.parse(localStorage.getItem("userAccount"))[0].TrueName,
      getOrgName: JSON.parse(localStorage.getItem("userAccount"))[0].OrgName,
      code: "",
      SettId:[],
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.name == "service" && from.name == "serviceList") {
      next(vm => {
        vm.renovate = true;
      });
    } else {
      next(vm => {
        vm.renovate = false;
      });
    }
    // to.meta.keepAlive = true
    if (to.params.actOder == "刷新") {
      next(vm => {
        vm.htmlInt();
      });
    }
    next();
  },
  activated() {
    let self = this;
    setTimeout(function() {
      if (self.renovate) {
        self.renovateData(); //页面数据初始化
        // 获取开始日期
        self.defaultStartDate = new Date(
          new Date().setMonth(new Date().getMonth() - 3)
        );
        //获取登录用户的姓名
        SysUserInfoByUserId().then(data => {
          self.loginUserName = data.data[0].SysUser.TrueName;
          self.isData();
        });
      }
    }, 500);
  },

  mounted() {
    // 获取开始日期
    this.defaultStartDate = new Date(
      new Date().setMonth(new Date().getMonth() - 3)
    );
    //获取登录用户的姓名
    SysUserInfoByUserId().then(data => {
      this.loginUserName = data.data[0].SysUser.TrueName;
      this.isData();
    });
    this.renovate = false;

    console.log(this.$router.getters.SettlementId)
    console.log(123)
  console.log(this.$route.params.id)

  },
  created () {
  console.log(this.$route.params.id)
  // this.SettId=this.$route.params.id
  this.SettId.push(this.$route.params.id)
  console.log(this.SettId)
  //  this.$loading.show()

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
    //查询数据
    getData() {
      let data = {
        pageIndex: this.pageIndex,
        startDate: this.startDate,
        endDate: this.endDate,
        state: this.state,
        customerId: this.customerId, //只显示服务列表
        searchStr: this.searchStr,
        // isShowHeader: true,
        renovate: false //是否开启刷新
      };
      return data;
    },
    getsize() {
      return "s-" + sessionStorage.getItem("num");
    }
  },
  methods: {
    // 跳转进入订单详情
    jumpToOrderDetail(id,index,item) {
      if(item.State == 6){
        alert('订单失效：'+item.RptNoPassReason);
      }else {
        // console.log(this.orderStyle)
        this.$router.push({name: "invoiceDetail",params:{setSettlementId:id}});
        this.$store.dispatch('saveOrderStyle',this.orderStyle);
        this.$store.dispatch("getRecordId", id);//报修编号
        this.$store.dispatch('saveAccountAll',this.orders[index]);
        this.$store.dispatch('setRecordId',id)
      }
    },

    // ------------------------------------------

    // jumpToOrderDetail(id) {
    //   console.log(id);
    //   this.$store.commit("setSettlementId", id);
    //   this.$router.push({ name: "invoiceDetail" });
    //   console.log(456);
    // },

    // 刷新需要初始化的值
   renovateData() {
      this.state = 2; //待回访
      this.orders = [];
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
    },
    //页面数据初始化
    htmlInt() {
      this.orders = [];
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
      this.isData();
    },
    //搜索框加载全部数据
    isData() {
    this.$loading.show()
      let self = this;
      GetBackVisitRecordList(this.getData, this.$store.getters.sid)
        .then(res => {
          if (res.data.success == 1) {

            // 判断是否为最后一页数据
            console.log(res);
            const newArr=[];
            res.data.result.forEach(function(item,index){
                // console.log(item.State)
                if(item.State!=1){
                    return newArr.push(item)
                }
            })
            console.log(newArr)
            //  console.log(this.$route.params.id)
             this.DataList = newArr;
            // console.log(this.DataList);
            if (res.data.result.length < 15) {
              this.IsFinish = true;
            }
            //分页数据叠加
            if (
              JSON.stringify(res.data.result) != JSON.stringify(self.orders)
            ) {
              res.data.result.forEach(element => {
                element.ServicePersonName.split("，").forEach(item => {
                  if (item == this.loginUserName) {
                    self.orders = self.orders.concat(element);
                    if (self.orders.length == 0) {
                      alert("数据加载完成");
                    }
                    self.savereCording = self.orders;
                  }
                });
              });
            }

          } else {
            alert(data.data.result);
          }
        // console.log(this.$router.getters.SettlementId)
            setTimeout(() => {
               this.$loading.hide()
            }, 0);
        })
        .catch(err => {
          alert("获取失败，请检查您的网络！");
        });
    },
    onChange(item) {
      if (item.url == "add" || item.url == "useradd") {
        this.$router.push({ name: item.url });
      } else if (item.url == "search") {
      } else {
        if (this.isFilter) {
          this.isFilter = false;
        } else {
          this.isFilter = true;
        }
      }
    },
    //父组件传的页码数加载更新函数

    loadMoreData1(num) {
      // 出错
      this.pageIndex = num;
      this.isData();
    },
    //父组件传的页码数下拉刷新函数
    dropDownData1(num) {
      this.pageIndex = num;
      this.orders = []; //搜索数据清空
      this.IsFinish = false;
      this.isData();
    },
    // 搜索的数据子向父传值
    getSearchData(num) {
      console.log;
      this.orders = [];
      // num.forEach((item,index)=>{
      //   item.ServicePersonName.split("，").forEach((item1,index1)=>{
      //     if(item1 == this.loginUserName){
      //       this.orders.push(item)
      //     }
      //   })
      // })
      // // this.IsFinish = true;
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
      this.orders = []; //搜索数据清空
      this.searchStr = num.searchStr;
      console.log(num);
      setTimeout(() => {
        this.isData();
      }, 500);
    },
    // 取消搜索
    closeSerchData() {
      this.orders = this.savereCording;
      this.IsFinish = false;
    },
    //搜索子组件传的数据
    getDataValue(data) {
      if (data) {
        this.endDate = data.endDate;
        this.startDate = data.startDate;
        this.state = data.state;
        this.IsFinish = false; //设置为可刷新状态
        this.pageIndex = 0; //页面初始化
        this.orders = []; //搜索数据清空
        setTimeout(() => {
          this.isData();
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.time-compare {
  font-size: 0.8rem;
  color: red;
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
  border: 1px solid;
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
      width: calc(100% - 4rem);
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
.box{
  div{
    width: 130px;
    height: 130px;
    font-size:1rem;
    border-radius: 50%;
    background: #0bb20c;
    position: absolute;
    bottom: 60px;
    right: 50px;
    transform: rotate(-45deg);
    text-align: center;
    line-height: 130px;
    color: #f7f7f7;opacity: 0.5
  }
}
 .order-state {
        float:right;
        margin: 10px 10px 0 0 ;
        background: #1aad19;
        width: 4.5rem;
        text-align: center;
        border-radius: 8px;
        color: #fff;
        font-size: $ft-size1;
      }
</style>
