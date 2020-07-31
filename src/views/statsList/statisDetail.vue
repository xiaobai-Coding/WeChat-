<template>
    <div class="statisDetail">
      <nav @click="backBtn">
        <md-icon name="arrow-left" size="lg" style="font-size: 1.4rem;color: #333;"></md-icon>
        <p style="font-size:1rem;display: inline-block;height: 1.4rem;line-height: 1.4rem;vertical-align: top;margin-left: 10px">详情列表</p>
      </nav>

      <div class="dateSearch">
        <p @click="propShow" style="float: left">{{searchDate}}
          <md-icon name="arrow-down" size="sm" style="float: right;padding: 0.7rem" v-if="iconbtn"></md-icon>
          <md-icon name="arrow-up" size="sm" style="float: right;padding: 0.7rem" v-if="!iconbtn"></md-icon>
        </p>
        <ul class="searchCost" >
          <li v-if="isShow">
            <span style="color: #7f7f7f;font-size: 0.8rem">订单总额:</span>
            <span style="color: #7f7f7f;font-size: 1rem">￥{{OrganData.shouldCost}}</span>
          </li>
          <li v-if="isShow">
            <span style="color: #7f7f7f;font-size: 0.8rem">未付款:</span>
            <span style="color: #7f7f7f;font-size: 1rem">￥{{OrganData.uncollCost}}</span>
          </li>
          <li v-if="!isShow">
            <span style="color: #7f7f7f;font-size: 0.8rem">订单总量:</span>
            <span style="color: #7f7f7f;font-size: 1rem">{{ServiceData.length}}单</span>
          </li>
          <li v-if="!isShow">
            <span style="color: #7f7f7f;font-size: 0.8rem">总工时:</span>
            <span style="color: #7f7f7f;font-size: 1rem">{{ServiceData.allTime}}时</span>
          </li>
        </ul>
      </div>

      <ul>
        <!--机构-->
        <li class="detailLi"  v-for="(item,index) in OrganData" :key="index" v-if="isShow" @click="pushDetail(item)">
          <div class="statisDate">
            <p class="statisPromble">
              <span v-if="item.IsPay != '-1.00'" class="statisTagYes">完成</span>
              <span v-if="item.IsPay == '-1.00'" class="statisTagNo">未付款</span>
              <span v-if="isShow">{{item.problem}}</span>
            </p>
            <p style="height: 1.5rem;font-size: 0.8rem;color: rgba(0,0,0,0.54);margin-top: 10px;">
              <span v-if="isShow">{{item.recordDate}}</span>
            </p>
          </div>
          <div class="statisCost" :style="{'color':(item.IsPay != '-1.00' ? '#333':'red')}">
            <span >-{{item.receivable}}</span>
          </div>
          <span style="color: #333;position: absolute;right: 14px;bottom: 10px;font-size: 0.8rem">减免金额：{{item.noPrice}}</span>
        </li>

        <!--服务人员-->
        <li class="detailLi" v-for="(item1,index1) in ServiceData" :key="index1" v-if="!isShow" @click="pushDetail(item1)">
          <div class="statisDate">
            <p class="statisPromble">
              <span v-if="item1.IsPay != '-1.00'" class="statisTagYes">完成</span>
              <span v-if="item1.IsPay == '-1.00'" class="statisTagNo">未付款</span>
              <span>{{item1.organName}}</span>
            </p>
            <p style="height: 1.5rem;font-size: 0.8rem;color: rgba(0,0,0,0.54);margin-top: 10px;">
              <span>{{item1.recordDate}}</span>
            </p>
          </div>
          <div class="statisCost" :style="{'color':(item1.IsPay != '-1.00' ? '#333':'red')}">
            <span><p style="display: inline-block;font-size: 0.4rem">￥</p>{{item1.receivable - item1.noPrice}}</span>
          </div>
          <span style="color: #333;position: absolute;right: 14px;bottom: 10px;font-size: 0.8rem">服务时长：{{item1.serviceHours}}小时</span>
        </li>
        <div style="clear: both"></div>
      </ul>

      <!--日期选择框-->
      <div style="width: 100%;height: 18rem;position: absolute;top: 7rem;left: 0;background: white;" v-if="isPopupShow">
        <span class='switchBtn' @click="switchBtn">确定</span>
        <div style="width:14.7rem;margin: 2rem auto ">
          <span style="display: inline-block;width: 7rem;text-align: center;border-bottom: 1px solid #7f7f7f" :style="{background:isStartDate? '#f3f3f6':'#fff'}" @click="changeStartDate">{{startDateYear}}</span>-
          <span style="display: inline-block;width: 7rem;text-align: center;border-bottom: 1px solid #7f7f7f" :style="{background:!isStartDate? '#f3f3f6':'#fff'}" @click="changeEndDate">{{endDateYear}}</span>
        </div>
        <div style="width: 15rem;height: 127px;margin: 20px auto;overflow: hidden;">
          <md-date-picker
            ref="start"
            type="custom"
            :default-date="StartCurrentDate"
            :v-model="StartPopupShow"
            :custom-types="['yyyy']"
            is-view
            keep-index
            @change="onDatePickerChange"
            style="margin-top: -60px"
          ></md-date-picker>
        </div>
      </div>
    </div>
</template>

<script>
  import { Icon,DatePicker,Toast,Dialog  } from 'mand-mobile'
  import {GetOrganDetails,GetServiceDetails} from '../../api/statistic';
  import {dateFormat} from "../../../static/script/dateFormat";
    export default {
        name: "statisDetail",
      components:{
        [Icon.name]:Icon,
        [DatePicker.name]:DatePicker,
        [Toast.name]:Toast,
        [Dialog.name]:Dialog,

      },
      data(){
        return{
          iconbtn:true,//条件展开按钮样式
          isShow:true,
          startDate:'2000-01-01'  ,//开始日期
          endDate:dateFormat(new Date()),//结束日期
          OrganData:[],//机构数据
          ServiceData:[],//服务人员数据
          searchDate:'全部',
          isPopupShow:false,//弹框
          StartPopupShow:'',
          isSwitch:true,//true为按月查询 false为按年查询
          startDateYear:'2000',
          endDateYear:new Date().getFullYear(),
          isStartDate:true,//是否开始日期选中
        }
      },
      mounted(){
        this.identityJudgment();//身份判定
      },
      beforeRouteEnter(to,from,next){
        if(from.name == 'statsTable'){
          next(vm=>{
            vm.dataInitial();//初始化
            vm.identityJudgment();//身份判定
          })
        }
        next();
      },
      computed:{
        StartCurrentDate(){
            return new Date("\'" + (this.isStartDate? this.startDateYear:this.endDateYear).toString() +"\'")
          }
      },
      /**
       * propShow  搜索点击事件
       * pushDetail  进入详细参数
       * backBtn  返回
       * identityJudgment  身份判定
       * getOrganData 检测站数据获取
       * getServiceData  用户数据获取
       * dataInitial  初始化
       * changeStartDate  改变开始时间
       * changeEndDate  改变结束时间
       */
      methods:{
        changeEndDate(year,month){
         this.isStartDate = false
        },
        changeStartDate(year,month){
          this.isStartDate = true
        },
        onDatePickerChange(columnIndex, itemIndex, value){
          if(this.isStartDate){
            this.startDateYear = value.value
          }else {
            this.endDateYear = value.value
          }
        },
        switchBtn(){
          if(this.endDateYear > new Date().getFullYear()){
            alert('结束时间不能大于当前日期')
            return
          }
          if(this.startDateYear > this.endDateYear){
            alert('开始时间不能大于结束时间')
            return
          }

          if(this.endDateYear == new Date().getFullYear()){
            this.endDate = dateFormat(new Date())
          }else{
            this.endDate = this.endDateYear + '-12-31'
          }
          this.startDate = this.startDateYear + '-01-01'
          this.identityJudgment()//权限判断（唯一的入口）
          this.isPopupShow = false;
          this.iconbtn = true;
          this.searchDate = this.startDateYear +'-'+this.endDateYear
        },
        dataInitial(){
          this.startDate = '2000-01-01';//开始日期
          this.endDate = dateFormat(new Date());//结束日期
          this.searchDate = '全部';
          this.startDateYear = '2000';
          this.endDateYear = new Date().getFullYear();
        },
        identityJudgment(){
          if(this.$store.getters.getdetailCondition.title == '检测站'){
            this.getOrganData(this.$store.getters.getdetailCondition)
            this.isShow = true
          }else{
            this.getServiceData(this.$store.getters.getdetailCondition)
            this.isShow = false
          }
        },
        getOrganData:async function(data) {
          let shouldCost = 0;//应收金额'
          let uncollCost = 0;//未付款金额
          await GetOrganDetails({"startDate":this.startDate,"endDate":this.endDate,"organId":data.id}).then(res=>{
            if(res.data.success == 1){
              if(res.data.success != ''){
                res.data.result.forEach((item,index)=>{
                  shouldCost += parseFloat(item.receivable);
                  uncollCost += parseFloat(item.receivable) - parseFloat(item.realPrice);
                })
                shouldCost = shouldCost.toFixed(2);
                uncollCost = uncollCost.toFixed(2);
                this.OrganData = res.data.result;
                this.OrganData['shouldCost'] = shouldCost;
                this.OrganData['uncollCost'] = uncollCost;
              }else {
                alert('数据为空')
              }
            }else{
              alert(res.data.result)
            }
          })
        },
        getServiceData:async function(data){
          let allTime = 0;//服务总时间
          await GetServiceDetails({"startDate":this.startDate,"endDate":this.endDate,"personalId":data.id}).then(res=>{
            if(res.data.success == 1){
              if(res.data.result != ''){
                res.data.result.forEach((item,index)=>{
                  allTime += parseFloat(item.serviceHours)
                })
                allTime = allTime.toFixed(2);
                this.ServiceData = res.data.result;
                this.ServiceData['allTime'] = allTime;
              }else {
                alert('数据为空')
              }
            }else{
              alert(res.data.result)
            }
          })
        },
        propShow(){
          this.iconbtn = !this.iconbtn;
          this.isPopupShow = !this.isPopupShow;
        },
        pushDetail(item){
          this.$router.push({
            name:'statisRecord',
            query:{
              data:JSON.stringify(item)
            }
          })
        },
        backBtn(){
          this.$router.back()
        }
      }
    }
</script>

<style scoped>
.statisDetail{
  background: white;
  width: 100%;
}
nav{
  padding-left: 20px;
  padding-top: 30px;
  height: 2.3rem;
  border-bottom: 1px solid #eee;
}
.dateSearch{
  width: calc(100% - 2rem);
  height: 2rem;
  background: #eee;
  padding: 1rem;
}
.dateSearch p {
  width: 7.5rem;
  height: 2rem;
  background: white;
  line-height: 2rem;
  border-radius: 20px;
  text-align: center;
}
.searchCost{
  font-size: 0.6rem;
  width: calc(100% - 9rem);
  float: right;
  margin-top: -20px;
}
.searchCost li{
  text-align: right;
}
.detailLi{
  padding: 0.8rem;
  margin: 5px 0;
  height: 3.5rem;
  border-bottom: 1px solid #e5e5e5;
  position: relative;

}
  .statisDate{
    float: left;
    width: calc(100% - 7rem);
  }
  .statisDate p{
    height: 1.8rem;
  }
  .statisCost{
    float: left;
    width: 7rem;
  }
  .statisCost span{
    display: inline-block;
    font-size: 1.4rem;
    line-height: 1.7rem;
    height: 3.5rem;
    width: 100%;
    text-align: right;
  }
  .statisTagYes,.statisTagNo{
    width: 3rem;
    height:1.4rem;
    line-height: 1.4rem;
    background: #0bb20c;
    display: inline-block;
    text-align: center;
    border-radius: 10px;
    color: white;
    font-size: 0.7rem;
    margin-right: 5px;
  }
.statisTagNo{
  background: red;
  color: black;
}

  .statisPromble{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1.8rem;
  }
  .switchBtn{
    display: inline-block;
    height: 1.6rem;
    width: 4rem;
    line-height: 1.8rem;
    text-align: center;
    border-radius: 10px;
    margin-left: 1rem;
    margin-top: 1rem;
    background: #0bb20c;
    color: white;
  }
</style>
