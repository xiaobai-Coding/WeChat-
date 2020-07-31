<!--报修列表-->
<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="repairList">
      <order-header :pages="pages" @change="onChange" @searchData="getSearchData" @closeBtn="closeSerchData"></order-header>
      <order-filter :items="items" :FirstState="state" @postData="getDataValue" :isFilter="isFilter"></order-filter>
      <order-list
        :orders="orders"
        orderStyle="repair"
        :pageIndex="pageIndex"
        @loadMoreData="loadMoreData1"
        :IsFinish="IsFinish"
        @dropDownData="dropDownData1"
      ></order-list>
    </div>
  </transition>
</template>

<script>
import {
  InputItem,
  Field,
  TabBar,
  Icon,
  DatePicker,
  FieldItem,
  Picker,
  NoticeBar,
  Toast
} from "mand-mobile";
import Time from "../../../static/script/getDate";
import OrderList from "@/components/orderList/orderList";
import OrderHeader from "@/components/orderList/orderHeader";
import OrderFilter from "@/components/orderList/orderFilter";
import {
  GetRptRecordList,
  GetRptRecordListByRecordUser
} from "@/api/repairreport";
import { SysUserInfoByUserId } from "@/api/userInfo";
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
        { name: 2, label: "查询", url: "search" },
        { name: 3, label: "新增", url: "add" },
      ],
      isFilter: false,
      startDate: Time.start,
      endDate: Time.end,
      isShow: false,
      state: 0,
      pageIndex: 0,
      url: "",
      headers: "",
      orders: [],
      savereCording:[],//保存上次的数据
      IsFinish: false ,//是否为最后一页数据
      userName: '',//用户姓名
      isStaff:true,//是否为服务人员
      OrganizId:'',//机构名名称
      renovate: false,//是否开启刷新
    };
  },
  activated(){
    let self = this;
    setTimeout(function () {
      if(self.renovate){
        self.renovateData();//页面数据初始化
        self.OrganizId = JSON.parse(localStorage.getItem('userAccount'))[0].OrgName;//保存机构名称
        SysUserInfoByUserId().then(data => {
          console.log(data)
          self.userName = data.data[0].SysUser.TrueName;//保存用户姓名
          self.$store.state.RoleId = data.data[0].SysUser.UserRoleList[0].RoleId;
          if (data.data[0].SysUser.UserRoleList[0].RoleId == 7) {
            self.pages[2].url = "useradd";
            self.isStaff = false;
            self.isData();
          } else {
            self.pages[2].url = "add";
            self.isStaff = true;
            self.GetRptRecordListsByRecordUser();
          }
        });
      }
    },500)
  },
  beforeRouteEnter(to,from,next){
    // to.meta.keepAlive = true
    if(to.name == 'report' && from.name == 'serviceList'){
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
  created () {
    //  this.$loading.show()
  },
  mounted() {
    this.OrganizId = JSON.parse(localStorage.getItem('userAccount'))[0].OrgName;//保存机构名称
    SysUserInfoByUserId().then(data => {
      this.userName = data.data[0].SysUser.TrueName;//保存用户姓名
      this.$store.state.RoleId = data.data[0].SysUser.UserRoleList[0].RoleId;
      if (data.data[0].SysUser.UserRoleList[0].RoleId == 7) {
        this.pages[2].url = "useradd";
        this.isStaff = false;
        this.isData();
      } else {
        this.isStaff = true;
        this.GetRptRecordListsByRecordUser();
      }
    });
  },

  computed: {
    //组织报修的数据
    getData() {
      let data = {
        pageIndex: this.pageIndex,
        startDate: this.startDate,
        endDate: this.endDate,
        state: this.state,
        searchStr: "",
        customerId: this.customerId //只显示报修项目
      };
      return data;
    }
  },
  methods: {
    // 刷新需要初始化的值
    renovateData(){
      this.state = 0;//带派修
      this.orders = [];
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
    },
    //页面数据初始化
    htmlInt(){
      this.orders = [];
      this.IsFinish = false; //设置为可刷新状态
      this.pageIndex = 0; //页面初始化
      if(this.isStaff){
        this.GetRptRecordListsByRecordUser();
      }else {
        this.isData();
      }
    },
    // 根据检测机构与用户姓名加载报修列表
    isData() {
      let self = this;
      //  this.$loading.show()
      GetRptRecordList(this.getData, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            if (res.data.result.length < 15) {
              this.IsFinish = true;
            }
            if(JSON.stringify(res.data.result) != JSON.stringify(self.orders)){
              res.data.result.forEach((item,index)=>{
                if(item.RecordBy == this.userName){
                  self.orders = self.orders.concat(item);
                  self.savereCording = self.orders;
                }
              })
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
    // 根据报检人姓名加载数据
    GetRptRecordListsByRecordUser() {

      let self = this;
      GetRptRecordListByRecordUser(this.getData, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            if (res.data.result.length < 15) {
              this.IsFinish = true;
            }
            if(JSON.stringify(res.data.result) != JSON.stringify(self.orders)){

              self.orders = self.orders.concat(res.data.result);
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
      if (item.url == "add" || item.url == 'useradd') {
        this.$router.push({name:item.url});
      } else if(item.url == "search"){

      }else{
        if (this.isFilter) {
          this.isFilter = false;
        } else {
          this.isFilter = true;
        }
      }
    },
    // 搜索框获得的时间
    getDataValue(data) {
      if (data) {
        this.endDate = data.endDate;
        this.startDate = data.startDate;
        this.state = data.state;
        this.IsFinish = false; //设置为可刷新状态
        this.pageIndex = 0; //页面初始化
        this.orders = []; //搜索数据清空
        if (this.$store.state.RoleId == 7) {
          this.isData();
        } else {
          this.GetRptRecordListsByRecordUser();
        }
      }
    },
    // 加载更多数据
    loadMoreData1(num) {
      this.pageIndex = num;
      if (this.$store.state.RoleId == 7) {
        this.isData();
      } else {
        this.GetRptRecordListsByRecordUser();
      }
    },
    //父组件传的页码数下拉刷新函数
    dropDownData1(num) {
      this.pageIndex = num;
      this.orders = []; //搜索数据清空
      if (this.$store.state.RoleId == 7) {
        this.isData();
      } else {
        this.GetRptRecordListsByRecordUser();
      }
    },
    // 搜索的数据子向父传值
    getSearchData(num){
      this.orders = [];
      if(this.isStaff){
        num.forEach((item,index)=>{
          if(item.RecordBy == this.userName){
            this.orders.push(item)
          }
        })
      }else{
        num.forEach((item,index)=>{
          if(item.RecordBy == this.userName && item.OrganName == this.OrganizId){
            this.orders.push(item)
          }
        })
      }
      if(this.orders.length == 0){
        alert('暂无数据')
      }
      this.IsFinish = true;
    },
    // 取消搜索
    closeSerchData(){
      this.orders = this.savereCording
      this.IsFinish = false;
    }
  },
  components: {
    [TabBar.name]: TabBar,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [DatePicker.name]: DatePicker,
    [FieldItem.name]: FieldItem,
    [Picker.name]: Picker,
    [NoticeBar.name]: NoticeBar,
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
