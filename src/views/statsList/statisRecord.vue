<template>
    <div class="statisRecord">
      <nav @click="backBtn">
        <md-icon name="arrow-left" size="lg" style="font-size: 1.4rem;color: #333;"></md-icon>
        <p style="font-size:1rem;display: inline-block;height: 1.4rem;line-height: 1.4rem;vertical-align: top;margin-left: 10px">账单详情</p>
      </nav>
      <div class="Record-title" v-if="isShow">
        <p style="font-size: 2.2rem">{{userData.receivable}}</p>
        <p style="height: 1.4rem;color: #0bb20c" v-if="userData == '-1.00'">付款成功</p>
        <p style="height: 1.4rem;color: crimson" v-if="userData != '-1.00'">未付款</p>
      </div>
      <div class="Record-title" v-if="!isShow">
        <p style="font-size: 2.2rem">{{userData.serviceHours}}<span style="font-size: 1rem">(小时)</span></p>
        <p style="height: 1.4rem;color: #0bb20c" v-if="userData == '-1.00'">订单已付款</p>
        <p style="height: 1.4rem;color: crimson" v-if="userData != '-1.00'">订单未付款</p>
      </div>

      <!--机构界面-->
      <ul class="Record-ul" v-if="isShow">
        <li>
          <span class="recordUl-title">付款方式</span>
          <span class="recordUl-value">转账</span>
        </li>
        <li>
          <span class="recordUl-title">订单号</span>
          <span class="recordUl-value">{{userData.pptRecordId}}</span>
        </li>
        <li style="height: 3rem">
          <span class="recordUl-title">报修问题</span>
          <span class="recordUl-value just-value">{{userData.problem}}</span>
        </li>
        <li>
          <span class="recordUl-title">创建时间</span>
          <span class="recordUl-value">{{userData.recordDate}}</span>
        </li>
        <li>
          <span class="recordUl-title">服务人员</span>
          <span class="recordUl-value">{{userData.recordBy}}</span>
        </li>
        <li>
          <span class="recordUl-title">服务时间</span>
          <span class="recordUl-value">{{userData.serviceHours}}小时</span>
        </li>
        <li>
          <span class="recordUl-title">减免金额</span>
          <span class="recordUl-value">{{userData.noPrice}}元</span>
        </li>
        <li>
          <span class="recordUl-title">费用详情</span>
          <span class="recordUl-value" @click="propShow">详情</span>
        </li>
        <li>
          <span class="recordUl-title">评价</span>
          <span class="recordUl-value">{{userData.attitude}}</span>
        </li>
      </ul>
      <ul class="Record-customer" v-if="isShow">
        <li>
          <span class="recordUl-title">客服电话</span>
          <span class="recordUl-value"><a href="tel:029-86690063">029-86690063</a></span>
        </li>
        <div style="clear: both"></div>
      </ul>

      <!--服务人员界面-->
      <ul class="Record-ul" v-if="!isShow">
        <li>
          <span class="recordUl-title">订单编号</span>
          <span class="recordUl-value">{{userData.rptRecordId}}</span>
        </li>
        <li>
          <span class="recordUl-title">联系人</span>
          <span class="recordUl-value">{{userData.rptContactBy}}</span>
        </li>
        <li>
          <span class="recordUl-title">创建时间</span>
          <span class="recordUl-value">{{userData.recordDate}}</span>
        </li>
        <li style="height: 3rem">
          <span class="recordUl-title">报修问题</span>
          <span class="recordUl-value just-value">{{userData.problem}}</span>
        </li>
        <li>
          <span class="recordUl-title">派修人员</span>
          <span class="recordUl-value">{{userData.recordBy}}</span>
        </li>
        <li>
          <span class="recordUl-title">服务时间</span>
          <span class="recordUl-value">{{userData.serviceDate}}</span>
        </li>
        <li>
          <span class="recordUl-title">费用</span>
          <span class="recordUl-value" @click="propShow">{{userData.receivable - userData.noPrice}}元<md-icon name="arrow-right" size="md"></md-icon></span>
        </li>
      </ul>

      <md-popup v-model="isPopupShow">
        <ul class="costList">
          <li>
            <i class="iconfont icon-lingpeijianweixiu" style="font-size: 1rem;margin-right: 5px"></i>
            <span>配件费</span>
            <span style="float: right">￥{{userData.partsPrice}}</span>
          </li>
          <li>
            <i class="iconfont icon-weixiu" style="font-size: 1rem;margin-right: 5px"></i>
            <span>维修费</span>
            <span style="float: right">￥{{userData.checkPrice}}</span>
          </li>
          <li>
            <i class="iconfont icon-banyunfei" style="font-size: 1rem;margin-right: 5px"></i>
            <span>运费</span>
            <span style="float: right">￥{{userData.runPrice}}</span>
          </li>
          <li>
            <i class="iconfont icon-jiaotong" style="font-size: 1rem;margin-right: 5px"></i>
            <span>交通费</span>
            <span style="float: right">￥{{userData.jtPrice}}</span>
          </li>
          <li>
            <i class="iconfont icon-zhusu" style="font-size: 1rem;margin-right: 5px"></i>
            <span>住宿费</span>
            <span style="float: right">￥{{userData.zsPrice}}</span>
          </li>
          <li>
            <i class="iconfont icon-qita" style="font-size: 1rem;margin-right: 5px"></i>
            <span>其他</span>
            <span style="float: right">￥{{userData.otherPrice}}</span>
          </li>
        </ul>
      </md-popup>
    </div>
</template>

<script>
  import { Icon,Popup } from 'mand-mobile'
  export default {
    name: "statisRecord",
    components:{
      [Icon.name]:Icon,
      [Popup.name]:Popup,
    },
    data(){
      return{
        state:true,//是否付款
        isShow:true,
        isPopupShow:false,
        userData:{}
      }
    },
    mounted(){
      this.identityJudgment();//身份判定

    },
    /**
     * backBtn  返回
     * identityJudgment  身份认证
     * propShow  费用详情
     */
    methods:{
      identityJudgment(){
        if(this.$store.getters.getdetailCondition.title == '检测站'){
          this.isShow = true
        }else{
          this.isShow = false
        }
        this.userData = JSON.parse(this.$route.query.data)
        console.log(this.userData)
      },
      propShow(){
        this.isPopupShow = true;
      },
      backBtn(){
        this.$router.back()
      }
    }
  }

</script>

<style scoped>
  .statisRecord{
    background: #fff;
  }
  nav{
    padding-left: 20px;
    padding-top: 30px;
    height: 2.3rem;
    border-bottom: 1px solid #eee;
  }
  .Record-title{
    height: 6rem;
    padding-top: 1.5rem;
  }
  .Record-title p{
    margin: 0 auto;
    height: 3rem;
    width: 50%;
    text-align: center;
  }
  .Record-ul{

  }
  .Record-ul li{
    padding: 0.5rem 0.5rem;
    height: 2rem;
  }
  .Record-ul li span{
    height: 2rem;
    line-height: 2rem;
  }
  .recordUl-title{
    float: left;
    color: #7f7f7f;
    display: inline-block;
    width: 5rem;
  }
  .recordUl-value{
    float: left;
    width: calc(100% - 5rem);
    text-align: right;
    display: inline-block;
  }
  .just-value{
    height: 3rem;
    overflow:hidden;
    display:-webkit-box;
    text-overflow:ellipsis;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    white-space:normal;
  }
  .Record-customer{
    border-top: 1rem solid #eee;
    border-bottom: 1px solid #eee;
  }
  .Record-customer li{
    height: 2rem;
    padding: 0.5rem;
  }
  .Record-customer li span{
    height: 2rem;
    line-height: 2rem;
  }
  .costList{
    width: 14rem;
    height: 15.85rem;
    background: white;
    border-radius: 10px;
  }
  .costList li{
    padding: 0.5rem;
    border-bottom: 1px solid #e1e1e1;
  }
</style>
