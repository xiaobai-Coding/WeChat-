<!-- 报修  -->
<template>
<div class='svcList'>
    <div class="svcList-item">
      <md-field  v-for="(item,index) in svcListData" :key="index" style="border: 1rem solid #fff;padding: 0;">
        <div style="float: left">
          <md-detail-item title="配件名称：" :content="item.PartsName" bold ></md-detail-item>
        </div>
        <div style="clear:both">
          <md-detail-item title="规格型号：" :content="item.PartsNo" />
          <md-detail-item title="配件编号：" :content="item.Model" />
          <md-detail-item title="配件数量：" :content="item.Qty" />
          <md-detail-item title="配件单价：" :content="item.Price" />
          <md-detail-item title="配件总价：" :content="item.PartsPrice" />
          <md-detail-item title="单位：" :content="item.Unit" />
          <md-detail-item title="备注：" :content="item.Mark" />
        </div>
      </md-field>
    </div>
</div>
</template>

<script>
import {
  Icon,
  DetailItem,
    Field,
    FieldItem,
} from 'mand-mobile'
export default {
    name: 'svcList',
    components:{
         [Field.name]: Field,
         [FieldItem.name]: FieldItem,
          [DetailItem.name]: DetailItem,
          [Icon.name]: Icon
    },
  data(){
    return{
      up:'arrow-up',
    }
  },
    props:['svcListData'],
  methods:{

  }
}
</script>
<style scoped>
    .svcList-item{
        padding: 30px;
      border-top: 0;
    }
    .md-detail-item{
    border-bottom: 1px solid #ccc;padding-top:20px;
    }
</style>
