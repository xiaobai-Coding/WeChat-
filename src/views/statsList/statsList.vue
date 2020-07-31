<template>
  <div
    class="statsList"
    id="searchBar"
  >
    <!--返回-->
    <span
      @click="backBtn"
      class="back-btn"
    >
      <md-icon
        name="arrow-left"
        size="lg"
        style="margin: 0 10px;"
      /></span>
    <header>
      <nav style="font-size: 1.5rem">
        <span @click="StartPopupShow = true">{{StartData}}
          <md-icon
            name="arrow-down"
            size="md"
          /></span>
        -
        <span @click="EndPopupShow = true">{{EndData}}
          <md-icon
            name="arrow-down"
            size="md"
          /></span>
        <i
          class="iconfont icon-xuanxiang"
          style="font-size: 1.5rem;float: right;margin-right: 1rem;margin-top: 0.5rem"
          @click="conditionBtn"
        ></i>
      </nav>
    </header>
    <section>
      <div class="user-name">
        <ul>
          <li style="height: 2.5rem;line-height: 2.5rem;font-size: 1rem;color: #666f83;font-weight: bold">工程师</li>
          <li
            v-for="(item,index) in userData"
            :key="index"
            @click="detailBtn(item)"
          >{{item.name}}</li>
          <li class="total-money">合计:</li>
        </ul>
      </div>
      <div class="user-data">
        <table>
          <thead style="">
            <tr>
              <th style="width: 6rem">接单(单)</th>
              <th style="width: 6rem">交单(单)</th>
              <th style="width: 8rem">工时(小时)</th>
              <th style="width: 10rem;text-align: right">应收金额(元)</th>
              <th style="width: 10rem;text-align: right">减免金额(元)</th>
              <th style="width: 10rem;text-align: right">实收金额(元)</th>
              <th style="width: 19rem">客户评价</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item1,index1) in userData"
              :key="index1"
            >
              <td
                @click="detailBtn(item1)"
                style="text-decoration:underline"
              >{{item1.orderTake}}</td>
              <td :style="{color:item1.color}">{{item1.handOver}}</td>
              <td>{{item1.totalHours}}</td>
              <td style="text-align: right">{{item1.receivable}}</td>
              <td style="text-align: center">{{item1.deratePrice}}</td>
              <td style="text-align: center">{{item1.realPrice}}</td>
              <td id="box">
                <span
                  class="box1"
                  style="color: red"
                  v-if="item1.AppraiseA==''"
                >A：0%；</span>
                <span
                  class="box1"
                  style="color: red"
                  v-if="item1.AppraiseA!=''"
                >A：{{item1.AppraiseA}}%；</span>
                <span
                  class="box2b"
                  style="color: #c5c535"
                  v-if="item1.AppraiseB==''"
                >B：0%；</span>
                <span
                  class="box2b"
                  style="color: #c5c535"
                  v-if="item1.AppraiseB!=''"
                >B：{{item1.AppraiseB}}%；</span>
                <span
                  class="box3c"
                  style="color: #7f7f7f"
                  v-if="item1.AppraiseC == '' "
                >C：0%</span>
                <span
                  class="box3c"
                  style="color: #7f7f7f"
                  v-if="item1.AppraiseC != '' "
                >C：{{item1.AppraiseC}}%</span>
                <!-- <span style="color: #7f7f7f" v-if="item1.AppraiseC == '' ? 0% : item1.AppraiseC "></span> -->
              </td>
            </tr>
            <tr class="total-money">
              <td>{{costData.orderTake}}</td>
              <td>{{costData.handOver}}</td>
              <td>{{costData.totalHours}}</td>
              <td style="text-align: right">{{costData.receivable}}</td>
              <td style="text-align: right">{{costData.deratePrice}}</td>
              <td style="text-align: right">{{costData.realPrice}}</td>
              <td style="text-align: right"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!--开始时间弹框-->
    <md-date-picker
      ref="start"
      v-model="StartPopupShow"
      type="custom"
      title="请选择开始时间"
      :custom-types="['yyyy', 'MM','dd']"
      :default-date="StartCurrentDate"
      @confirm="StartDatePicker"
    ></md-date-picker>
    <!--结束时间弹框-->
    <md-date-picker
      ref="end"
      v-model="EndPopupShow"
      type="custom"
      title="请选择结束时间"
      :custom-types="['yyyy', 'MM','dd']"
      :default-date="EndCurrentDate"
      @confirm="EndDatePicker"
    ></md-date-picker>
    <!--条件弹框-->
    <md-popup
      v-model="isPopupShow"
      position="top"
    >
      <div style="height: 3rem;width: 100%;background: #fff;z-index: 9999">
        <ul>
          <li
            style="width: 25%;float: left;font-size: 1.2rem;text-align: center;line-height: 48px;background-color:green;color: white;"
            @click="dateChange('one')"
          >当月</li>
          <li
            style="width: 25%;float: left;font-size: 1.2rem;text-align: center;line-height: 48px;background: #eee"
            @click="dateChange('two')"
          >近一月</li>
          <li
            style="width: 25%;float: left;font-size: 1.2rem;text-align: center;line-height: 48px;background: #858b9c;color: white;"
            @click="dateChange('three')"
          >近半年</li>
          <li
            style="width: 25%;float: left;font-size: 1.2rem;text-align: center;line-height: 48px;background: #2f86f6;color: white;"
            @click="dateChange('four')"
          >近一年</li>
        </ul>
      </div>
    </md-popup>
  </div>
</template>

<script>
  import { Chart,Icon,Popup,DatePicker,PopupTitleBar,Toast} from 'mand-mobile'
  import {dateFormat} from "../../../static/script/dateFormat";
  import {GetServiceStatistics} from '../../api/statistic';
    export default {
      name: "statsList",
      components:{
        [Chart.name]:Chart,
        [Icon.name]:Icon,
        [Popup.name]:Popup,
        [DatePicker.name]:DatePicker,
        [PopupTitleBar.name]:PopupTitleBar,
        [Toast.name]:Toast,
      },
      data(){
        return{
          isPopupShow:false,//条件弹框
          StartPopupShow:false,//开始日期选择器
          EndPopupShow:false,//结束日期选择器
          htmlWidth:'',
          htmlHeight:'',
          StartCurrentDate: new Date((new Date().getTime() - 15724800000)),//开始日期
          EndCurrentDate:new Date(),//结束日期
          StartData:dateFormat(new Date((new Date().getTime() - 15724800000))),//显示开始日期
          EndData:dateFormat(new Date()),//显示结束日期
          userData:[],//列表数据
          costData:{},//合计
        }
      },
      created () {
         this.$loading.show()
      },

      /**
       * StartDatePicker  开始日期选择
       * EndDatePicker    结束日期选择
       * backBtn  返回上层路由
       * conditionBtn 条件按钮
       * dateChange  条件选择
       * detailBtn   详情列表
       * dataInitial 初始化
       */
      methods: {
        dataInitial(){
          this.isPopupShow=false;//条件弹框
          this.StartPopupShow=false;//开始日期选择器
          this.EndPopupShow=false;//结束日期选择器
          this.StartCurrentDate=new Date((new Date().getTime() - 15724800000));//开始日期
          this.EndCurrentDate=new Date();//结束日期
          this.StartData=dateFormat(new Date((new Date().getTime() - 15724800000)));//显示开始日期
          this.EndData=dateFormat(new Date());//显示结束日期
        },
        detailBtn(item){
          console.log(item)
          let objDemo = {};
          objDemo['StartData'] = this.StartData;
          objDemo['EndData'] = this.EndData;
          objDemo['id'] = item.personalId;
          objDemo['type'] = '服务人员';
          objDemo['name'] = item.name;
          this.$store.dispatch('saveAgencyId',objDemo)
          this.$router.push({name:'listDetail'})
        },
        getData(){
           this.$loading.show()
          Toast.loading('数据获取中...');
          let arryDemo = [];
          let orderTakeDotal = 0;//接单数总和
          let handOverDotal = 0;//交单数总和
          let totalHoursDotal = 0;//工时总和
          let receivableDotal = 0;//应收金额总和
          let deratePriceDotal = 0;//减免金额总和
          let realPriceDotal = 0;//实收金额总和
          GetServiceStatistics({"startDate":this.StartData,"endDate":this.EndData}).then(res=>{
            if(res.data.success == 1){
              console.log(res)
              res.data.result.forEach((item,index)=>{
                if(item.orderTake - item.handOver > 3){
                  item['color'] = 'red'
                }else{
                  item['color'] = 'black'
                }
                if(item.orderTake != 0){
                  arryDemo.push(item)
                  orderTakeDotal += parseInt(item.orderTake);
                  handOverDotal += parseInt(item.handOver);
                  totalHoursDotal += parseInt(item.totalHours);
                  receivableDotal += parseFloat(item.receivable);
                  deratePriceDotal += parseFloat(item.deratePrice);
                  realPriceDotal += parseFloat(item.realPrice);
                }
              });
              this.userData = arryDemo;
              this.costData["orderTake"] = orderTakeDotal;
              this.costData["handOver"] = handOverDotal;
              this.costData["totalHours"] = totalHoursDotal + '小时';
              this.costData["receivable"] = receivableDotal.toFixed(2) + '元';
              this.costData["deratePrice"] = deratePriceDotal.toFixed(2) + '元';
              this.costData["realPrice"] = realPriceDotal.toFixed(2) + '元';

              Toast.hide()
            }else{
              alert(res.data.result)
            }
            setTimeout(() => {
               this.$loading.hide()
            }, 0);
          })
        },
        dateChange(data){
          this.isPopupShow = false;
          if(data == 'one'){
            //近月数据
            this.StartCurrentDate = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01')
            this.StartData = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10? '0' +(new Date().getMonth() + 1):(new Date().getMonth() + 1)) + '-01'
          }else if(data == 'two'){
            //一月数据
            this.StartCurrentDate = new Date((new Date().getTime() - 2592000000))
            this.StartData = dateFormat(new Date((new Date().getTime() - 2592000000)))
          }else if(data == 'three'){
            //半年数据
            this.StartCurrentDate = new Date((new Date().getTime() - 15724800000))
            this.StartData = dateFormat(new Date((new Date().getTime() - 15724800000)))
          }else if(data == 'four'){
            //一年数据
            this.StartCurrentDate = new Date((new Date().getTime() - 31536000000))
            this.StartData = dateFormat(new Date((new Date().getTime() - 31536000000)))
          }
          this.EndCurrentDate = new Date();
          this.EndData = dateFormat(new Date());
          this.getData();
        },
        conditionBtn(){
          this.isPopupShow = true;
        },
        backBtn(){
          this.$router.push({'name':'serviceList'})
        },
        handleScroll(e){
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

        },
        StartDatePicker(columnsValue){
          this.StartData = columnsValue[0].value + "-" + columnsValue[1].value + "-" + columnsValue[2].value;
          this.getData()
        },
        EndDatePicker(columnsValue){
          this.EndData = columnsValue[0].value + "-" + columnsValue[1].value + "-" + columnsValue[2].value;
          this.getData()
        }
      },
      mounted() {
        this.getData();//请求列表数据
        window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        this.htmlWidth =  window.screen.width + 'px'
        this.htmlHeight = window.screen.height + 'px'
      },
      beforeRouteEnter(to,from,next){
        if(from.name == 'serviceList'){
          next(vm=>{
            vm.dataInitial();//初始化
            vm.getData();//请求列表数据
          })
        }
        next()
      }

    }
</script>

<style scoped >
.statsList {
  background: #fff;
  overflow: visible;
}
.back-btn {
  float: left;
  margin-top: 1rem;
}
header {
  width: 100%;
  height: 3.5rem;
  border-bottom: 0.5rem solid #eee;
}
nav span {
  display: inline-block;
  height: 2rem;
  width: 7.2rem;
  border: 1px solid #e1e1e1;
  border-radius: 30px;
  text-align: center;
  line-height: 2rem;
  font-size: 1rem;
  margin-top: 0.7rem;
  margin-left: 0.5rem;
  vertical-align: center;
}
section {
  width: 100%;
  overflow: hidden;
}
.user-name {
  width: 5.5rem;
  float: left;
}
.user-name ul li {
  height: 3rem;
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
  line-height: 3rem;
}
.user-data {
  width: calc(100% - 5.5rem);
  overflow-x: auto;
  float: left;
}
table {
  width: 2100px;
  border-collapse: collapse;
}
section thead {
  position: relative;
  top: 700px;
  background: #fff;
  width: 2100px;
}
section thead tr {
  border-bottom: 1px solid #e5e5e5 !important;
  height: 2.5rem;
  color: #666f83;
}
section thead th {
  position: -webkit-sticky;
}
section tbody td {
  border-bottom: 1px solid #e5e5e5 !important;
  height: 3rem;
  text-align: center;
}
.total-money {
  font-size: 1rem;
  font-weight: bold;
}

#box {
  /* display: flex;
  flex-wrap: wrap;
  justify-content:space-evenly; */
  display: flex;
  padding-right: 0.5rem;
}
#box span {
  flex: auto;
  /* width: 33.33%; */
  line-height: 3.5rem;
}
.box2b{

}
.box3c{
  /* padding-right: 1rem; */
}
</style>
