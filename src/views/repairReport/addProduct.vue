<!-- 报修添加：添加产品，保存在状态管理 -->
<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="products">
      <div style="border: 1.5rem solid black;background: gold">
        <md-field style="border: 1px solid black">
          <md-input-item title="产品名称" placeholder="输入产品名称" v-model="productName"></md-input-item>
          <md-input-item title="产品编号" v-model="productNo" placeholder="输入产品编号"></md-input-item>
          <md-field-item title="生产日期" solid placeholder="选择生产日期" arrow="arrow-right" :content="mfgDate" @click.native="isDatePickerShow = true">
          </md-field-item>
          <md-input-item title="规格型号" v-model="Model" placeholder="输入规格型号"></md-input-item>
          <md-input-item title="备注" placeholder="输入情况说明" v-model="mark"></md-input-item>
        </md-field>
        <md-date-picker ref="start" v-model="isDatePickerShow" type="custom" title="请选择时间" :custom-types="['yyyy', 'MM','dd']" :default-date="defaultDate" @confirm="getDate"></md-date-picker>
      </div>
      <div class="save">
        <md-button :type="type" :disabled="disabled" @click="addProduct">{{btnTxt}}</md-button>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  InputItem,
  Field,
  Button,
  Toast,
  DatePicker,
  FieldItem
} from "mand-mobile";
export default {
  name: "addProduct",
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Button.name]: Button,
    [DatePicker.name]: DatePicker,
    [FieldItem.name]: FieldItem
  },
  data() {
    return {
      productName: "",
      productNo: "",
      mfgDate: "",
      defaultDate: new Date(),
      isDatePickerShow: false,
      Model: "",
      mark: "",
      type: "primary",
      disabled: false,
      btnTxt: "保存"
    };
  },
  created () {
  this.$loading.hide()
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "change" || to.name == "add") {
      if (!to.meta.keepAlive) {
        to.meta.keepAlive = true;
      }
      next();
    } else {
      to.meta.keepAlive = false;
      this.$destroy();
      next();
    }
  },
  computed: {
    getData() {
      let data = {
        ProductName: this.productName,
        ProductNo: this.productNo,
        ProduceDate: this.mfgDate,
        Mark: this.mark,
        Model: this.Model
      };
      return data;
    }
  },
  methods: {
    getDate(columnsValue) {
      if (columnsValue[1].value < 10) {
        columnsValue[1].value = "0" + columnsValue[1].value;
      }
      if (columnsValue[2].value < 10) {
        columnsValue[2].value = "0" + columnsValue[2].value;
      }
      this.mfgDate =
        columnsValue[0].value +
        "-" +
        columnsValue[1].value +
        "-" +
        columnsValue[2].value;
    },
    testData(txt) {
      setTimeout(() => {
        Toast.hide();
        setTimeout(() => {
          alert(txt);
          this.type = "primary";
          this.disabled = false;
        }, 10);
      }, 500);
    },
		//添加产品
    addProduct() {
      this.type = "disabled";
      this.disabled = true;
      Toast.loading("检测中");
      if (!this.productName) {
        this.testData("产品名称不能为空");
      } if (this.productName.length>30) {
        this.testData("产品名称不能超过30个字符");
      }else if (!this.productNo) {
        this.testData("产品编号不能为空");
      }if (this.productNo.length>10) {
        this.testData("产品编号不能超过10个字符");
      } else if (!this.mfgDate) {
        this.testData("生产日期不能为空");
      } else if (!this.Model) {
        this.testData("规格型号不能为空");
      }if (this.Model.length>10) {
        this.testData("规格型号不能超过20个字符");
      } else {
        this.btnTxt = "保存中";
        alert("保存中...");
        let data = this.getData;

        setTimeout(() => {
          Toast.hide();
          this.$store.dispatch("addProduct", data);
          this.$router.back();
        }, 1000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.products {
  background: $bg-color;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.save{
	margin: $distance-15;
}
</style>
