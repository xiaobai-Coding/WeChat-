<!--派修列表-->
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
      <order-list
        :orders="orders"
        orderStyle="dispatch"
        :pageIndex="pageIndex"
        @loadMoreData="loadMoreData1"
        :IsFinish="IsFinish"
        @dropDownData="dropDownData1"
      ></order-list>
    </div>
  </transition>
</template>


<script>
import { Toast } from "mand-mobile";
import Time from "../../../static/script/getDate";
import OrderList from "@/components/orderList/orderList.vue";
import OrderHeader from "@/components/orderList/orderHeader.vue";
import OrderFilter from "@/components/orderList/orderFilter";
import { GetAssRecordList } from "@/api/dispatchreport";
// // 使用vuex 中的数据
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      current: "2",
      items: [
        [
          { value: -99, text: "全部" },
          { value: 0, text: "待派修" },
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
      isFilter: false,
      startDate: Time.start,
      endDate: Time.end,
      datePickerValue: "",
      isShow: false,
      value: "全部",
      state: 0, //报修单状态（待派修0、待服务1、待回访2、待审核3、已完成4、无效订单6）
      pageIndex: 0,
      customerId: -99,
      url: "",
      headers: "",
      orders: [],
      savereCording: [], //保存上次的数据
      IsFinish: false, //是否为最后一页数据
      renovate: false, //是否开启刷新
      searchStr: "" //查询的内容
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.name == "dispatch" && from.name == "serviceList") {
      next(vm => {
        vm.renovate = true;
      });
    } else {
      next(vm => {
        vm.renovate = false;
      });
    }
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
        self.queryData();
      }
    }, 500);
  },
  created () {
    //  this.$loading.show()
  },
  mounted() {
    this.queryData();
  },

  computed: {
    ...mapState({
      print: state => state.print.seachStar
    }),
    //通过条件筛选数据
    getData() {
      let data = {
        pageIndex: this.pageIndex, //点击的第几个
        startDate: this.startDate, //开始日期
        endDate: this.endDate, //结束日期
        state: this.state, //报修单状态
        customerId: this.customerId, //筛选条件
        searchStr: this.searchStr, //查询内容
        renovate: false //是否开启刷新
      };
      return data;
    }
  },
  methods: {
    // 刷新需要初始化的值
    renovateData() {
      this.state = 0; //带派修
      this.orders = [];
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
    },
    //页面数据初始化
    htmlInt() {
      this.orders = [];
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
      this.queryData();
    },
    queryData() {
      this.$loading.show()
      let self = this;
      GetAssRecordList(this.getData, this.$store.getters.sid)
        .then(res => {
          console.log(res);
          if (res.data.success == 1) {
            if (res.data.result.length < 15) {
              this.IsFinish = true;
            }
            if (
              JSON.stringify(res.data.result) != JSON.stringify(self.orders)
            ) {
              self.orders = self.orders.concat(res.data.result);
              console.log(self.orders);
              self.savereCording = self.orders;
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
    getDataValue(data) {
      if (data) {
        this.endDate = data.endDate;
        this.startDate = data.startDate;
        this.state = data.state;
        this.IsFinish = false; //设置为可刷新状态
        this.pageIndex = 0; //页面初始化
        this.orders = []; //搜索数据清空
        setTimeout(() => {
          this.queryData();
        }, 500);
      }
    },
    // 搜索的数据子向父传值
    getSearchData(data) {
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
      this.orders = []; //搜索数据清空
      this.searchStr = data.searchStr;
      console.log(data);
      setTimeout(() => {
        this.queryData();
      }, 500);
    },
    //父组件传的页码数加载更新函数
    loadMoreData1(num) {
      this.pageIndex = num;
      this.queryData();
      console.log(2);
    },
    //父组件传的页码数下拉刷新函数
    dropDownData1(num) {
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = num;
      this.orders = []; //搜索数据清空
      this.queryData();
    },

    // 取消搜索
    closeSerchData() {
      this.orders = this.savereCording;
      this.IsFinish = false;
    }
  },
  components: {
    [Toast.name]: Toast,
    OrderList,
    OrderHeader,
    OrderFilter
  }
};
</script>

<style lang="scss" scoped>
.time-compare {
  font-size: 0.8rem;
  color: red;
}
</style>
