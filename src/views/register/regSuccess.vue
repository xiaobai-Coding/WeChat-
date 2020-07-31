<template>
  <div class="reg-success">
    <h3>{{content}}</h3>
    <md-field class="reg-center">
      <md-detail-item title="机构名称" :content="user.OrgName" bold />
      <md-detail-item title="用户姓名" :content="user.Name" />
      <md-detail-item title="电话号码" :content="user.PhoneNum" />
      <md-detail-item title="审批结果">
        <span style="color:#5878B4;">验证中...请等候</span>
      </md-detail-item>
    </md-field>
    <div class="btn">
      <md-button type="primary" plain @click="closeWindow" style="color: #fff">关闭当前页面</md-button>
    </div>
  </div>
</template>

<script>
import { Field, DetailItem, Button } from "mand-mobile";
export default {
  components: {
    [DetailItem.name]: DetailItem,
    [Field.name]: Field,
    [Button.name]: Button
  },
  name: "Success",
  data() {
    return {
      user: {},
      content: "注册成功"
    };
  },
  mounted() {
    if (this.$store.getters.user) {
      this.user = this.$store.getters.user;
    } else {
      this.content = "注册失败";
    }
  },
  methods: {
    closeWindow() {
     WeixinJSBridge.call("closeWindow");
    }
  }
};
</script>
<style lang="scss" scoped>
.reg-success {
  background: #fff;
  position: relative;
  height: 100%;
  > h3 {
    color: #2225b8;
    text-align: center;
    padding-top: 3rem;
  }
  .btn {
    width: 92%;
    color: #fff;
    margin: 2rem 4%;
  }
}
  .reg-center{
    margin-top: 1rem;
    width: 85%;
    margin-left: 3.5%;
    padding: 1rem!important;
    background: #eee;
  }
</style>

