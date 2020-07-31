<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="dispatch-order">
      <div class="dispatch-info">
        <md-field>
          <md-field-item solid title="报修人员" disabled>
            <span slot="right" style="font-size: 1rem">{{this.$route.params.RecordBy}}</span>
          </md-field-item>
          <md-field-item solid title="服务人员" :arrow="servicerName == ''" @click="onClick">
            <span slot="right" style="font-size: 1rem">{{servicerName}}</span>
          </md-field-item>
          <md-field-item solid title="服务方式" :arrow="ServiceType == ''" @click="isSelectorShow = true">
            <span slot="right" style="font-size: 1rem">{{ServiceType}}</span>
          </md-field-item>
          <md-field-item name="name" title="计划日期" :arrow="PlanDate == ''" align="right" @click.native="isDatePickerShow = true">
            <span slot="right" style="font-size: 1rem">{{PlanDate}}</span>
          </md-field-item>
          <md-input-item solid type="number" title="计划工时" placeholder="请输入计划工时" align="right" v-model.trim="PlanHours">
            <span slot="right">小时</span>
          </md-input-item>
          <div class="ct-textarea">
            <header>备注</header>
            <textarea name="Mark" placeholder="请输入其他情况说明" rows="7" v-model.trim="Mark" style="font-size:1rem"></textarea>
          </div>
        </md-field>
        <div class="confirm">
          <md-button type="primary" @click="postData">保存</md-button>
        </div>
      </div>

      <transition type="transition" appear enter-active-class="animated bounceInLeft active" leave-active-class="animated bounceOutRight active" appear-class="animated bounceInLeft" :duration="{enter: 500, leave: 500}">
        <!--服务人员列表-->

        <div class="dispatch-person" v-show="isServicerShow">
          <!--<md-field style="border: 1rem solid #fff">-->
            <!--<md-check-list :options="servicers" v-model="ServicePersonal" />-->
            <md-check-group v-model="ServicePersonal" v-for="(item,index) in servicers" :key="index">
              <md-check-box :name="item.value">{{item.label}}</md-check-box>
            </md-check-group>
          <!--</md-field>-->

          <!--<div style="position: absolute;bottom: 48px;width: 100%;">-->
            <!--<span v-for="(item1,index1) in ServicePersonal" :key="index1">{{item1}}</span>-->
          <!--</div>-->
          <div class="comfirm" style="z-index: 999">
            <md-button @click.native="check" type="primary" style="height: 3rem;font-size: 1.2rem;">确定</md-button>
          </div>
        </div>
      </transition>

      <!--弹框-->
      <md-selector v-model="isSelectorShow" :data="serviceTypes" cancel-text title="服务方式" @choose="onSelectorChoose"></md-selector>
      <md-date-picker ref="datePicker" :min-date="minDate" v-model="isDatePickerShow" type="custom" title="选择计划日期" :custom-types="['yyyy', 'MM','dd']" :default-date="currentDate" @confirm="onDatePickerConfirm"></md-date-picker>
    </div>
  </transition>
</template>

<script>
import {
  Selector,
  Field,
  FieldItem,
  InputItem,
  CheckList,
  DatePicker,
  Button,
  Toast,
  CheckBox,
  CheckGroup,
} from "mand-mobile";
import {GetServicePersonList,CreateAss} from "@/api/dispatchreport"
export default {
  components: {
    [Selector.name]: Selector,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [CheckList.name]: CheckList,
    [DatePicker.name]: DatePicker,
    [Button.name]: Button,
    [CheckBox.name]: CheckBox,
    [CheckGroup.name]: CheckGroup,
  },
  data() {
    return {
      RptRecordId: "",
      isServicerShow: false,
      isSelectorShow: false,
      serType: "",
      ServicePersonal: [],
      servicerName: "",
      servicers: [],
      serviceTypes: [
        {
          value: "0",
          text: "现场"
        },
        {
          value: "1",
          text: "远程服务"
        },
        {
          value: "2",
          text: "退回"
        },
        {
          value: "3",
          text: "销售"
        },
        {
          value: "4",
          text: "公司"
        },
        {
          value: "5",
          text: "返厂"
        },
        {
          value: "6",
          text: "快递"
        },
        {
          value: "7",
          text: "其他"
        }
      ],
      minDate: new Date(2010/1/1),
      currentDate: new Date(),
      PlanHours: "",
      PlanDate: "",
      isDatePickerShow: false,
      ServiceType: "",
      Mark: "",
      url: this.$store.getters.url,
      headers: this.$store.getters.sid
    };
  },
  created() {
    this.servicePersonList()
    this.RptRecordId = this.$store.getters.recordId;
  },
  mounted(){
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.PhoneBack, false);//false阻止默认事件
    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.PhoneBack, false);//false阻止默认事件
  },
  computed: {
    getData() {
      let data = {
        ServicePersonal: this.ServicePersonal.join(","),
        ServiceType: this.ServiceType,
        PlanDate: this.PlanDate,
        PlanHours: this.PlanHours,
        Mark: this.Mark,
        RptRecordId: this.RptRecordId
      };
      return data;
    }
  },
  methods: {
    /**
     * 监听返回键
     */
    PhoneBack(){
      this.$router.back()
    },
    // 确定
    check() {
      this.servicerName = "";
      let box = [];
      for (let s of this.servicers) {
        for (let p of this.ServicePersonal) {
          if (s.value == p) {
            box.push(s.label);
          }
        }
      }
      this.servicerName = box.join(",");
      this.isServicerShow = false;
    },
    onClick() {
      this.isServicerShow = true;
    },
    onServiceStyle() {},
    onDatePickerConfirm(data) {
      let month, day;
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
      this.PlanDate = data[0].value + "-" + month + "-" + day;
    },
    onSelectorChoose(data) {
      this.ServiceType = data.text;
    },
    // 保存
    postData() {
      if (!this.getData.ServicePersonal) {
        alert("服务人员不能为空！");
      } else if (!this.getData.ServiceType) {
        alert("服务方式不能为空！");
      } else if (!this.getData.PlanDate) {
        alert("计划日期不能为空！");
      } else if (!this.getData.PlanHours) {
        alert("计划工时不能为空！");
      } else {
        Toast.hide();
        CreateAss( this.getData,this.$store.getters.sid).then(res => {
            if (res.data.success == 1) {
              alert("保存成功");
              this.$router.push({
                name:'dispatch',
                params:{
                  actOder:'刷新'
                }
              })
            } else {
              alert(res.data.result);
            }
          })
          .catch(err => {
            alert("连接失败，请检查您的网络！");
          });
      }
    },
      servicePersonList(){
   GetServicePersonList(this.$store.getters.sid).then(res => {
      if (res.data.success == 1) {
          this.servicers = res.data.result;
        } else {
          alert(res.data.result);
        }
    }).catch(err => {
      alert("连接失败，请检查您的网络！");
    });
  }
  }

};
</script>


<style lang="scss" scoped>
  .md-check-group{
    float: left;
    width: 22%;
    margin-right: 0.53rem;
    .md-check-box{
      width: 100%;
    }
  }
.dispatch-order {
  background: $bg-color;
  margin: 0!important; ;
  border: 1rem solid #eee;
  position: relative;
  height: 100%;
  .dispatch-info {
    border: 0.7rem solid #fff;
    display: flex;
    flex-direction: column;
  }
  .ct-textarea {
    > header {
      padding: 1rem 0;
      font-weight: bolder;
    }
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
  .dispatch-person {
    /*border: 0.7rem solid #fff;*/
	  background:$bg-color;
    position: absolute;
    top: 0;
    z-index: 10;
    left: auto;
    height: 100%;
    width: 100%;
    .comfirm {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3rem;
    }
  }

  .md-field{
    margin: 0;
    border: 1rem solid #fff;
    padding: 0!important;
  }
}
</style>
