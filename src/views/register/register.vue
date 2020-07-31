<!-- 根据检测机构的名称以及姓名手机号进行注册 -->
<template>
  <div class="register">
    <div class="fill_center">
      <header>
        <img src="../../../static/images/wx_app.jpg">
      </header>
      <md-field style="margin-top:20px;">
        <div><img src="../../../static/images/jg_icon.png" alt="" style="width:13px;float:left;margin:19px 18px;"><md-input-item class="user_input" ref="orgName"  placeholder="输入机构全称" is-title-latent clearable  v-model="OrgName"></md-input-item></div>
        <div><img src="../../../static/images/yh_icon.png" alt="" style="width:13px;float:left;margin:19px 18px;"><md-input-item class="user_input" ref="name" placeholder="输入真实姓名" is-title-latent clearable  v-model="Name"></md-input-item></div>
        <div><img src="../../../static/images/dh_icon.png" alt="" style="width:10px;float:left;margin:18px 18px;"><md-input-item class="user_input" type="phone"  placeholder="请输入手机号码" value="" is-title-latent clearable  v-model="PhoneNum"></md-input-item></div>
      </md-field>
       <div class="reg-btn">
        <md-button type="primary" :inactive="disabled" @click="toRegister">{{btnTxt}}</md-button>
      </div>
    </div>
    <p class="waring" v-show="isRegister">申请记录审核中，请勿重复注册！</p>
  </div>
</template>

<script>
import { InputItem, Field, Button, Toast } from "mand-mobile";
import {GetWeUserRegisterRequest,UserRegister} from "@/api/register"
export default {
  name: 'Register',
  data() {
    return {
      Name: "",
      OrgName: "",
      PhoneNum: "",
      btnTxt: "点击注册",
      disabled: false,
      isRegister: false
    };
  },
  mounted() {
	 //判断是否已经注册，若是已经注册且没有通过核审就不能再一次注册
    this.weUserRegisterRequest()
  },
  methods: {
    //用户注册，每个用户只能注册一次，且不能重复注册
    toRegister() {
      if (!this.Name) {
        alert("用户名不能为空");
      } else if (!this.OrgName) {
        alert("机构名不能为空");
      } else if (!this.PhoneNum) {
        alert("电话号码不能为空");
      } else if (this.PhoneNum.length != 11) {
        alert("电话号码不正确");
      } else {
        let data = {
          OrgName: this.OrgName,
          Name: this.Name,
          PhoneNum: this.PhoneNum
        };
        let self = this;
        this.$store.dispatch("getUser", data);

        this.disabled = true;
        UserRegister(data,this.$store.getters.sid).then(res => {
            if (res.data.success == 1) {
              alert("注册成功");
                setTimeout(() => {
                    Toast.loading("注册中");
                    setTimeout(() => {
                      Toast.hide();
                      self.$router.push({ name: "regsuccess" });
                    }, 500);
                  }, 1000);
            } else {
              alert("注册失败");
            }
          })
          .catch(err => {
            this.disabled = false;
          });
      }
    },
    //获取注册信息
    weUserRegisterRequest(){
    GetWeUserRegisterRequest({ datas:{reviewResult: "0"},sid:this.$store.getters.sid })
     .then(res => {
        if(res.data.length > 0){
          this.disabled = true;
          this.isRegister = true;
        }else{
          this.disabled = false;
          this.isRegister = false;
        }
      })
      .catch(err => {});
    },

  },
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Button.name]: Button
  }
};
</script>

<style lang="scss" >
.register {
  width: 100%;
  height: 370px;
  background: #1aad19;
  position: relative;
  header {
    img {
      width: 100%;
    }
  }
  .reg-btn {
    margin-top:3rem;
  }
  .waring{
    color: red;
    padding: 0.5rem 0;
    text-align: center;
  }
}
.fill_center{
  position: absolute;
  width: 90%;
  left: 5%;
  top: 4rem;
}
.md-field{
  padding:0!important;
  background: #fff;
}
.user_input{
  border: 1px solid #eee;
  padding-top: -20px;
  height: 110px;
  font-size: 1.2rem;
  margin-top: 1rem;
  border-radius: 8px;
  width:100%;
}
.user_input .md-field-item-content{
  padding: 0!important;
  margin-top: -12px!important;
}
#app{
  background: #fff;
}

</style>
