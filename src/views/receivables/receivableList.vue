<!--付款列表-->
<template>
  <div class="receivableList">
    <transition type="transition" mode="out-in" appear name="fade">
      <div class="repairList">
        <order-header :pages="pages" @change="onChange" @searchData="getSearchData" @closeBtn="closeSerchData"></order-header>
        <order-filter :items="items" :FirstState="state" @postData="getDataValue" :isFilter="isFilter"></order-filter>
        <order-list
          :orders="orders"
          orderStyle="receivableList"
          :pageIndex="pageIndex"
          :IsFinish="IsFinish"
          @loadMoreData="loadMoreData1"
          @dropDownData="dropDownData1"
        ></order-list>
      </div>
    </transition>
  </div>
</template>

<script>
  import {
    Icon,
    Toast
  } from "mand-mobile";
  import Time from "../../../static/script/getDate";
  import OrderList from "../../components/orderList/orderList";
  import OrderHeader from "@/components/orderList/orderHeader";
  import OrderFilter from "@/components/orderList/orderFilter";
  import { GetBackVisitRecordList } from "@/api/visitreport";
  export default {
    name:'receivableList',
    components: {
      [Icon.name]: Icon,
      [Toast.name]: Toast,
      OrderHeader,
      OrderFilter,
      OrderList,
    },
    data() {
      return {
        current: "2",
        items: [
          [ { value: -99, text: "全部" },
            { value: 2, text: "待回访" },
            { value: 3, text: "待审核" },
            { value: 4, text: "已完成" }
          ]
        ],
        pages: [
          { name: 1, label: "筛选", url: "filter" },
          { name: 2, label: "查询", url: "search" },

        ],
        isFilter: false,
        startDate: Time.start,
        endDate: Time.end,
        isShow: false,
        state: 2,
        pageIndex: 0,
        customerId: -99,
        url: this.$store.getters.url,
        headers: this.$store.getters.sid,
        orders: [],
        savereCording:[],//保存上次的数据
        IsFinish: false, //是否为最后一页数据
        renovate: false,//是否开启刷新
        searchStr:'' // 用户输入的内容
      };
    },
    beforeRouteEnter(to,from,next){
      if(to.name == 'verify' && from.name == 'serviceList'){
        next(vm=>{
          vm.renovate = true;
        })
      }else {
        next(vm=>{
          vm.renovate = false;
        })
      }
      if(to.params.actOder == '刷新'){
        next(vm=>{
          vm.htmlInt()
        })
      }
      next()
    },
    activated(){
      let self = this;
      setTimeout(function () {
        if(self.renovate){
          self.renovateData();//页面数据初始化
          self.isData();
        }
      },500)
    },
    created () {
      //  this.$loading.show()
    },
    mounted() {
      this.isData();
      // window.ScrollViewTrigger1 = () => {
      //   this.$refs.scrollView.triggerRefresh();
      // };
    },
    computed: {
      getData() {
        let data = {
          pageIndex: this.pageIndex,
          startDate: this.startDate,
          endDate: this.endDate,
          state: this.state,
          customerId: this.customerId, //只显示审核列表
          searchStr: this.searchStr
        };
        return data;
      }
    },
    watch: {},
    methods: {
      // 刷新需要初始化的值
      renovateData(){
        this.state = 3;//待审核
        this.orders = [];
        this.IsFinish = false; //设置为可刷新状态
        this.pageIndex = 0; //页面初始化
      },
      //页面数据初始化
      htmlInt(){
        this.orders = [];
        this.IsFinish = false; //设置为可刷新状态
        this.pageIndex = 0; //页面初始化
        this.isData()
      },
      isData:async function () {
         this.$loading.show()
        let self = this;
        await GetBackVisitRecordList(this.getData, this.$store.getters.sid).then(res => {
          console.log(res)
          if (res.data.success == 1) {
            if (res.data.result.length < 15) {
              this.IsFinish = true;
            }
            if(JSON.stringify(res.data.result) != JSON.stringify(self.orders)){
              self.orders = self.orders.concat(res.data.result);
              console.log(self.orders)
              // self.savereCording = self.orders;
            }
          } else {
            alert(data.data.result);
          }
          setTimeout(() => {
             this.$loading.hide()
          }, 0);
        }).catch(err => {
          alert("获取失败，请检查您的网络！");
        });
      },
      //父组件传的页码数加载更新函数
      loadMoreData1(num) {
        this.pageIndex = num;
        this.isData();
      },
      //父组件传的页码数下拉刷新函数
      dropDownData1(num) {
        this.pageIndex = num;
        this.orders = []; //搜索数据清空
        this.isData();
      },
      onChange(item) {
        if (item.url == "add" || item.url == "useradd") {
          this.$router.push({name:item.url});
        } else {
          if (item.url == "filter") {
            if (this.isFilter) {
              this.isFilter = false;
            } else {
              this.isFilter = true;
            }
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
            this.isData()
          }, 500);
        }
      },
      // 搜索的数据子向父传值
      getSearchData(num){
        this.IsFinish=false;
        this.pageIndex=0;
        this.orders=[];
        this.searchStr=num.searchStr;
       setTimeout(() => {
         this.isData()
       }, 500);
      },
      // 取消搜索
      closeSerchData(){
        this.orders = this.savereCording
        this.IsFinish = false;
      }
    }

  };
</script>

<style lang="scss" scoped>
  .time-compare {
    font-size: 0.8rem;
    color: red;
  }
</style>
