<template>
  <div class="order-filter">
    <md-notice-bar icon="order" mode="closable" style="font-size:18px; background:rgba(0,0,0,0);">
      {{startDate}} 到 {{endDate}} 的{{getState}}订单
    </md-notice-bar>
    <md-notice-bar icon="warn" type="warning" v-show="compareDate">
      开始时间不能大于结束时间
    </md-notice-bar>
    <!--筛选条件-->
    <md-field v-show="isFilter" style="border: 1.5rem solid #fff">
      <md-field-item name="name" title="开始时间" arrow="arrow-right" align="right" :content="startDate" @click.native="isStartDatePickerShow = true" style="font-size: 1.5rem"></md-field-item>
      <md-field-item name="name" title="结束时间" arrow="arrow-right" align="right" :content="endDate" @click.native="isEndDatePickerShow = true" ></md-field-item>
      <md-field-item title="条件选择" arrow="arrow-right"  @click="isShow = true"><span slot="right" style="font-size: 1rem">{{value}}</span></md-field-item>
    </md-field>
    <!--开始时间弹框-->
    <md-date-picker ref="start" v-model="isStartDatePickerShow" type="custom" title="请选择开始时间" :custom-types="['yyyy', 'MM','dd']" :default-date="defaultStartDate" @confirm="getStartValue"></md-date-picker>
    <!--结束时间弹框-->
    <md-date-picker ref="end" v-model="isEndDatePickerShow" type="custom" title="请选择结束时间" :custom-types="['yyyy', 'MM','dd']" :default-date="defaultNowDate" @confirm="getEndValue"></md-date-picker>
    <!--条件选择的弹框-->
    <md-picker ref="state" v-model="isShow" :data="getItems" title="选择状态" @confirm="getStateValue" :default-index="pickerDefaultIndex" :default-value="pickerDefaultValue"></md-picker>
  </div>
</template>
<script>
import {
  Field,
  TabBar,
  Icon,
  DatePicker,
  FieldItem,
  Picker,
  NoticeBar
} from "mand-mobile";
import Time from "../../../static/script/getDate";
export default {
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [DatePicker.name]: DatePicker,
    [FieldItem.name]: FieldItem,
    [Picker.name]: Picker,
    [NoticeBar.name]: NoticeBar
  },
  props: ["items", "isFilter","FirstState"],
  data() {
    return {
      startDate: Time.start,
      endDate: Time.end,
      defaultStartDate: new Date(),
      defaultNowDate: new Date(),
      isStartDatePickerShow: false,
      isEndDatePickerShow: false,
      datePickerValue: "",
      isShow: false,
      value: "全部",
      state: this.FirstState,
      pickerDefaultIndex:[1],//默认选中的index
      pickerDefaultValue:['1'],//默认选中的值
    };
  },
  activated(){
    // 获取开始日期
  },
  mounted(){
    // 获取开始日期
    this.defaultStartDate = new Date(
      Time.start
    );

    switch (this.FirstState) {
      case 0:
        return this.value = "待派修";
        break;
      case 1:
        return this.value = "待服务";
        break;
      case 2:
        return this.value = "待回访";
        break;
      case 3:
        return this.value = "待审核";
        break;
      case -99:
        return this.value = "全部";
        break;
    }
  },
  watch:{
    FirstState:{
      handler(newValue,oldValue){
        this.state = newValue;
        switch (newValue) {
          case 0:
            return this.value = "待派修";
            break;
          case 1:
            return this.value = "待服务";
            break;
          case 2:
            return this.value = "待回访";
            break;
          case 3:
            return this.value = "待审核";
            break;
          case -99:
            return this.value = "全部";
            break;
        }
      },
      deep:true,
    },
  },
  computed: {
    compareDate() {
      if (
        new Date(this.startDate).getTime() - new Date(this.endDate).getTime() <
        0
      ) {
        return false;
      } else {
        return true;
      }
    },
    getState() {
      switch (this.state) {
        case 0:
          return "待派修";
          break;
        case 1:
          return "待服务";
          break;
        case 2:
          return "待回访";
          break;
        case 3:
          return "待审核";
          break;
        case -99:
          return "全部";
          break;
      }
    },
    getItems() {
      return this.items;
    }
  },
  methods: {
    getStartValue(columnsValue) {
            console.log(columnsValue)

      this.startDate =
        columnsValue[0].value +
        "/" +
        columnsValue[1].value +
        "/" +
        columnsValue[2].value;
      this.startDate = this.$refs.start.getFormatDate("yyyy-MM-dd");
      if (!this.compareDate) {
        this.$emit("postData", {
          startDate: this.startDate,
          endDate: this.endDate,
          state: this.state
        });
      }
    },
    getEndValue(columnsValue) {
      console.log(columnsValue)
      this.endDate =
        columnsValue[0].value +
        "/" +
        columnsValue[1].value +
        "/" +
        columnsValue[2].value;
      this.endDate = this.$refs.end.getFormatDate("yyyy-MM-dd");
      let self = this;
      if (!this.compareDate) {
        this.$emit("postData", {
          startDate: this.startDate,
          endDate: this.endDate,
          state: this.state
        });
      }
    },
    getStateValue(conlumsValue) {
      console.log(conlumsValue)
      this.value = conlumsValue[0].text;
      this.state = conlumsValue[0].value;
      let self = this;
      if (!this.compareDate) {
        this.$emit("postData", {
          startDate: this.startDate,
          endDate: this.endDate,
          state: this.state
        });
      }
    }
  }

};
</script>

<style scoped="scoped" lang="scss">
	.md-notice-bar{
		color: $color;
	}
  .order-filter{
    width: 100%;
  }


</style>
