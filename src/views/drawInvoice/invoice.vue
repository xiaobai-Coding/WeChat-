<template>
  <div class="invoice">
    <header>
      <!-- 信息卡片 -->
      <div class="serverCard">
        <div style="position: relative;">
          <span style="position: absolute;right: 24px;top: 16px;" @click="showCardList" class="card-info"><md-icon name="calendar" style="font-size: 24px"></md-icon></span>
          <ul>
            <li>
              <span style="font-size: 1.2rem;color: #0bb20c">{{cardData.RptRecordNo}}</span>
            </li>
            <li>
              <span class="serverCard-title">报修问题:</span>
              <span class="serverCard-value server-problem">{{cardData.Problem}}</span>
            </li>
            <li>
              <span class="serverCard-title">报修人:</span>
              <span class="serverCard-value card_two">{{cardData.RptRecordBy}}</span>
              <span class="serverCard-title">报修时间:</span>
              <span class="serverCard-value card_time">{{cardData.RecordDate}}</span>
            </li>
            <li style="width: 33%;float: left;">
              <span class="serverCard-title price_name">配件费:</span>
              <span class="serverCard-value price_value">{{cardData.PartsPrice}}</span>
            </li>
            <li style="width: 33%;float: left;">
              <span class="serverCard-title price_name">检修费:</span>
              <span class="serverCard-value v">{{cardData.CheckPrice}}</span>
            </li>
            <li style="width: 33%;float: left;">
              <span class="serverCard-title price_name">运费:</span>
              <span class="serverCard-value price_value">{{cardData.RunPrice}}</span>
            </li>
            <li style="width: 33%;float: left;">
              <span class="serverCard-title price_name">交通费:</span>
              <span class="serverCard-value price_value">{{cardData.JtPrice}}</span>
            </li>
            <li style="width: 33%;float: left;">
              <span class="serverCard-title price_name">住宿费:</span>
              <span class="serverCard-value price_value">{{cardData.ZsPrice}}</span>
            </li>
            <li style="width: 33%;float: left;">
              <span class="serverCard-title price_name">其他:</span>
              <span class="serverCard-value price_value">{{cardData.OtherPrice}}</span>
            </li>
            <li style="width: 50%;float: left;">
              <span class="pj_list" @click="showpartsList = true">配件列表</span>
            </li>
            <li style="width: 50%;float: left;">
              <span style="color: #7f7f7f;float: right;margin-right: 5px">总金额:<span style="color: #0bb20c">{{cardData.Receivable}}元</span></span>
            </li>
          </ul>
        </div>
      </div>
    </header>

<!--    用户输入框-->
    <section style="border: 1.1rem solid #fff;border-radius: 5px;">
      <md-field style="margin: 0;">
        <md-input-item title="纳税识别号" type="text" placeholder="请填写纳税人识别号" align="right" v-model="submitData.PayTaxNo"></md-input-item>

        <md-input-item title="电话" type="phone" placeholder="请填电话号码" align="right" v-model="submitData.PayPhone"></md-input-item>

        <md-input-item title="地址" type="text" placeholder="请填开票地址" align="right" v-model="submitData.PayAddress"></md-input-item>

        <md-input-item title="开户行" type="text" placeholder="请填开票地址" align="right" v-model="submitData.Bank"></md-input-item>

        <md-button :type="buttonType" @click="submitFromData" class="user_submit" :loading="submitState">{{buttonTitle}}</md-button>
      </md-field>
    </section>


    <!--  配件列表-->
    <md-popup v-model="showpartsList" position="top">
      <div style="background: white;z-index: 9999;">
        <nav style="background: #eee;height: 25px">
          <span style="width: 20%;float: left;text-align: center;">名称</span>
          <span style="width: 20%;float: left;text-align: center;">编号</span>
          <span style="width: 10%;float: left;text-align: center;">数量</span>
          <span style="width: 10%;float: left;text-align: center;">单位</span>
          <span style="width: 20%;float: left;text-align: center;">单价</span>
          <span style="width: 20%;float: left;text-align: center;">总价</span>
        </nav>
        <ul class="parts_list">
          <li v-for="(item,index) in partsList" :key="index" style="height: 40px;font-size: 13px;">
            <span style="width: 20%;float: left;text-align: center; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;height: 40px;">{{item.PartsName}}</span>
            <span style="width: 20%;float: left;text-align: center;">{{item.PartsNo}}</span>
            <span style="width: 10%;float: left;text-align: center;">{{item.Qty}}</span>
            <span style="width: 10%;float: left;text-align: center;">{{item.Unit}}</span>
            <span style="width: 20%;float: left;text-align: center;">{{item.Price}}</span>
            <span style="width: 20%;float: left;text-align: center;">{{item.PartsPrice}}</span>
            <span style="clear: both"></span>
          </li>
          <li style="width: 100%;font-size: 2rem;color: #1c1fbd;text-align: center;line-height: 4rem" v-if="partsList.length==0">无配件列表数据</li>
        </ul>
      </div>
    </md-popup>


<!--    <md-landscape v-model="showFullScreen" full-screen style="width: 100%;height: 100%;margin-top: 1000px;">-->

<!--    </md-landscape>-->
    <div style="height: 100%;width: 100%;z-index: 999;;background: white;position: absolute;top: 0;left: 0;" v-show="showFullScreen">
      <nav style="background: #eee;position: relative">
        <span style="font-size: 40px;position: absolute;top: -12px;left: 10px" @click="showFullScreen = false">‹</span>
        <span style="font-size: 1.2rem;display: inline-block;height: 50px;line-height: 50px;text-align: center;width: 100%">未开发票订单</span>
      </nav>
      <ul>
        <li style="padding: 0.6rem 1rem;height: 50px;border-bottom: 1px solid #eee;" v-for="(item,index) in OrderList" :key="index">
          <div style="float: left;width: calc(100% - 157px)">
            <h5 style="font-size: 1.2rem;font-weight: normal;">{{item.RptRecordNo}}</h5>
            <p>
              <span style="font-size: 0.8rem;color: #7f7f7f;">{{item.RecordDate}}</span>
              <span style="font-size: 0.8rem;color: #7f7f7f;">{{item.RptRecordBy}}</span>
            </p>
          </div>
          <p style="float: left;width: 100px;font-size: 1.2rem;height: 50px;text-align: right;line-height: 50px;">￥{{item.Receivable}}</p>
          <span style="display: inline-block;height: 30px;font-size: 1.5rem;line-height: 50px;border-right: 2px solid #eee;margin-top: 10px;margin-left: 9px"></span>
          <p style="float: right;width: 40px;font-size: 1rem;height: 50px;text-align: center;line-height: 50px;color: #7f7f7f" @click="checkOk(index)" class="card-check">{{checkTitle(item)}}</p>
        </li>
      </ul>
    </div>


  </div>
</template>
<script>
  import { InputItem,Field,FieldItem,Icon,Picker,DatePicker,TextareaItem,Button,Toast,Popup,PopupTitleBar,DetailItem,Landscape} from 'mand-mobile'
  import { GetWaitDrawInvoiceList,UserSubmitInvoiceOrder} from "@/api/UserReceipt"; //获取提示信息
  export default {
    name: "invoice",
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
      [Popup.name]: Popup,
      [PopupTitleBar.name]: PopupTitleBar,
      [DetailItem.name]: DetailItem,
      [Landscape.name]: Landscape,
    },
    data(){
      return{
        buttonTitle:'提交',
        submitState:false,
        defaultData:new Date(),
        showpartsList:false,
        buttonType:"primary",
        showFullScreen:false,

        /*提交数据*/
        submitData:{
          PayTaxNo:'',
          PayPhone:'',
          PayAddress:'',
          Bank:'',
        },


        /*展示卡片数据*/
        cardData:{},
        partsList:[],
        OrderList:[],
        cardDemoData:[],

        /*选择框判定条件*/
        BillDateShow:false,


      }
    },
    computed:{
      checkTitle(item){
        return function (item) {
          let title = "";
          if(item.PayTaxNo){
            title = "修改"
          }else {
            title = "新增"
          }
          return title;
        }
      }
    },
    mounted(){
      this.programEntrance();
      // this.$store.getters.getRptId
    },
    methods:{
      /**
       * 程序的入口
       */
      programEntrance(){
        this.getInfo();
        // this.getCollectData();
      },
      loadData(){
        if(this.cardData.Bank){
          Object.keys(this.submitData).map(item=>{
            this.submitData[item] = this.cardData[item]
          });
        }else{
          this.submitData.PayTaxNo='';
          this.submitData.PayPhone='';
          this.submitData.PayAddress='';
          this.submitData.Bank='';
        }
      },
      /**
       * 获取表单信息
       */
      getInfo(){
        GetWaitDrawInvoiceList({ CustomerId: this.$store.getters.getCustomerId}).then(res=>{
          console.log(res)
          let _dataList = []
          if(res.data.success == 1){
            if(res.data.result.length>0){
              res.data.result.map(item=>{
                if(item.BillState == '0'){
                  _dataList.push(item);
                }
              });
              this.OrderList = _dataList;
              this.cardData = this.OrderList[0];
              this.partsList = this.OrderList[0].partsList;
              this.loadData();
            }else{

            }
          }else{
            alert(res.data.result);
          }
        }).catch(error=>{
          alert(error)
        })
      },

      checkData(txt) {
        setTimeout(() => {
          Toast.hide();
          alert(txt);
          this.type = "primary";
          this.disabled = false;
        }, 500);
      },

      /**
       *提交表单
       * */
      submitFromData(){
        let _this = this;
        this.buttonType = "disabled";
        this.submitData.SettlementId = this.$store.getters.getSettlementId;
        this.buttonTitle = "正在提交...";
        this.submitState = true;
        if(!/^(0[0-9]{2,3})([2-9][0-9]{6,7})+([0-9]{1,4})?$/.test(_this.submitData.PayPhone) && ! /^0*(13|15|18|17|19|14|16)\d{9}$/.test(_this.submitData.PayPhone)){
          this.checkData("电话号码不正确！");
          ver();
        }else if(_this.submitData.PayTaxNo == ''){
          this.checkData("识别编号不能为空！");
          ver();
        }else if(_this.submitData.PayAddress == ''){
          this.checkData("地址不能为空！");
          ver();
        }else if(_this.submitData.Bank == ''){
          this.checkData("开户行不能为空！");
          ver();
        }else {
          submit()
        }

        function submit() {
          //补全数据
          {
            _this.submitData.Receivable = _this.cardData.Receivable;
            _this.submitData.OrganizId = _this.cardData.OrganizId;
            _this.submitData.OrganName = _this.cardData.OrganName;
            _this.submitData.SettlementId = _this.cardData.SettlementId;
            _this.submitData.RcvRecordId = _this.cardData.SettlementId;
            _this.submitData.RptRecordNo = _this.cardData.RptRecordNo;
          }

          UserSubmitInvoiceOrder(_this.submitData).then(res=>{
            if(res.data.success == 1){
              alert(res.data.result);
              setTimeout(()=>{
                _this.$router.back();
              },1000);
            }else{
              alert(res.data.result);
              ver()
            }
          }).catch(error=>{
            alert(error);
            ver()
          })
        }

        function ver() {
          _this.buttonTitle = "提交";
          _this.submitState = false;
          _this.buttonType = "primary";
        }
      },

      /**
       * 选择
       * */
      BillTypeCheck(val){
        this.submitData.BillType = val[0].value;
      },
      BillDateCheck(val){
        this.submitData.BillDate = this.dateFormat(val[0].value,val[1].value,val[2].value);
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
      },

      /*
      * 展示卡片列表
      * */
      showCardList(){
        this.showFullScreen = true;
      },

      /**
       * 选择开发票的报修单
       */
      checkOk(index){
        this.cardData = this.OrderList[index];
        this.partsList = this.OrderList[index].partsList;
        this.loadData();
        this.showFullScreen = false;
      }
    },
    watch:{
      showpartsList(newValue,oldValue){
        console.log(newValue)
      }
    }
  }
</script>

<style scoped lang="scss">
  .invoice{
    background: #eee;
    border: 1rem solid #eee;
    header{
      .serverCard {
        background-image: url(../../../static/images/serviceback.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: calc(100% + 70px);
        height: 11.5rem;
        border-radius: 14px;
        margin-left: -35px;
        div{
          padding: 0.6rem 1rem;
          .card-info:active{
            color: #0bb20c;
          }
          ul {
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


        }
      }
    }
    section{
      .user_submit{
        width: 100%;
        margin: 40px auto 0;
      }
      .user_submit:active{
        background: #eeeeee;
        opacity: 0.6;

      }
    }
    .parts_list{
      li:nth-child(odd){
        background: #cee6cf;
      }
      li:nth-child(even){
        background: #ececd7;
      }
    }
  }
  .card-check:active{
    color: #0bb20c;
  }
</style>
