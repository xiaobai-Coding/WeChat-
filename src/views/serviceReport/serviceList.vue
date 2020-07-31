<!--服务列表-->
<template>
  <transition
    type="transition"
    mode="out-in"
    appear
    name="fade"
  >
    <div class="repairList" v-cloak>
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
      <order-list
        :orders="orders"
        orderStyle="service"
        :pageIndex="pageIndex"
        @loadMoreData="loadMoreData1"
        @dropDownData="dropDownData1"
        :IsFinish="IsFinish"
      ></order-list>
    </div>
  </transition>
</template>
<script>
import { Icon, Toast } from "mand-mobile";
import Time from "../../../static/script/getDate";
import OrderList from "@/components/orderList/orderList";
import OrderHeader from "@/components/orderList/orderHeader";
import OrderFilter from "@/components/orderList/orderFilter";
import { GetServiceRecordList } from "@/api/servicereport"; //获取服务列表
import { SysUserInfoByUserId } from "@/api/userInfo"; //获取当前登录的用户名称
// import { GetAssRecordList } from "@/api/dispatchreport";

export default {
  data() {
    return {
      current: "2",
      items: [
        [
          { value: -99, text: "全部" },
          { value: 1, text: "待服务" },
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
      state: 1, //待服务
      pageIndex: 0, //搜索的页数
      url: "", //点击hander事件的名称
      customerId: -99, //初始值
      loginUserName: "", //登录账户的用户名称
      orders: [], //传给子的数据
      savereCording: [], //保存上次的数据
      IsFinish: false, //是否为最后一页数据
      renovate: false, //是否开启刷新
      searchStr: "" // 用户输入的内容
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
  created () {
    //  this.$loading.show()
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
    }
  },
  methods: {
    // 刷新需要初始化的值
    renovateData() {
      this.state = 1; //待服务
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
    GetServiceRecordList(this.getData, this.$store.getters.sid)
        .then(res => {
          console.log(res)
          if (res.data.success == 1) {
            // 判断是否为最后一页数据
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
      console.log
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
  },
  components: {
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    OrderList,
    OrderHeader,
    OrderFilter,
  }
};
</script>

<style lang="scss" scoped>
.time-compare {
  font-size: 0.8rem;
  color: red;
}
 [v-cloak] {

    display: none !important;

    }
</style>
