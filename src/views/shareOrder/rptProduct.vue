<!--  -->
<template>
    <div class='rptProduct'>
        <div class="rptProduct-item">
            <md-field  v-for="(item,index) in propData" :key="index">
              <div style="float: left" >
                <md-detail-item title="产品名称：" :content="item.ProductName" bold /> 
              </div>
              <div style="clear:both">
                <md-detail-item title="产品编号：" :content="item.ProductNo" />
                <md-detail-item title="生产日期：" :content="item.ProduceDate" />
                <md-detail-item title="规格型号：" :content="item.Model" />
                <md-detail-item title="备注：" :content="item.Mark" />
              </div>
            </md-field>
        </div>
    </div>
</template>

<script>
import {
    Field,
    FieldItem,
    DetailItem,
    Icon
 } from 'mand-mobile'
export default {
name: 'rptProduct',
  data(){
    return{
    }
  },
components:{
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [DetailItem.name]: DetailItem,
    [Icon.name]: Icon
},
  methods:{
  
  },
props:['propData'],
}
</script>
<style  scoped>
.rptProduct-item{
    padding: 30px;
}
.md-detail-item{
border-bottom: 1px solid #ccc;padding-top:20px;
}
</style>
