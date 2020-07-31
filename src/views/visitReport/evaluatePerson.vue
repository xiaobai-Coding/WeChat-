<template>
  <div class="eval">
    <div style="border: 0.7rem solid #fff;">
      <md-field>
        <md-field-item :title="SvPersonalName" align="right" @click="showActionSheet" :content="VLevel"></md-field-item>
        <md-input-item title="基础得分" type="number" align="right" v-model="BaseScore"></md-input-item>
        <md-input-item title="质量得分" type="number" align="right" v-model="QltScore"></md-input-item>
        <md-input-item title="路程得分" type="number" align="right" v-model="MilScore"></md-input-item>
        <md-input-item title="合计得分" type="number" readonly align="right" v-model="calcAllScore"></md-input-item>
        <md-input-item title="奖惩金额" type="number" align="right" v-model="SaleMoney"></md-input-item>
      </md-field>
      <md-action-sheet v-model="value" :title="title" :options="options" @selected="evaluate"></md-action-sheet>
    </div>
    <div class="confirm" @click="saveVisitPerson">
      <md-button type="primary">保存</md-button>
    </div>
  </div>
</template>

<script>
import { Field, FieldItem, InputItem, Button, ActionSheet } from "mand-mobile";

export default {
  components: {
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Button.name]: Button,
    [InputItem.name]: InputItem,
    [ActionSheet.name]: ActionSheet
  },
  data() {
    return {
      visitPersonDetail: "",
      PersAppraiseId: "",
      SvPersonalName: "",//姓名
      index: "",
      VLevel: "A",
      AllScore: 0,
      BaseScore: 0,
      MilScore: 0,
      QltScore: 0,
      SaleMoney: 0,
      value: false,
      title: "选择人员评分",
      options: [
        {
          label: "A",
          value: 0
        },
        {
          label: "B",
          value: 1
        },
        {
          label: "C",
          value: 2
        }
      ]
    };
  },
  created() {
    this.visitPersonDetail = this.$store.getters.visitPersonDetail;
    this.PersAppraiseId = this.visitPersonDetail.detail.PersAppraiseId;
    this.SvPersonalName = this.visitPersonDetail.detail.SvPersonalName;
    this.AllScore = this.visitPersonDetail.detail.AllScore;
    this.BaseScore = this.visitPersonDetail.detail.BaseScore;
    this.MilScore = this.visitPersonDetail.detail.MilScore;
    this.QltScore = this.visitPersonDetail.detail.QltScore;
    this.SaleMoney = this.visitPersonDetail.detail.SaleMoney;
    this.index = this.visitPersonDetail.index;
  },
  computed: {
    calcAllScore: {
      get() {
        this.AllScore = Number(this.BaseScore) + Number(this.MilScore) + Number(this.QltScore);
        return this.AllScore;
      },
      set() {}
    }
  },
  methods: {
    showActionSheet() {
      this.value = true;
    },
    evaluate(item) {
      this.VLevel = item.label;
    },
    saveVisitPerson() {
      let index = this.visitPersonDetail.index;
      let detail = this.visitPersonDetail.detail;
      let data = {
        VLevel: this.VLevel,
        PersAppraiseId: this.PersAppraiseId,
        SvPersonalName: this.SvPersonalName,
        AllScore: this.AllScore,
        BaseScore: this.BaseScore,
        MilScore: this.MilScore,
        QltScore: this.QltScore,
        SaleMoney: this.SaleMoney
      };
      this.$store.dispatch("saveVisitPerson", { detail: data, index: index });
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>
.eval {
	background: $bg-color;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1rem solid #eee;
  .confirm{
	  margin: $distance-15;
  }
  .eval md-field-item-title{
    text-align: left;
  }
  .md-field{
    margin: 0!important;
  }
}
</style>
