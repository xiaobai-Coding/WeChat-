<!--登录页面-->
<template>
<div class='test1'>
        <!-- <md-input-item
        ref="user.username"
        title="用户名"
        v-model="user.username"
        is-title-latent
        clearable
        placeholder="请输入用户名"></md-input-item>
        <md-input-item
        ref="user.password"
        v-model="user.password"
        title="密码"
        is-title-latent
        clearable
        type="password"
        placeholder="请输入密码"></md-input-item> -->
<div id="loadingToast" v-if="toast">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">正在登录中</p>
    </div>
</div>

<div class="login-content">
    <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">用户名</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input" type="username"  placeholder="请输入用户名" name="username" v-model="user.username"/>
            </div>
        </div>
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入密码" name="password" v-model="user.password"/>
            </div>
        </div>
    <div class="weui-btn-area"  @click="login">
        <a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">确定</a>
    </div>
</div>

<div v-if="isshow">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
        <div class="weui-dialog__hd"><i :class="[isSuccess?successImg:failImg]"></i><strong class="weui-dialog__title">提示</strong></div>
        <div class="weui-dialog__bd">{{successMsg}}</div>
        <div class="weui-dialog__ft" @click="dialogConfirm">
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" >确定</a>
        </div>
    </div>
</div>
        <!-- <md-button type="primary">登陆</md-button> -->
</div>
</template>

<script>
import { InputItem, Button,Dialog} from "mand-mobile";
import {login} from '@/api/login'
export default {
name: 'Test1',
components: {
     [InputItem.name]: InputItem,
     [Button.name]: Button,
     [Dialog.name]: Dialog,
},
data() {
    return {
        user:{
            username:'sxct.tjd',
            password:'ctkj888'
        },
        isshow:false,
        successMsg:'',
        sid:'',
        isSuccess:false,
        successImg:'weui-icon-success',
        failImg:'weui-icon-warn',
        toast:false
    };
},
methods: {
    login(){
        this.toast=true
        login(this.user).then((data)=>{
             this.isSuccess=(data.data.success=='1')
          console.log(data)
            if(this.isSuccess){
            //   admin 为管理员账户  0
            //   sxszj.admin 为客户经理账户  1
            //   test  工程师账户   2
            //   zzs 为财务账户   3
            //   xaxy.admin  为检测站用户  4
            //   if(this.user.username == 'admin'){
            //     this.$store.state.powerAccount = 0
            //   }else if(this.user.username == 'sxszj.admin'){
            //     this.$store.state.powerAccount = 1
            //   }else if(this.user.username == 'test'){
            //     this.$store.state.powerAccount = 2
            //   }else if(this.user.username == 'zzs'){
            //     this.$store.state.powerAccount = 3
            //   }else if(this.user.username == 'xaxy.admin'){
            //     this.$store.state.powerAccount = 4
            //   }
              this.sid=data.data.sid
              this.succeedConfirm(data.data.sid)
            }else{
                this.failedConfirm(data.data.result)

            }
        })
    },
     succeedConfirm(sid) {
         this.toast=false
         this.successMsg='恭喜您，登录成功！'
         this.isshow=true;

    //    Dialog.succeed({
    //     title: '成功',
    //     content: '恭喜您登陆成功',
    //     confirmText: '确定',
    //     onConfirm: () =>{
    //         this.$store.dispatch("getSid", sid);
    //         this.$router.push({path:"/t"})
    //     },
    //   })
    },
    dialogConfirm(){
        if(this.isSuccess){
            this.$store.dispatch("getSid", this.sid);
            this.$router.push({path:"/t"})
        }else{
            this.user.username='';
            this.user.password=''
        }
       this.isshow=false;
    },
     failedConfirm(msg) {
          this.toast=false;
          this.successMsg=msg;
          this.isshow=true;
    //   Dialog.failed({
    //     title: '失败',
    //     content: '登陆失败，请稍后重试',
    //     confirmText: '确定',
    //     onConfirm: () =>{
    //         console.log("登陆失败")
    //     },
    //   })
    },
},
mounted() {
console.log(1)
},
}
</script>
<style scoped>
.test1{
    padding: 60px;
    margin-top:25%;
}
.md-button{
    margin-top: 100px!important;
}
</style>
