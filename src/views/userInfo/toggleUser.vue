<template>
<!-- 用户列表 -->
  <div class="toggle-user">
    <ul class="user-list">
      <li v-for="(item,index) in users" :key="index">
        <p style="font-size: 1.3rem;overflow: hidden;white-space:nowrap;text-overflow: ellipsis">{{item.OrgName}}</p>
        <p style="font-size: 1rem">{{item.TrueName}}({{item.Account}})</p>
      </li>
      <li @click="addUser" style="padding-left: 0;">
        <div style="padding-left: 29%">
          <img src="../../../static/images/add.png" alt="" style="width: 2rem;height: 2rem;vertical-align:bottom;">
          <span style="margin-top:13px;padding-left:5px;font-size: 1.5rem;display: inline-block;height: 2rem;line-height: 2rem">申请绑定</span>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
import { Field, RadioList, Toast, Button } from "mand-mobile";
import {GetWeUserAccountList,SysUserChangingOver} from "@/api/userInfo"
export default {
  components: {
    [Field.name]: Field,
    [RadioList.name]: RadioList,
    [Button.name]: Button
  },
  data() {
    return {
      myUser:'',
      users:[],
      url: this.$store.getters.url,
      headers: this.$store.getters.sid,
    };
  },
  created() {
    // this.$store.dispatch("getSid", {
    //   headers: { "ASP.NET_SessionId": this.$route.params.sid.slice(4) }
    // });
    //加载用户列表
    this.weUserAccountList()
  },
  methods: {
    // 用户切换
     // toggleUser() {
    //   if (this.myUser) {
    //    this.btnState = "disabled";
    //    SysUserChangingOver({sysUserId: this.myUser},this.$store.getters.sid).then(res => {
    //         alert("用户切换成功");
    //         setTimeout(() => {
    //           Toast.hide();
    //           WeixinJSBridge.call("closeWindow");
    //         }, 1000);
    //       })
    //       .catch(err => {
    //         alert("请检查您的网络！");
    //       });
    //   } else {
    //     alert("请选择切换账户");
    //   }
    // },
    //请求用户列表
    weUserAccountList(){
      let demoAry = []
      GetWeUserAccountList(this.headers).then(res => {
        res.data.forEach((item,index)=>{
          let DemoObj = {};
          DemoObj['OrgName'] = item.OrgName
          DemoObj['TrueName'] = item.TrueName
          DemoObj['Account'] = item.Account
          demoAry.push(DemoObj)
        })
        this.users=demoAry
        }).catch(err => {
          alert("请检查您的网络！");
      });
    },
    //添加用户
    addUser(){
      this.$router.push({name:'Register'})
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle-user {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

	.toggle-btn{
		margin: $distance-15;
	}
}
  .user-list{

    width: 90%;
    margin: 1rem auto 0;
    /*border: 1px solid #333;*/

    li{
      border-radius: 10px;
      height: 3.5rem;
      padding: 0.5rem 2rem;
      margin-bottom: 1rem;
      border: 1px solid #333;
      background: #eee;
    }
  }
</style>


