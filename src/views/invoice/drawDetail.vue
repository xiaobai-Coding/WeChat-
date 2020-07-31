<template>
  <!-- 已开发票 详情 -->
   <transition
    type="transition"
    mode="out-in"
    appear
    name="fade"
  >
  <div class="drawInvoice">
    <section style="border-radius: 4px;border: 1.1rem solid #fff;">
      <div class="invoDetail">发票详情预览</div>
      <md-field style="margin: 0;">
        <!-- 机构名称 -->
        <md-input-item
          title="机构名称"
          type="text"
          readonly
          placeholder="请填写机构名称"
           @change="unitNameChange"
          align="right"
          v-model="submitData.OrganName"
        ></md-input-item>
        <!-- 纳税联系电话 -->
        <md-input-item
          title="联系电话"
          readonly
          placeholder="请填写联系电话"
          align="right"
          v-model="submitData.PayPhone"
          name="phone"
          type="phone" id='email'
        ></md-input-item>
                <!-- 纳税人识别号 -->
        <md-input-item
          title="纳税识别号"
          type="digit"
          placeholder="请填写纳税人识别号"
          align="right"
          readonly
          v-model="submitData.PayTaxNo"
        ></md-input-item>
        <!-- 地址 -->
        <md-input-item
          title="纳税地址"
          type="text"
          placeholder="请填写地址"
          align="right"
          readonly
          v-model="submitData.PayAddress"
        ></md-input-item>
        <!-- 开户行 -->
        <md-input-item
          title="开户行"
          type="text"
          placeholder="请填写开户行"
          align="right"
          readonly
          v-model="submitData.Bank"
        ></md-input-item>
        <div class="aline"></div>

        <!-- 开票编号 -->
        <md-input-item
          title="开票编号"
          type="digit"
          placeholder="请填写开票编号"
          align="right"
          readonly
          v-model="submitData.BillNo"
        ></md-input-item>
        <!-- 发票种类 -->
        <md-field-item
          class="check-style"
          title="发票种类"
          arrow="arrow-right"
          readonly
           v-model="submitData.BillType"
          :addon="submitData.BillType"
          @click="BillTypeShow = true"
          :arrow="submitData.BillType"
        ></md-field-item>
        <!-- <md-picker
        readonly
          ref="CollMethod"
          v-model="BillTypeShow"
          :data="BillTypeList"
          @confirm="BillTypeCheck"
        ></md-picker> -->
        <!-- 发票日期 -->
        <md-field-item
          class="check-style"
          title="发票日期"
          arrow="arrow-right"
          readonly
          v-model="submitData.BillDate"
          :addon="submitData.BillDate"
          @click="BillDateShow = true"
          :arrow="submitData.BillDate"
        ></md-field-item>
        <!-- <md-date-picker
          ref="CollDate"
          v-model="BillDateShow"
          type="custom"
          title="选择发票日期"
          large-radius`
          readonly
          :custom-types="['yyyy', 'MM','dd']"
          :default-date="defaultData"
          @confirm="BillDateCheck"
        ></md-date-picker> -->
        <!-- 开票人 -->
        <md-input-item
          title="开票人"
          type="text"
          readonly
          placeholder="请填写开票人"
          align="right"
          v-model="submitData.BillBy"
        ></md-input-item>
        <!-- 金额 -->
        <md-input-item
          class="Manys"
         style="color: red !important;"
          title="金额"
          type="money"
          readonly
          placeholder="请填写发票金额"
          align="right"
          v-model="billtotalMoney"
        ></md-input-item>
        <!-- 提交 -->

      </md-field>
    </section>

  </div>
  </transition>
</template>
<script>
import {
  InputItem,
  Field,
  FieldItem,
  Icon,
  Picker,
  DatePicker,
  TextareaItem,
  Button,
  Toast,
  Popup,
  PopupTitleBar,
  DetailItem,
  Dialog
} from "mand-mobile";
import { GetInvoiceCardInfo, DrawInvoice } from "@/api/UserReceipt"; //获取提示信息
export default {
  name: "drawInvoice",
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Icon.name]: Icon,
    [Picker.name]: Picker,
    [DatePicker.name]: DatePicker,
    [TextareaItem.name]: TextareaItem,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    [DetailItem.name]: DetailItem
  },
  data() {
    return {
      isShowUnit: false, //机构搜索页
      id: "",
      buttonTitle: "提交",
      submitState: false,
      defaultData: new Date(),
      buttonType: "primary",
      // 金额
      Many: "",

      /*提交数据*/
      submitData: {
        BillNo: "",
        BillType: "",
        BillDate: "",
        BillUnit: "",
        BillBy: "",
        OrganName: '', // 机构名称
        PayTaxNo: '', // 纳税人识别号
        PayPhone: '', // 纳税人联系电话
        PayAddress: '', // 纳税人地址
        Bank:'', // 开户行
        Receivable:''  //金额
      },

      /*展示卡片数据*/
      cardData: {},

      /*选择框判定条件*/
      BillTypeShow: false,
      BillDateShow: false,

      /*选项框数据*/
      BillTypeList: [
        [
          {
            text: "普通发票",
            value: "普通发票"
          },
          {
            text: "增值发票",
            value: "增值发票"
          },
          {
            text: "收据",
            value: "收据"
          },
          {
            text: "无",
            value: "无"
          }
        ]
      ],
      SettlementId: ""
    };
  },
  mounted() {
    console.log(this.$route.params.setSettlementId);
    this.SettlementId = this.$route.params.setSettlementId;
    console.log(this.SettlementId);
    this.programEntrance();
    // data 中的数据之间相互调用
    },
  beforeMount () {
    this.submitData.OrganName = this.cardData.OrganName

    },
  created() {
    console.log(this.$route.params.totalMoney);
    this.Many = this.$route.params.totalMoney;
  },
  computed: {
    OrganName: function() {
      //机构名称
      return (this.submitData.OrganName = this.cardData.OrganName); // 机构名称
    },
    // 纳税人识别号
    BillPayTaxNo: function() {
      return (this.submitData.PayTaxNo = this.cardData.PayTaxNo); // 纳税人识别号
    },
    // 联系电话
    billPayPhone: function() {
      return (this.submitData.PayPhone = this.cardData.PayPhone); // 纳税人联系电话
    },
    // 地址
    billPayAddress: function() {
      return (this.submitData.PayAddress = this.cardData.PayAddress); // 纳税人地址
    },
    // 开户行
    billBank: function() {
      return (this.submitData.Bank = this.cardData.Bank); // 纳税人开户行
    },
    // 金额
    billtotalMoney: function() {
      return (this.submitData.Receivable = this.Many); // 纳税人金额
    }
  },
  methods: {
    unitNameChange(name, value) {
      if (this.isSearch) {
        GetUnitbyName({ unitName: value }).then(data => {
          this.UnitList = [];
          data.data.result.forEach((item, index) => {
            this.UnitList.push({
              value: item.OrganizId,
              text: item.OrganName
            });
          });
          this.isShowUnit = true;
        });
      }
    },
    onblur() {
      console.log(this.$refs.phone.value.length);
    },
    /**
     * 程序的入口
     */
    programEntrance() {
      this.getInfo();
    },

    /**
     * 获取表单信息
     */
    getInfo() {
      GetInvoiceCardInfo({ SettlementId: this.SettlementId })
        .then(res => {
          if (res.data.success == 1) {
            console.log(res);
            this.submitData = res.data.result[0];
            console.log()
            // 修改状态信息填充
            if (res.data.result[0].BillState == 1) {
              Object.keys(this.submitData).map(item => {
                this.submitData[item] = res.data.result[0][item];
              });
            }
          } else {
            alert(res.data.result);
          }
        })
        .catch(error => {
          alert(error);
        });
    },

    /**
     *提交表单
     * */
    submitFromData() {
      const reg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(!this.submitData.OrganName){
        alert('机构名称不能为空');
        return false
      }else if(!reg.test(this.submitData.PayPhone)||!this.submitData.PayPhone){
        alert('请输入正确的电话号码且不能为空')
        return false
      }else if(!this.submitData.PayTaxNo){
        alert('纳税人识别号不能为空且至少为十位数字')
        return false
      }else if (!this.submitData.PayAddress){
        alert('纳税人地址不能为空')
        return false
      }else if (!this.submitData.Bank){
        alert('开户行信息不能为空')
        return false
      }else if (!this.submitData.BillNo){
        alert('开票编号不能为空')
        return false
      }else if (!this.submitData.BillType){
        alert('发票种类不能为空')
        return false
      }else if (!this.submitData.BillDate){
        alert('发票日期不能为空')
        return false
      }else if (!this.submitData.BillBy){
        alert('开票人不能为空')
        return false
      }else if (!this.submitData.Receivable){
        alert('开票金额能为空')
        return false
      }
      //  console.log( this.$route.params.setSettlementId)
      let _this = this;
      this.buttonType = "disabled";
      this.submitData.SettlementId = this.$route.params.setSettlementId;
      this.buttonTitle = "正在提交...";
      this.submitState = true;

      {
        this.submitData.BillUnit = JSON.parse(
          localStorage.getItem("userAccount")
        )[0].OrgName;
        this.SettlementId = this.cardData.SettlementId;
      }

      DrawInvoice(this.submitData)
        .then(res => {
          if (res.data.success == 1) {
            // alert(res.data.result);
            console.log(res.data.SettlementId);
            this.id = res.data.SettlementId;
            Dialog.succeed({
              title: "提交成功",
              content: "恭喜您成功完成操作",
              confirmText: "确定",
              onConfirm: () => console.log("[Dialog.succeed] confirm clicked")
            });
            setTimeout(() => {
              //提交成功后返回上一层
              // this.$router.back();
              this.buttonTitle = "已提交...";
              this.submitState = false;
              this.$store.dispatch("setSettlementId", this.id);
              this.$router.push({
                name: "invoiceList",
                params: { id: res.data.SettlementId }
              });
            }, 2000);
          } else {
            alert(res.data.result);
            ver();
          }
        })
        .catch(error => {
          alert(error);
          ver();
        });

      function ver() {
        _this.buttonTitle = "提交";
        _this.submitState = false;
        _this.buttonType = "primary";
      }
    },

    /**
     * 选择
     * */
    BillTypeCheck(val) {
      this.submitData.BillType = val[0].value;
    },
    BillDateCheck(val) {
      this.submitData.BillDate = this.dateFormat(
        val[0].value,
        val[1].value,
        val[2].value
      );
    },

    /**
     * 日期格式初始化
     * */
    dateFormat(year, month, day) {
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
.drawInvoice {
  background: #eee;
  border: 1rem solid #eee;
  header {
    .serverCard {
      background-image: url(../../../static/images/serviceback.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: calc(100% + 70px);
      height: 11rem;
      border-radius: 14px;
      margin-left: -35px;
      position: relative;
      div {
        padding: 0.6rem 1rem;
        ul {
          li {
            font-size: 0.9rem;
            color: #999d9c;
            float: left;
            span {
              color: #1aad19;
            }
          }
        }
        .one {
          li:first-child {
            width: 180px;
          }
          li:last-child {
            width: calc(100% - 180px);
          }
        }
        .four {
          float: left;
          width: 33.3%;
          li:first-child {
            width: 100px !important;
          }
          li:last-child {
            text-align: right;
            margin-right: 5px;
            width: calc(100% - 110px);
          }
        }
        .bjbh {
          li:last-child {
            width: 100%;
            font-size: 1rem;
            color: #0bb20c !important;
          }
        }
        .two {
          width: 50%;
          float: left;
          li:first-child {
            width: 180px;
          }
          li:last-child {
            width: calc(100% - 180px);
          }
        }
        .all {
          margin-top: 7px;
          width: 50%;
          float: right;
          li:last-child {
            width: 100%;
            font-size: 1rem;
            text-align: right;
          }
        }
        .pj_list {
          margin-top: 7px;
          width: 50%;
          float: left;
          font-size: 1rem;
          color: #1c1fbd;
        }
      }
    }
  }
  section {
    .user_submit {
      width: 100%;
      margin: 40px auto 0;
    }
    .user_submit:active {
      background: #eeeeee;
      opacity: 0.6;
    }
  }
  .parts_list {
    li:nth-child(odd) {
      background: #cee6cf;
    }
    li:nth-child(even) {
      background: #ececd7;
    }
  }
}
.md-input-item.right.md-input-item-fake.md-input-item.right .md-input-item-input{
   color: red !important;
   font-size:20px;
}
.invoDetail {
  font-size:1.2rem;
  font-weight:600;
  color:#0bb20c
}
.aline{
  height: 20px;
  width: 100% !important;
  background-color: rgb(238, 238, 238);
  border-radius: 30px;
  background:url(../../assets/image/bg02.png);
  // border-bottom: 10px solid rgb(238, 238, 238);
    // border-top: 10px solid rgb(238, 238, 238);

}
</style>
