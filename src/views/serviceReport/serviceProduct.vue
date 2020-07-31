<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="dispatch-order">
      <div class="dispatch-info">
        <md-field>
          <md-input-item title="配件名" placeholder="请输入配件名" align="right" v-model.trim="PartsName" />
          <md-input-item title="规格型号" placeholder="请输入规格型号" align="right" v-model.trim="Model" />
          <md-input-item title="配件编号" placeholder="请输入配件编号" align="right" v-model.trim="PartsNo" />
          <md-input-item type="money" title="配件单价" placeholder="请输入配件单价" align="right" v-model.trim="Price"><span slot="right" style="font-size: 1rem">元</span></md-input-item>
          <md-input-item type="number" title="配件数量" placeholder="请输入配件数量" align="right" v-model.trim="Qty" />
          <md-input-item title="单位" placeholder="请输入单位" align="right" v-model.trim="Unit" />
          <md-field-item solid title="配件金额"><span slot="right" style="font-size: 1rem">{{getPrice}}</span></md-field-item>
          <md-input-item title="备注" placeholder="请输入备注" align="right" v-model.trim="Mark" />
        </md-field>
        <div class="confirm">
          <md-button type="primary" @click="saveProduct">保存</md-button>
        </div>
      </div>
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
  Icon,

} from "mand-mobile";
export default {
  components: {
    [Selector.name]: Selector,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [CheckList.name]: CheckList,
    [DatePicker.name]: DatePicker,
    [Button.name]: Button,
    [Icon.name]: Icon,

  },
  data() {
    return {
      PartsName: "",
      Model: "",
      PartsNo: "",
      Price: "",
      Qty: "",
      Unit: "",
      PartsPrice: "",
      Mark: "",
      Status:true,//新增还是编辑
      serial:0,//编辑的序列号
    };
  },
  props:["OrderIndex","eventCond"],
  mounted(){
  },
  created() {
	  //报修记录id
    let id = this.$store.getters.recordId;
    this.RptRecordId = this.$route.params.id;
  },

  computed: {
    //初始化数据
    getData() {
      let data = {
        PartsName: this.PartsName,
        Model: this.Model,
        PartsNo: this.PartsNo,
        Price: this.Price,
        Qty: this.Qty,
        Unit: this.Unit,
        PartsPrice: this.PartsPrice,
        Mark: this.Mark
      };
      return data;
    },
    //总计价格计算
    getPrice() {
      if (this.Qty && this.Price) {
        this.PartsPrice = Number(this.Qty) * Number(this.Price);
        return this.PartsPrice.toString();
      } else {
        return this.PartsPrice;
      }
    }
  },
  watch:{
    OrderIndex:{
      handler(newValue,oldValue){
        this.serial = newValue;//存储点击编辑的序列号
      }
    },
    deep: true,
    eventCond:{
      handler(newValue,oldValue){
        if(newValue != oldValue){
          this.requestData()
        }
      }
    },

  },
  methods: {
    requestData(){
      if( this.serial == -1){
        this.Status = true;//新增
        this.init()//初始化数据
      }else{
        this.Status = false;//编辑
        this.matchData();//渲染数据
      }
    },
    // 初始化数据
    init(){
      this.PartsName="";
      this.Model="";
      this.PartsNo="";
      this.Price="";
      this.Qty="";
      this.Unit="";
      this.PartsPrice="";
      this.Mark="";
    },
    // 编辑渲染数据
    matchData(){
      //配件名 不能超过30个字符
      this.PartsName = this.$store.getters.editSerProduct.detail.PartsName;
      // 规格型号 不能超20个字符
      this.Model = this.$store.getters.editSerProduct.detail.Model;
      //配件编号 不能超过10个字符
      this.PartsNo = this.$store.getters.editSerProduct.detail.PartsNo;
      // 单价
      this.Price = this.$store.getters.editSerProduct.detail.Price;
      //数量
      this.Qty = this.$store.getters.editSerProduct.detail.Qty;
      // 单位
      this.Unit = this.$store.getters.editSerProduct.detail.Unit;
      //配件金额
      this.PartsPrice = this.$store.getters.editSerProduct.detail.PartsPrice;
      //备注
      this.Mark = this.$store.getters.editSerProduct.detail.Mark;
    },
    //编辑
    editFun(){
      if(this.determineData()){
        this.$store.dispatch("editServiceProduct", {
          detail: this.getData,
          index: this.serial
        });
        this.$emit('onloadOk',false)
      }else{
        return
      }
    },
    //新增
    addFun(){
      if(this.determineData()){
        this.$store.dispatch("addServiceProduct", this.getData);
        alert('新增成功')
        this.$emit('onloadOk',false)
      }else{
        return
      }
    },
    //数据合法性判断
    determineData(){
      if (!this.getData.PartsName) {
        alert("配件名称不能为空！");
        return false;
      } else if (!this.getData.Model) {
        alert("规格型号不能为空！");
        return false;
      } else if (!this.getData.PartsNo) {
        alert("配件编号不能为空！");
        return false;
      }else if (!this.getData.Price) {
        alert("配件单价不能为空！");
        return false;
      } else if (!this.getData.Qty) {
        alert("配件数量不能为空！");
        return false;
      } else if (this.getData.Qty < 1) {
        alert("配件数量不能小于1！");
        this.Qty = "";
        return false;
      }else if (this.getData.PartsName.length>30) {
        alert("配件名称长度不能超过30个字符！");
        return false;
      }else if (this.getData.Model.length>20) {
        alert("规格型号长度不能超过20个字符！");
        return false;
      }else if(this.getData.PartsNo.length>10) {
        alert("配件编号长度不能超过10个字符！");
        return false;
      }else {
        return true;
      }
    },
	  //保存配件
    saveProduct() {
      if(this.Status){ //新增
        this.addFun()
      }else {  //编辑
        this.editFun()
      }

      // if (this.$store.getters.editSerProduct.detail.PartsName) {
      //   let index = this.$store.getters.editSerProduct.index;
      //   this.$store.dispatch("editServiceProduct", {
      //     detail: this.getData,
      //     index: index
      //   });
      // } else {
      //
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
  .dispatch-order {
    background: $bg-color;
    position: relative;
    /*height: 100%;*/
    border: 1rem solid #eee;
    .dispatch-info {
      background: #fff;
      border: 0.7rem solid #fff;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .dispatch-person {
      position: absolute;
      top: 0;
      z-index: 10;
      width: 100%;
      background: #fff;
      height: 100%;
      .comfirm {
      border-top:20px solid #fff;
      }
    }
    .md-field{
      margin: 0!important;
    }

  }
</style>


