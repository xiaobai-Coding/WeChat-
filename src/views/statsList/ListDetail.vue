<template>
    <div class="ListDetail">
      <!--返回-->
      <nav @click="backBtn">
        <md-icon name="arrow-left" size="lg" style="font-size: 1.4rem;color: #333;"></md-icon>
        <p style="font-size:1rem;display: inline-block;height: 1.4rem;line-height: 1.4rem;vertical-align: top;margin-left: 10px">详情列表</p>
        <span style="font-size: 0.9rem;color: rgb(153, 157, 156);position: absolute;right: 5px;top: 6px">
          <p style="text-align: right" v-if="this.$store.getters.getAgencyId.type == '服务人员'">服务人员：{{this.$store.getters.getAgencyId.name}}</p>
          <p style="text-align: right" v-if="this.$store.getters.getAgencyId.type == '检测站'">{{AorganName}}</p>
          <p style="text-align: right">({{this.$store.getters.getAgencyId.StartData}}至{{this.$store.getters.getAgencyId.EndData}})</p>
        </span>
      </nav>
      <!--数据展示列表-->
      <!--服务人员-->
      <ul class="detail-list" v-if="this.$store.getters.getAgencyId.type == '服务人员'">
        <li v-for="(item,index) in serviceData" :key="index" @click="detailbtn(index)">
          <p>
            <span style="position: absolute;top: -2px;width: 10rem;text-align: left">{{item.recordDate}}</span>
            <b>{{item.organName}}</b>
            <span style="float: right;font-size: 1.2rem;margin-top: 5px" :style="{color:item.IsPay == '-1.00'? 'red':'green'}">{{item.IsPay == '-1.00'? '未支付':'已支付'}}</span>
          </p>
          <!--{{serviceData.index == index}}-->
          <div style="height: 10.52rem" v-if="isIndex == index">
            <ul class="detail-content">
              <li style="width: 100%;height: 3.4rem;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;">报修问题：{{item.problem == ''? '空':item.problem}}</li>
              <li >联系人：{{item.rptContactBy}}</li>
              <li style="width: 60%">联系电话：{{item.cellPhone}}</li>
              <li >服务人：{{item.trueName}}</li>
              <li style="width: 60%">服务时间：{{item.serviceDate}}</li>
              <li >服务时长：{{item.serviceHours}}小时</li>
              <li style="width: 60%">金额：{{item.receivable}}元</li>
              <li style="width: 50%">减免金额：{{item.noPrice}}元</li>
              <li style="width: 50%;text-align: center;color: #0bb20c">{{item.state}}</li>
            </ul>
          </div>
        </li>
      </ul>

      <!--机构-->
      <ul class="detail-list" v-if="this.$store.getters.getAgencyId.type == '检测站'">
        <li v-for="(item1,index1) in organData" :key="index1" @click="detailbtn(index1)">
          <p>
            <span style="position: absolute;top: -2px;width: 10rem;text-align: left">{{item1.recordDate}}</span>
            <b>{{item1.problem == ''? '空':item1.problem}}</b>
            <span style="float: right;font-size: 1.2rem;">
              <div style="width: 3.5rem;height: 1.8rem;border-radius: 10px;margin: 5px auto;text-align: center;color: white;font-size: 0.8rem" :style="{background:item1.state == '待派修'? '#a0a047':'#0bb20c'}">{{item1.state}}</div>
            </span>
          </p>
          <!--{{serviceData.index == index}}-->
          <div style="height: 8.77rem" v-if="isIndex == index1">
            <ul class="detail-content">
              <li style="width: 100%;height: 3.4rem;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;">报修问题：{{item1.problem == ''? '空':item1.problem}}</li>
              <li >联系人：{{item1.rptRecordBy}}</li>
              <li style="width: 60%">联系电话：{{item1.cellPhone}}</li>
              <li >服务人：{{item1.recordBy == ''? '-':item1.recordBy}}</li>
              <li style="width: 60%">服务时长：{{item1.serviceHours == '0小时'? '-':item1.serviceHours}}</li>
              <li >金额：{{item1.receivable}}元</li>
              <li >减免金额：{{item1.noPrice}}元</li>
              <li style="width: 20%;text-align: center" :style="{color:item1.IsPay == '-1.00'? 'red':'green'}">{{item1.IsPay == '-1.00'? '未支付':'已支付'}}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
  import {GetOrganDetails,GetServiceDetails} from '../../api/statistic';
  import { Icon,Toast  } from 'mand-mobile'
  export default {
    name: "ListDetail",
    components:{
      [Icon.name]:Icon,
      [Toast.name]:Toast,
    },
    data(){
      return{
        serviceData:[],//服务人员数据
        organData:[],//机构数据
        isIndex:0,
        AorganName:'',
      }
    },
    mounted() {
      this.identityJudgment();//身份判定(唯一的入口)
    },
    /**
     * identityJudgment  身份认证
     * serviceGetData   服务人员身份请求数据
     * organGetData     检测站用户身份请求数据
     * backBtn    返回
     * detailbtn  点击卡片
     */
    methods:{
      detailbtn(i){
        this.isIndex = i
      },
      backBtn(){
        this.$router.back()
      },
      organGetData:async function(data){
        await GetOrganDetails({"startDate":data.StartData,"endDate":data.EndData,"organId":data.id}).then(res=>{
          if(res.data.success == 1){
            this.AorganName = res.data.result[0].organName;
            this.organData = res.data.result;
            this.organData.forEach((item,index)=>{
              item.serviceHours = item.serviceHours+ '小时'
              if(item.state == 0){
                item.state = '待派修'
              }else if(item.state == 1){
                item.state = '待服务'
              }else if(item.state == 2){
                item.state = '待回访'
              }else if(item.state == 3){
                item.state = '待审核'
              }else if(item.state == 4){
                item.state = '已完成'
              }else if(item.state == 5){
                item.state = '审核拒绝'
              }else if(item.state == 6){
                item.state = '订单无效'
              }
            })
          }else{
            alert(res.data.result)
          }
        })
      },
      serviceGetData:async function(data){
        await GetServiceDetails({"startDate":data.StartData,"endDate":data.EndData,"personalId":data.id}).then(res=>{
          this.serviceData = res.data.result;
          this.serviceData.forEach((item,index)=>{
            if(item.state == 0){
              item.state = '待派修'
            }else if(item.state == 1){
              item.state = '待服务'
            }else if(item.state == 2){
              item.state = '待回访'
            }else if(item.state == 3){
              item.state = '待审核'
            }else if(item.state == 4){
              item.state = '已完成'
            }else if(item.state == 5){
              item.state = '审核拒绝'
            }else if(item.state == 6){
              item.state = '订单无效'
            }
          })
        })
      },
      identityJudgment(){
        if(this.$store.getters.getAgencyId.type == '服务人员'){
          this.serviceGetData(this.$store.getters.getAgencyId)
        }else {
          this.organGetData(this.$store.getters.getAgencyId)
        }
      }
    }
  }
</script>

<style scoped>
  nav{
    padding-left: 20px;
    padding-top: 30px;
    height: 2.3rem;
    border-bottom: 1px solid #eee;
    background: white;
    position: relative;
  }
  .detail-list{
  }
  .detail-list li{
    width: 100%;
    background: white;
    border-bottom: 1rem solid #eee;
    position: relative;
  }
  .detail-list li p{
    height: 2.5rem;
    border-bottom: 1px #eee;
    padding: 0.5rem;
  }
  .detail-list li p b{
    display: inline-block;
    width: calc(100% - 5rem);
    height: 2.5rem;
    line-height: 3.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .detail-list li p span{
    font-size: 0.9rem;
    color: #7f7f7f;
    width: 5rem;
    text-align: right;
    height: 2rem;
    line-height: 2rem;
  }
  .detail-content{
    padding: 0 0.3rem;
  }
  .detail-content li{
    width: 40%;
    height: 1.7rem;
    float: left;
    font-size: 0.9rem;
    line-height: 1.7rem;
    border-bottom: 1px solid #eee;
  }
</style>
