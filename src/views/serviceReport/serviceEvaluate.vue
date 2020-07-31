<!--  -->
<template>
  <div class='serviceEvaluate'>
        <md-field style="margin-top: 0.625rem;">
        <div style="font-size: 1.125rem;border-bottom: 0.0625rem dotted; ">用户意见</div>
            <md-field-item title="技术水平" solid>
                <md-radio name="高" v-model="Technical" label="高" inline />
                <md-radio name="中" v-model="Technical" label="中" inline />
                <md-radio name="低" v-model="Technical" label="低" inline />
            </md-field-item>
            <md-field-item title="服务态度" solid>
                <md-radio name="好" v-model="Requiements" label="好" inline />
                <md-radio name="一般" v-model="Requiements" label="一般" inline />
                <md-radio name="差" v-model="Requiements" label="差" inline />
            </md-field-item>
            <md-input-item solid title="建议及要求" align="right" arrow="arrow-right" readonly />
            <div class="ct-textarea">
              <textarea name="condition" placeholder="请输入建议或要求" rows="5" v-model.trim="Attitude"></textarea>
            </div>
        </md-field>
        <md-field>
            <md-field-item name="name" title="签字日期" arrow="arrow-right" align="right" :content="SignDate" @click.native="isSignShow = true"></md-field-item>
            <md-input-item solid title="签字人" placeholder="请输入签字人姓名" align="right" v-model.trim="SignBy" />
            <md-input-item solid type="phone" title="手机号" placeholder="请输入签字人电话号码" align="right" v-model.trim="Telephone" />
        </md-field>
        <div class="confirm">
            <md-button type="primary" :disabled="disabled" @click="postData">保存</md-button>
        </div>
        <md-date-picker v-model="isSignShow" type="custom" title="选择签字日期" :custom-types="['yyyy', 'MM','dd']" :default-date="currentDate" @confirm="onSignDate"></md-date-picker>
  </div>
</template>

<script>
import {
  Field,
  FieldItem,
  InputItem,
  DatePicker,
  Button,
  Toast,
  Radio 
  } from "mand-mobile";
export default {
name: 'serviceEvaluate',
components: {
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [DatePicker.name]: DatePicker,
    [Button.name]: Button,
    [Radio.name]: Radio,
},
data() {
  return {
        AssRecordId: this.$store.getters.recordId,//只有在获取到派修id才能提交
        SignBy: "", //签字人
        SignDate: "", //签字时间
        Telephone: "", // 签字人电话
        Attitude: "", //用户评价
        Technical: "高", //技术水平  高中低
        Requiements: "好", //服务态度  好 一般 差
        currentDate: new Date(),
        isSignShow: false,
        url: this.$store.getters.url,
        headers: this.$store.getters.sid,
        disabled: false,
        type: "primary",

  };
},
methods: {
    formatDate(data, name) {
      let month, day, hour, minute;
      if (data[1].value < 10) {
        month = "0" + data[1].value;
      } else {
        month = data[1].value;
      }
      if (data[2].value < 10) {
        day = "0" + data[2].value;
      } else {
        day = data[2].value;
      }
      if (name === "SignDate") {
        return  data[0].value + "-" + month + "-" + day;
      } else {
        if (data[3].value < 10) {
          hour = "0" + data[3].value;
        } else {
          hour = data[3].value;
        }
        if (data[4].value < 10) {
          minute = "0" + data[4].value;
        } else {
          minute = data[4].value;
        }
        return (
          data[0].value + "-" + month + "-" + day + " " + hour + ":" + minute
        );
      }
    },
    onSignDate(data) {
      this.SignDate = this.formatDate(data, "SignDate");
    },
    postData(){
      if (!this.SignBy) {
          alert("签字人不能为空！");
      } else if (!this.SignDate) {
          alert("签字日期不能为空！");
      } else if (!this.Telephone) {
         alert("签字人电话不能为空！");
      }else if (!(/^1[3456789]\d{9}$/.test(this.Telephone))) {
          alert("电话格式不正确！");
      }else{
        let data={
            AssRecordId: this.AssRecordId,
            SignBy: this.SignBy, //签字人
            SignDate:this.SignDate, //签字时间
            Telephone:this.Telephone, // 签字人电话
            Attitude:this.Attitude, //用户评价
            Technical: this.Technical, //技术水平  高中低
            Requiements: this.Requiements, //服务态度  好 一般 差
        }
        this.$router.back();
      }
   }
},
mounted() {
//如果当前客户已经评价过，是否需要再次评价，评价的内容应该一次性不能修改
},
}
</script>
<style lang='scss' scoped>
.serviceEvaluate{
   	margin: 0.9375rem;
      .ct-textarea {
        > textarea {
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        border: 1px solid #eee;
        font-size: 0.9rem;
        color: #666;
        outline: none;
        }
  }
  .confirm{
      margin: 0.9375rem 0;
  }
}

</style>