<template>
<div class="receivables" id="center">
  <header>
    <!-- 信息卡片 -->
    <div class="detailed">
      <div>
        <ul>
          <li>
            <span style="font-size: 1.2rem;color: #0bb20c">{{orderData.RptRecordNo}}</span>
          </li>
          <li>
            <span class="serverCard-title">机构名称:</span>
            <span class="serverCard-value server-problem">{{orderData.OrganName}}</span>
          </li>
          <li>
            <span class="serverCard-title">报修问题:</span>
            <span class="serverCard-value server-problem">{{orderData.Problem}}</span>
          </li>
          <li>
            <span class="serverCard-title">报修人:</span>
            <span class="serverCard-value card_two">{{orderData.RptRecordBy}}</span>
            <span class="serverCard-title">报修时间:</span>
            <span class="serverCard-value card_time">{{orderData.RecordDate}}</span>
          </li>
          <li>
            <span class="serverCard-title">服务人:</span>
            <span class="serverCard-value card_two">{{orderData.RecordBy}}</span>
            <span class="serverCard-title">服务时长:</span>
            <span class="serverCard-value card_time">{{orderData.RealHours}}小时</span>
          </li>
          <li style="width: 33%;float: left;">
            <span class="serverCard-title price_name">配件费:</span>
            <span class="serverCard-value price_value">{{orderData.PartsPrice}}</span>
          </li>
          <li style="width: 33%;float: left;">
            <span class="serverCard-title price_name">检修费:</span>
            <span class="serverCard-value v">{{orderData.CheckPrice}}</span>
          </li>
          <li style="width: 33%;float: left;">
            <span class="serverCard-title price_name">运费:</span>
            <span class="serverCard-value price_value">{{orderData.RunPrice}}</span>
          </li>
          <li style="width: 33%;float: left;">
            <span class="serverCard-title price_name">交通费:</span>
            <span class="serverCard-value price_value">{{orderData.JtPrice}}</span>
          </li>
          <li style="width: 33%;float: left;">
            <span class="serverCard-title price_name">住宿费:</span>
            <span class="serverCard-value price_value">{{orderData.ZsPrice}}</span>
          </li>
          <li style="width: 33%;float: left;">
            <span class="serverCard-title price_name">其他:</span>
            <span class="serverCard-value price_value">{{orderData.OtherPrice}}</span>
          </li>
          <li style="width: 100%;float: left;font-size: 20px;margin-top: 8px">
            <span style="color: #7f7f7f;float: right;margin-right: 5px">总金额:<span style="color: #333">{{orderData.Receivable}}元</span></span>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <section style="border: 1.1rem solid #fff;border-radius: 4px;">
    <md-field style="margin: 0;">

      <md-field-item class="check-style" title="收款方式" arrow="arrow-right" :addon="submitData.CollMethod" @click="CollMethodShow = true" :arrow="submitData.CollMethod"></md-field-item>
      <md-picker  ref="CollMethod" v-model="CollMethodShow" :data="CollMethodList" @confirm="CollMethodCheck"></md-picker>

      <md-field-item class="check-style" title="收款方类型" arrow="arrow-right" :addon="submitData.CollType" @click="CollTypeShow = true" :arrow="submitData.CollType"></md-field-item>
      <md-picker ref="CollType" v-model="CollTypeShow" :data="CollTypeList" @confirm="CollTypeCheck" ></md-picker>

      <md-field-item class="check-style" title="收款日期" arrow="arrow-right" :addon="submitData.CollDate" @click="CollDateShow = true" :arrow="submitData.CollDate"></md-field-item>
      <md-date-picker
        ref="CollDate"
        v-model="CollDateShow"
        type="custom"
        title="选择收款日期"
        large-radius
        :custom-types="['yyyy', 'MM','dd']"
        :default-date="defaultData1"
        @confirm="CollDateCheck"
      ></md-date-picker>


      <md-input-item title="实收金额" type="money" placeholder="请填写实收金额" align="right" v-model="submitData.RealPrice">
        <span slot="right">元</span>
      </md-input-item>

      <md-input-item title="减免金额" type="money" placeholder="请填写减免金额" align="right" v-model="submitData.NoPrice">
        <span slot="right">元</span>
      </md-input-item>


      <md-field-item class="check-style" title="收款人" arrow="arrow-right" :addon="collectName" @click="CollectionByNameShow = true" :arrow="submitData.CollectionBy"></md-field-item>
      <md-picker ref="CollType" v-model="CollectionByNameShow" :data="CollectionByNameList" @confirm="CollectionByNameCheck" ></md-picker>


      <md-textarea-item ref="demo0" title="备注" autosize class="example" v-model="submitData.Mark" placeholder="请输入备注信息"/>
      <md-button :type="buttonType" @click="submitFromData" class="user_submit" :loading="submitState" >{{buttonTitle}}</md-button>
    </md-field>
  </section>
</div>
</template>

<script>
  import { InputItem,Field,FieldItem,Icon,Picker,DatePicker,TextareaItem,Button,Toast ,Dialog} from 'mand-mobile'
  import {ReceiveMoneyDetail,CollectMoney} from "@/api/UserReceipt"
  import {GetServicePersonList} from "@/api/dispatchreport"
	export default {
		name: "receivables",
    components:{
      [InputItem.name]:InputItem,
      [Field.name]:Field,
      [FieldItem.name]:FieldItem,
      [Icon.name]: Icon,
      [Picker.name]: Picker,
      [DatePicker.name]: DatePicker,
      [TextareaItem.name]: TextareaItem,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Dialog.name]: Dialog,
    },
    data(){
      return{
        defaultData1:new Date(),
        defaultData2:new Date(),
        buttonTitle:'提交',
        submitState:false,
        scroll:'',
        navShow:false,
        buttonType:"primary",
        collectName:'',
        payName:'',
        /**
          * 数据卡片信息
          * 卡片名称对应表
          * */
        orderData:[],

        /**
         * 选项框数据
         * */
        CollMethodList:[
          [
            {
              text:"现金",
              value:"现金",
            },
            {
              text:"转账",
              value:"转账",
            },
            {
              text:"承兑",
              value:"承兑",
            },
            {
              text:"支付",
              value:"支付",
            },
            {
              text:"其他",
              value:"其他",
            }
          ]
        ],
        CollTypeList:[
          [
            {
              text:"个人",
              value:"个人",
            },
            {
              text:"经营部",
              value:"经营部",
            },
            {
              text:"公司",
              value:"公司",
            },
          ]
        ],
        CollectionByNameList:[],
        BillTypeList:[
          [
            {
              text:"普通发票",
              value:"普通发票",
            },
            {
              text:"增值发票",
              value:"增值发票",
            },
            {
              text:"收据",
              value:"收据",
            },
            {
              text:"无",
              value:"无",
            },
          ]
        ],


        /**
         * 选项判断条件
         * */
        CollMethodShow:false,
        CollTypeShow:false,
        CollectionByNameShow:false,
        CollDateShow:false,
        BillTypeShow:false,
        BillDateShow:false,
        BackByNameShow:false,


        /**
         * form提交的数据
         * */
        submitData:{
          CollMethod:'',
          CollType:'',
          CollDate:'',
          RealPrice:'',
          NoPrice:'',
          CollectionBy:'',
          Mark:'',
        }
      }
    },
    beforeRouteLeave(to,from,next){
      window.removeEventListener('touchmove',this.scrollTop,true);
      next()
    },
    methods:{
		  /**
       * 组件入口
       * */
      programEntrance(){

        this.getCollectData();
        window.addEventListener('touchmove',this.scrollTop,false);
      },

     /**
      * 获取滚轴距离顶部的高度
      * **/
      scrollTop(){
       var scrollT = document.documentElement.scrollTop||document.body.scrollTop;
       if(scrollT > 260){
         this.navShow = true;
       }else{
         this.navShow = false;
       }
      },

      /***
       * 接口文件
       * 获取收款信息
       * getCollectData
       */
      getCollectData(){
        ReceiveMoneyDetail({assRecordId:this.$store.getters.getAssRecordId}).then(res=>{
          if(res.data.success == 1){
            this.orderData = res.data.result;
            if(res.data.result.CollectState == 1){
              Object.keys(this.submitData).map(item=>{
                this.submitData[item] = res.data.result[item]
              });
              this.collectName = res.data.result.CollectionByName;
            }
          }else{
            alert(res.data.result)
          }
        })
      },

      /**
       *选择
       * */
      CollMethodCheck(val){
        this.submitData.CollMethod = val[0].value;
      },
      CollTypeCheck(val){
        this.submitData.CollType = val[0].value;
      },
      CollectionByNameCheck(val){
        this.collectName = val[0].label;
        this.submitData.CollectionBy = val[0].value;
      },
      CollDateCheck(val){
        this.submitData.CollDate = this.dateFormat(val[0].value,val[1].value,val[2].value);
      },
      BillTypeCheck(val){
        this.submitData.BillType = val[0].value;
      },
      BillDateCheck(val){
        this.submitData.BillDate = this.dateFormat(val[0].value,val[1].value,val[2].value);
      },
      BackByNameCheck(val){
        this.payName = val[0].text;
        this.submitData.BackBy = val[0].value;
      },

      /**
       * 提交按钮
       * **/
      submitFromData(){
        let _this = this;
        this.buttonType = "disabled";
        this.buttonTitle = "正在提交...";
        this.submitState = true;

        {
          this.submitData.SettlementId = this.$store.getters.getSettlementId;
          this.submitData.OrganizId = this.orderData.OrganizId;
          this.submitData.OrganName = this.orderData.OrganName;
          this.submitData.RcvRecordId = this.orderData.SettlementId;
          this.submitData.RptRecordNo = this.orderData.RptRecordNo;
          this.submitData.CollectionByName = this.collectName;
        }

        for(let key in this.submitData){
          if(this.submitData[key] == ''){
            alert('数据填写不完整请认真核对！！');
            ver();
            return;
          }else{
            CollectMoney(this.submitData).then(res=>{
              if(res.data.success == 1){
                // alert(res.data.result);
              Dialog.succeed({
              title: "提交成功",
              content: "恭喜您成功完成操作",
              confirmText: "确定",
              onConfirm: ()=>{
              this.buttonTitle = "已提交...";
              this.submitState = false;
              this.$store.dispatch("setSettlementId", this.id);
              this.$router.push({
                name: "receivableList",
                params: { id: res.data.SettlementId }
              });
              }
            });
              }else{
                alert(res.data.result);
                ver();
              }
            }).catch(error=>{
              alert(error.result);
              ver();
            });
            return;
          }
        }

        function ver() {
          _this.buttonTitle = "提交";
          _this.submitState = false;
          _this.buttonType = "primary";
        }
      },

      /**
       * 日期格式初始化
       * */
      dateFormat(year,month,day){
        if(month < 10){
          month = "0" + month;
        }
        if(day < 10){
          day = "0" + day;
        }
        return year+"-"+month+"-"+day;
      }
    },
    mounted(){
      GetServicePersonList().then(res=>{
        this.CollectionByNameList.push(res.data.result)
        console.log(res)
      })
      this.programEntrance();
    },


    watch:{
      scroll(newValue,oldValue){
        console.log(newValue)
      }
    }
	}
</script>

<style scoped lang="scss">
.receivables{
  background: #eee;
  border: 1rem solid #eee;
  header{
    .detailed {
      background-image: url(../../../static/images/vistback.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 100%;
      border-radius: 10px;
      font-size: 0.9rem;
      height: 14.27rem;
      position: relative;
      margin-left: -20px;
      padding: 25px;
      div {
        padding: 0.4rem 0.7rem;

        .serverCard-title{
          font-size: 0.9rem;
          color: #7f7f7f;
          width: 4.2rem;
          display: inline-block;
        }
        .serverCard-value{
          color: #333!important;
          font-size: 0.9rem;
          display: inline-block;
          width: calc(100% - 4.5rem);
        }
        .server-problem{
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          vertical-align: middle;
        }
        .price_name{
          width: 3rem;
        }
        .price_value{
          width: calc(100% - 3.3rem)!important;
        }
        .card_two{
          width: 3rem;
        }
        .card_time{
          width:calc(100% - 12.5rem)
        }
        .pj_list{
          margin-top: 7px;
          width: 50%;
          float: left;
          font-size: 1rem;
          color: #1c1fbd;
        }
      }

      div:after{
        content: " ";
      }
    }
  }
  nav{
    ul{
      width: calc(100% - 1.6rem);
      margin-left: -1rem;
      background: white;
      height: 110px;
      padding: 20px 30px;
      position: fixed;
      top: 0;
      z-index: 99999;
      .nav_one{
        float: left;
        width: 100%;
      }
      .nav_three{
        float: left;
        width: 33.3%;
      }
    }
  }
  section{
    .md-field{
      /*border: 1rem solid #fff;*/
      .md-field-item {
        padding: 15px 0!important;
      }
      .check-style{
        padding: 0!important;
      }
      .user_submit{
        width: 100%;
        margin: 15px auto 0;
      }
      .user_submit:active{
        background: #eeeeee;
        opacity: 0.6;

      }
    }

  }

}

</style>
