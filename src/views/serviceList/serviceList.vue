<template>
    <div class="serviceList">

        <header>

        <span style="border: 0;font-size: 1.2rem;">欢迎您：</span>
        <div style="margin-left: 0;width: calc(100% - 6rem)">
          <div style="width: calc(100% - 4rem)">
            <span style="color: #2a78dc">{{UserName}}</span>
            <span class="userNameSty-jg" style="margin-left: -5px;">&nbsp;-&nbsp;{{OrganName}}</span>
          </div>
          <div v-if="iconShow" @click="changeUser">
            <md-icon name="arrow-down" style="font-size: 14px"></md-icon>
          </div>
          <img src="static/images/sm.png" alt="" style="width: 28px;height: 28px" @click="wxReady">
        </div>
      </header>

      <!--服务页面菜单-->
      <section class="serviceList-nav">
        <!-- <v-loading v-show="Loading"> -->
        <!--报修有关的按钮-->
        <p class="Nav-title">报修列表</p>
        <ul>
          <li  v-for="(item,index2) in ServiceListName" :key="index2" :style="{width:liWidth}" @click="jumpBtn(item.url)"  v-if="showList(item.state)" >
            <div>
              <div v-if="item.num != 0">{{item.num}}</div>
              <img :src="item.icon" alt="">
            </div>
            <p style="color: #333;font-size: 1rem">{{item.name}}</p>
          </li>
          <div style="clear: both"></div>
        </ul>
        <!--与统计有关的-->
        <p class="Nav-title">数据列表</p>
        <ul>
          <li  v-for="(item1,index1) in UserListName" :key="index1" :style="{width:liWidth}" @click="jumpBtn(item1.url)" v-if="showList(item1.state)"  >


            <div>
              <div v-if="item1.num != 0">{{item1.num}}</div>
              <img :src="item1.icon" alt="">
            </div>
            <p style="color: #333;font-size: 1rem">{{item1.name}}</p>
          </li>
          <div style="clear: both"></div>
        </ul>
         <!-- </v-loading> -->
      </section>

      <!--用户列表菜单-->
      <md-picker
        ref="picker1"
        v-model="ListShow"
        :data="userList"
        title="选择用户"
        @confirm="onPickerConfirm"
      ></md-picker>
      <!--用户信息-->

    </div>
</template>

<script>
  import * as api from "@/api/login"
  import { Icon,ActionSheet,Picker,Dialog,Toast } from 'mand-mobile'
  import {GetWeUserAccountList,SysUserChangingOver} from "@/api/userInfo"
  import {GetCustomerList} from "@/api/repairreport";
    export default {
      name: "serviceList",
      data(){
        return{
          Loading: true,
          userAuthorityList:[],//用户权限
          sid:'',
          ListShow:false,//显示用户切换弹框
          pickerValue1: '',
          liWidth:'25%',//li宽度适配比例
          OrganName:'',//机构名称
          UserName:'',//当前登录用户姓名
          userAccountNum:0,//用户数量
          // 报修列表
          ServiceListName:[

            {name:'代客报修', icon:'./static/images/dkbx.png',num:0,url:'report',state:[10,11,12]},
            {name:'待派修', icon:'./static/images/dpx.png',num:0,url:'dispatch',state:[10,11]},
            {name:'待服务', icon:'./static/images/dfw.png',num:0,url:'service',state:[12,11]},
            {name:'待收款', icon:'./static/images/collect.png',num:0,url:'receivableList',state:[10,11]},
            {name:'待回访', icon:'./static/images/dhf.png',num:0,url:'visit',state:[10,11]},
            {name:'待审核', icon:'./static/images/dsh.png',num:0,url:'verify',state:[10,11]},
            {name:'待开票', icon:'./static/images/invoice.png',num:0,url:'invoiceList',state:[10,11]},
            {name:'报修', icon:'./static/images/bx.png',num:0,url:'report',state:[7]},
            {name:'开发票', icon:'./static/images/invoice.png',num:0,url:'invoice',state:[7]},
            {name:'待付款', icon:'./static/images/dzf.png',num:0,url:'空',state:[7]},
            {name:'待评价', icon:'./static/images/dpj.png',num:0,url:'空',state:[7]},
            ],

          UserListName:[
            {name:'设备管理', icon:'./static/images/sbgl.png',num:0,url:'空',state:[7]},
            {name:'软件管理', icon:'./static/images/rjgl.png',num:0,url:'空',state:[7]},
            {name:'人员统计', icon:'./static/images/dsh.png',num:0,url:'statsList',state:[11]},
            {name:'机构统计', icon:'./static/images/dsh.png',num:0,url:'mechainList',state:[11]},
            {name:'报修详情', icon:'./static/images/dsh.png',num:0,url:'statsTable',state:[7]},
            {name:'业绩详情', icon:'./static/images/dsh.png',num:0,url:'statsTable',state:[10,11,12]},
            {name:'在线学习', icon:'./static/images/study.png',num:0,url:'course',state:[0]},
            {name:'应用统计', icon:'./static/images/tj.png',num:0,url:'appRegister',state:[10,11,12]},
            {name:'扫一扫', icon:'./static/images/sm.png',num:0,url:'scan',state:[0]}
          ],
          iconShow:true,//用切换是否显示
          userList: []//用户列表
        }
      },
      components: {
        [Icon.name]: Icon,
        [ActionSheet.name]: ActionSheet,
        [Picker.name]: Picker,
        [Dialog.name]: Dialog,

      },
      beforeCreate () {

      },
      created () {
        this.$loading.show()
      },
      mounted() {
          // this.$loading.show()
        this.sid=this.$store.getters.sid;
        this.getAccountList();// 保存当前用户权限
        // 屏幕适配
        if(window.screen.width < 350){
          this.liWidth = '33.3%';
        };
        this.wxConfig();
        // this.$loading.hide()
      },
      computed:{
        showList(){
          return function(list){
            console.log(list)
            return this.userAuthorityList.find(item=>list.includes(item)) || list.find(item=>this.userAuthorityList.includes(item))


          }
        },
      },
      /**
       * onPickerConfirm  用户菜单确定事件
       * changeUser 切换用户
       * jumpBtn  页面跳转(name:路由地址)
       * getAccountList  获取用户列表
       * toggleUser  切换用户函数(value:用户id)
       * saveAccount   保存切换后的权限
       * userAuthority  保存用户权限
       * **/
      methods:{
         delay(){
            setTimeout(() => {
                this.Loading = false;
            }, 300);
        },
        userAuthority(data){
          console.log(data)
          let _this = this;
          // 为统计页面保存权限数据
          let objDemo = {};
          if(data.OrgName == '陕西长通科技有限公司'){
            objDemo['title'] = '服务公司';
            objDemo['id'] = data.SysUserId;
            console.log(objDemo)
            this.$store.dispatch('saveDetailCondition',objDemo)
          }else{
            objDemo['title'] = '检测站';
            GetCustomerList({ key: data.OrgName }).then(res=>{
                    console.log(res)
              if(res.data.success == 1 && res.data.result.length != 0){
                objDemo['id'] = res.data.result[0].value;
                console.log(objDemo)
                //用户提交发票的页面需要
                _this.$store.dispatch('saveCustomerId',res.data.result[0].value);

              }else {
                alert('统计列表权限保存失败请联系客服人员')
              }
            })
            this.$store.dispatch('saveDetailCondition',objDemo)

          }

          //........
          let userAut = [];
          data.RoleList.forEach((item,index)=>{
            userAut.push(item.roleid)
          })
          console.log(userAut)
          this.userAuthorityList = userAut
          console.log(this.userAuthorityList )
        },
        saveAccount(){
          GetWeUserAccountList(this.sid).then(data => {
            let userAccount = JSON.stringify(data.data);
            localStorage.setItem('userAccount',userAccount);
            this.userAuthority(data.data[0])
          })
        },
        getAccountList(){
        //  this.$loading.show()
          let demoArry = [];
          GetWeUserAccountList(this.sid).then(data => {
            console.log(data);
             this.$loading.hide()

            //判断是否显示切换用户按钮
            this.userAccountNum = data.data.length;
            console.log(data)
            if(this.userAccountNum == "1"){
              this.iconShow = false
            }else{
              this.iconShow = true
            }

            let userAccount = JSON.stringify(data.data);
            localStorage.setItem('userAccount',userAccount);

            data.data.forEach((item,index)=>{
              let demoObj = {};
              demoObj["text"] = item.OrgName;
              demoObj["value"] = item.SysUserId;
              demoArry.push(demoObj)
            });

            this.UserName = data.data[0].TrueName;//用户性姓名
            this.OrganName = data.data[0].OrgName;//机构名称
            this.userList.push(demoArry)
            this.userAuthority(data.data[0])
            this.delay()

          });
        },
        onPickerConfirm(value) {
          this.OrganName = value[0].text;
          this.toggleUser(value[0].value)
        },
        changeUser(){
          if(this.userAccountNum == 1){
            return
          }else {
            this.ListShow = true;
          }
        },

        jumpBtn(name){
          console.log(name)
          if(name == '空'){
            alert('操作失败');
            alert('功能暂未开通');
          }else {
            this.$router.push({name:name})
          }
        },

        toggleUser(value) {
          SysUserChangingOver({sysUserId: value},this.sid).then(res => {
           if(res.data.success == 1){
             Dialog.succeed({
               title: res.data.result,
               confirmText: '确定',
               onConfirm: () => this.saveAccount(),
             })
           }else{
             Dialog.failed({
               title: 'res.data.result',
               confirmText: '确定',
               onConfirm: () => this.ListShow = true,
             })
           }
          })
            .catch(err => {
              alert("请检查您的网络！");
            });
        },

        wxConfig(){
          api.getWxConfig().then(res=>{
            // alert(location.href.split('#')[0])
            // alert("api ---------->" + JSON.stringify(res.data));
            wx.config({
              debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              // debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId : res.data.appId, // 必填，公众号的唯一标识
              timestamp : res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr : res.data.noncestr, // 必填，生成签名的随机串
              // HoagFKDcsGMVCIY2vOjf9qouw7aKQuY26FPYplceP_J8Q0c5AWYlryiwI3egL_aDDZcPov0f1RZXNprU-fejnw

              signature :res.data.signature,// 必填，签名，见附录1
              jsApiList: ['scanQRCode']
            });
            wx.ready(function() {
              wx.checkJsApi({
                jsApiList : ['scanQRCode'],
                success : function(res) {

                }
              });
            });

            wx.error(function (res) {
              alert("error的错误------->" + JSON.stringify(res))
            })
          })

        },

        wxReady(){
          wx.scanQRCode({
            needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType : [ "qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success : function(res) {
              alert("scanQRCode.success------------->" + JSON.stringify(res))
            },
            error : function(){

            }
          });
        },

      }
    }
</script>

<style scoped lang="scss">
  .serviceList{
    background: white;
  }
  .Nav-title{
    font-weight: bold;
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
  }
  header{
    padding-top: 0.5rem;
    font-size: 1.2rem;
    margin-left: 0.7rem;
    margin-bottom: 1rem;
    .userNameSty-jg{
      width: calc(100% - 3.7rem);
      overflow: hidden;
      white-space:nowrap;
      text-overflow: ellipsis
    }
    span{
      height: 2.2rem;
      line-height: 2.7rem;
      display: inline-block;
      vertical-align: bottom;
      border-bottom: 1px solid #e5e5e5;
      display: inline-block;
    }
    div{
      display: inline-block;
      vertical-align: bottom;
      line-height: 2px;
      margin-left: 0.3rem;
    }
  }
  .serviceList-nav{
    width: 100%;
    li{
      float: left;
      margin-bottom: 1.5rem;
      div{
        width:2.8rem;
        height:3.1rem;
        /*border: 1px solid black;*/
        margin: 0 auto;
        position: relative;
        div{
          font-size: 0.8rem;
          font-weight: bolder;
          color: white;
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 50%;
          background: red;
          text-align: center;
          line-height: 1.1rem;
          position: absolute;
          top: -0.5rem;
          right: -1.2rem;
        }
        img{
          width: 2.8rem;
          height: 2.8rem;
        }
      }
      p{
        width: 100%;
        text-align: center;
        font-size: 1.1rem;
      }
    }
  }
    // ----------------------------

       #Loading {
        top:50%;
        left:50%;
        position: absolute;
        -webkit-transform: translateY(-50%)  translateX(-50%);
        transform: translateY(-50%)  translateX(-50%);
        z-index:100;
      }
      @-webkit-keyframes ball-beat {
        50% {
          opacity: 0.2;
          -webkit-transform: scale(0.75);
          transform: scale(0.75); }

        100% {
          opacity: 1;
          -webkit-transform: scale(1);
          transform: scale(1); } }

      @keyframes ball-beat {
        50% {
          opacity: 0.2;
          -webkit-transform: scale(0.75);
          transform: scale(0.75); }

        100% {
          opacity: 1;
          -webkit-transform: scale(1);
          transform: scale(1); } }

      .ball-beat > div {
        background-color: #279fcf;
        width: 15px;
        height: 15px;
        border-radius: 100% !important;
        margin: 2px;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
        -webkit-animation: ball-beat 0.7s 0s infinite linear;
        animation: ball-beat 0.7s 0s infinite linear; }
      .ball-beat > div:nth-child(2n-1) {
        -webkit-animation-delay: 0.35s !important;
        animation-delay: 0.35s !important; }

</style>
