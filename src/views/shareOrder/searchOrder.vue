<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="search">
      <md-field>
        <md-input-item ref="input11" placeholder="请输入报修单号" @change="getInputValue">
          <md-icon name="search" slot="right"></md-icon>
        </md-input-item>
      </md-field>
      <order-list :orders="orders"></order-list>
    </div>
  </transition>
</template>

<script>
import { InputItem, Field, Icon, Toast } from "mand-mobile";
import OrderList from "@/components/orderList/orderList.vue";
// import {GetRptRecordListByRptNoApi} from '@/api/shareorderapi'
import { GetAssRecordList } from "@/api/dispatchreport";

export default {
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Icon.name]: Icon,
    OrderList
  },
  data() {
    return {
      url: "",
      headers: {},
      orders: []
      // {
      //   ShortName: "蓝天大鹏", //客户简称
      //   Problem: "机器坏了", //报修问题
      //   RecordDate: "2018-01-01 15:03:01",
      //   RptRecordNo: "B20150101003", //报修单编号
      //   SignBy: "李强", //签字人
      //   State: "0", //报修单状态（待派修0、待服务1、待回访2、待审核3、已完成4、无效订单6）
      //   ServiceNo: "20150105", //服务单号
      //   RptRecordId: "12", //记录人Id
      //   ContactBy: "大鹏", // 联系人
      //   ContactTel: "13112341234" //联系电话
      // }
    };
  },
  mounted() {
    // this.url =
    //   this.$store.getters.url + "/AfterSaleRpt/GetRptRecordListByRptNo";
    // this.headers = this.$store.getters.sid;
    this.axios.get("yuming",res=>{

    })
  },
  methods: {
    getInputValue(name, value) {
      console.log(123)
      let self = this;
      GetRptRecordListByRptNoApi({ rptNo: value },this.$store.getters.sid)
      .then(res => {
          if (res.data.success == 1) {
            if (res.data.result.length == 0) {
              alert("暂无数据！");
            } else {
              Toast.loading("加载中");
              setTimeout(() => {
                self.orders = res.data.result;
                Toast.hide();
              }, 1000);
            }
          } else {
            alert(data.data.result);
          }
        })
        .catch(err => {
          alert("加载失败，请检查您的网络");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  box-sizing: border-box;
  fieldset {
    box-sizing: border-box;
    margin: 0;
  }
}
</style>
