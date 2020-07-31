<template>
    <div class="statsTable">
      <!--返回-->
      <nav>
        <span @click="backBtn">
          <md-icon name="arrow-left" size="lg" style="font-size: 1.4rem;color: #333;" ></md-icon>
          <p style="font-size:1rem;display: inline-block;height: 1.4rem;line-height: 1.4rem;vertical-align: top;margin-left: 10px">统计</p>
        </span>
        <p style="font-size: 1rem;float: right;margin-right: 20px;color: #0bb20c;" @click="ddjlBtn" >详情</p>
        <!--日期选择-->
        <div  class="TimeCheck" @click="TimeCheckBtn">
          <span>{{DateYear}}</span>
          <md-icon name="arrow-down" size="lg"></md-icon>
        </div>
      </nav>



      <!--数据-->
      <div id="main" style="height:300px;background: #eee;border-bottom: 1px solid #e5e5e5" :style="{width:htmlWidth}">
      </div>

      <!--检测机构列表-->
      <md-field v-if="title">
        <md-cell-item title="报修单数">
          <span class="holder" slot="left" style="background: #c23531"></span>
          <span class="title" slot="right" >{{unitDataSet.orderNum}}</span>
        </md-cell-item>
        <md-cell-item title="未付款订单数">
        <span class="holder" slot="left" style="background: #61a0a8"></span>
        <span class="title" slot="right" >{{unitDataSet.unpaidNum}}</span>
        </md-cell-item>
        <md-cell-item title="未付款总额">
          <span class="holder" slot="left" style="background: #2f4554"></span>
          <span class="title" slot="right" >{{unitDataSet.realPrice}}</span>
        </md-cell-item>
        <md-cell-item title="已付款总额">
          <span class="holder" slot="left" style="background: #91c7ae"></span>
          <span class="title" slot="right" >{{unitDataSet.receivable}}</span>
        </md-cell-item>

        <md-cell-item title="减免金额(元)">
          <span class="holder" slot="left" style="background: #d48265"></span>
          <span class="title" slot="right" >{{unitDataSet.deratePrice}}</span>
        </md-cell-item>
      </md-field>

      <!--用户显示列表-->
      <md-field v-if="!title">
        <md-cell-item title="接单数">
          <span class="holder" slot="left" style="background: #c23531"></span>
          <span class="title" slot="right" >{{serviceDataSet.orderTake}}</span>
        </md-cell-item>
        <md-cell-item title="交单数" >
          <span class="holder" slot="left" style="background: #91c7ae"></span>
          <span class="title" slot="right" >{{serviceDataSet.handOver}}</span>
        </md-cell-item>
        <md-cell-item title="工时(小时)">
          <span class="holder" slot="left" style="background: #2f4554"></span>
          <span class="title" slot="right" >{{serviceDataSet.totalHours}}</span>
        </md-cell-item>
        <md-cell-item title="应收金额(元)">
          <span class="holder" slot="left" style="background: green"></span>
          <span class="title" slot="right" >{{serviceDataSet.receivable}}</span>
        </md-cell-item>
        <md-cell-item title="减免金额(元)">
          <span class="holder" slot="left" style="background: #61a0a8"></span>
          <span class="title" slot="right" >{{serviceDataSet.deratePrice}}</span>
        </md-cell-item>
        <md-cell-item title="实收金额(元)">
          <span class="holder" slot="left" style="background: orange"></span>
          <span class="title" slot="right" >{{serviceDataSet.realPrice}}</span>
        </md-cell-item>
      </md-field>


      <!--日期弹框-->
      <md-date-picker
        ref="datePicker"
        v-model="isDatePickerShow"
        type="custom"
        title="选择年份"
        :default-date="currentDate"
        :custom-types="['yyyy']"
        @confirm="onDatePickerConfirm"
        :max-date="maxDate"
      ></md-date-picker>
    </div>
</template>

<script>
  import { CellItem,Field,Button,Icon,DatePicker,Toast   } from 'mand-mobile'
  import {GetOrganStatistics,GetServiceStatistics} from '../../api/statistic';
  import {dateFormat} from "../../../static/script/dateFormat";
    export default {
        name: "statsTable",
      data(){
        return{
          totalOrder:0,//统计的总单数
          startDate:new Date().getFullYear() + '-01-01'  ,//开始日期
          endDate:dateFormat(new Date()),//结束日期
          htmlWidth:'',
          htmlHeight:'',
          myChart:'',
          unitOption:{},//机构图表
          serviceOption:{},//服务图表
          title:false,
          userCategory:'售后',
          unitDataSet:{},//渲染数据集合(机构)
          serviceDataSet:{},//渲染数据集合(个人)
          pjCost:0,//配件费
          wxCost:0,//维修费
          qtCost:0,//其他
          isDatePickerShow:false,
          currentDate:new Date(),
          DateYear:new Date().getFullYear() + '年',//筛选的初始日期
          maxDate:new Date(),
        }
      },
      components:{
        [CellItem.name]:CellItem,
        [Field.name]:Field,
        [Button.name]:Button,
        [Icon.name]:Icon,
        [DatePicker.name]:DatePicker,
        [Toast.name]:Toast,
      },

      mounted() {
        this.identityJudgment();//身份判定
        this.htmlWidth =  window.screen.width + 'px';
        this.htmlHeight = window.screen.height + 'px';

      },
      /**
       * ddjlBtn   订单详情
       * backBtn  返回
       * getOrganData   根据机构加载数据
       * getServiceData  根据服务加载数据
       * getUserData   根据用户加载数据
       * unitChartData   单位绘制图形
       * serviceChartData  服务绘制图形
       * identityJudgment  身份判定
       * TimeCheckBtn  日期选择
       * onDatePickerConfirm  日期弹框确定按钮
       * **/
      methods:{
        onDatePickerConfirm(columnsValue){
          this.DateYear = columnsValue[0].text;
          this.startDate = columnsValue[0].value + '-01-01';
          if(columnsValue[0].value == new Date().getFullYear()){
            this.endDate = dateFormat(new Date());
          }else {
            this.endDate = columnsValue[0].value + '-12-31';
          }
          this.identityJudgment();//身份判定(唯一入口)
          this.isDatePickerShow = false
        },
        TimeCheckBtn(){
          this.isDatePickerShow = true
        },
        identityJudgment(){
          if(this.$store.getters.getdetailCondition.title == '检测站'){
            this.getOrganData(this.$store.getters.getdetailCondition)
            this.title = true
          }else{
            this.getServiceData(this.$store.getters.getdetailCondition)
            this.title = false
          }
        },
        unitChartData(){
          this.unitShowData();
          this.myChart = echarts.init(document.getElementById('main'));
          this.myChart.setOption(this.unitOption);
        },
        serviceChartData(){
          this.serviceShowData();
          this.myChart = echarts.init(document.getElementById('main'));
          this.myChart.setOption(this.serviceOption);
        },
        ddjlBtn(){
          this.$router.push({name:'statisDetail'})
        },
        backBtn(){
          this.$router.back()
        },
        getOrganData:async function(data){
          await GetOrganStatistics({"startDate":this.startDate,"endDate":this.endDate,"organId":data.id}).then(res=>{
            if(res.data.success == 1){
              this.unitDataSet = res.data.result[0];
              this.pjCost = res.data.result[0].partsPrice;
              this.wxCost = res.data.result[0].checkPrice;
              this.qtCost = (parseFloat(res.data.result[0].runPrice) + parseFloat(res.data.result[0].jtPrice) + parseFloat(res.data.result[0].zsPrice) + parseFloat(res.data.result[0].otherPrice)).toFixed(2);
            }else{
              alert(res.data.result)
            }
          })
          this.unitChartData()
        },
        getServiceData:async function(data){
          await GetServiceStatistics({"startDate":this.startDate,"endDate":this.endDate,"personalId":data.id}).then(res=>{
            if(res.data.success == 1){
              this.serviceDataSet = res.data.result[0];
            }else {
              alert(res.data.result)
            }
          })
          this.serviceChartData()
        },

        getUserData(){

        },
        /**
         * echarts饼图数据
         * @constructor
         */
        unitShowData(){
          this.unitOption = {
            title:{
              text:'年度总开销',
              x:'center',
              y:'center',
              top:'55%',
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 5,
              data: ['配件费','维修费','其他']
            },
            graphic: [{ //环形图中间添加文字
              type: 'text', //通过不同top值可以设置上下显示
              left: 'center',
              top: '39%',
              style: {
                text: this.totalOrder,
                textAlign: 'center',
                fill: '#333', //文字的颜色
                width: 30,
                height: 30,
                fontSize: 45,
                fontWeight: 'bold'
              },
            }],
            series: [
              {
                name: '当年数据量',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: true,
                    position: 'inner',
                    textStyle : {
                      fontWeight : 300 ,
                      fontSize : 15    //文字的字体大小
                    },
                    formatter:'{d}%',

                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '25',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: this.pjCost, name: '配件费'},
                  {value: this.wxCost, name: '维修费'},
                  {value: this.qtCost, name: '其他'},
                ]
              }
            ]
          };
        },
        serviceShowData(){
          this.serviceOption = {
            title:{
              text:'年度接单总量',
              x:'center',
              y:'center',
              top:'55%',
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 5,
              data: ['未完成', '已付款(单数)', '未付款(单数)']
            },
            graphic: [{ //环形图中间添加文字
              type: 'text', //通过不同top值可以设置上下显示
              left: 'center',
              top: '39%',
              style: {
                text: this.serviceDataSet.orderTake,
                textAlign: 'center',
                fill: '#333', //文字的颜色
                width: 30,
                height: 30,
                fontSize: 45,
                fontWeight: 'bold'
              },
            }],
            series: [
              {
                name: '当年数据量',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: true,
                    position: 'inner',
                    textStyle : {
                      fontWeight : 300 ,
                      fontSize : 15    //文字的字体大小
                    },
                    formatter:'{d}%',

                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '25',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: (this.serviceDataSet.orderTake - this.serviceDataSet.handOver), name: '未完成'},
                  {value: this.serviceDataSet.paidNum, name: '已付款(单数)'},
                  {value: this.serviceDataSet.unpaidNum, name: '未付款(单数)'},
                ]
              }
            ]
          };
        },

      }
    }
</script>

<style scoped>
.statsTable{
  background: #fff!important;
}
nav{
  padding-left: 20px;
  padding-top: 30px;
  height: 2.3rem;
  border-bottom: 1px solid #eee;
  position: relative;
}
.TimeCheck{
  width: 7rem;
  height: 2rem;
  font-size: 1.3rem;
  background: grey;
  color: white;
  text-align: center;
  line-height: 2rem;
  border-radius: 20px;
  position: absolute;
  top:3.5rem;
  left: calc(50% - 3.5rem);
  z-index: 999;
}
  .holder{
    margin-left: 35px;
    margin-right: 20px;
    display :block;
    width :30px;
    height :30px;
    border-radius :44px;
    background-color :#E6E6E6;
  }
  .md-cell-item{
    height: 3.5rem;
    font-size: 1.2rem!important;
  }
  .md-field{
    padding: 0!important;
    border: 0.5rem solid #fff;
  }
  .title{
    font-size: 1.6rem;
    color: #333;
    margin-right: 20px;
    }

</style>
