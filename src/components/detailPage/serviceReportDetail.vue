<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="order-detail">
      <header>
        <!-- <div class="order-state">当前订单状态：{{ orderDetail.State | stateTxt}}</div> -->
      </header>
     
      <!-- 服务 -->
      <md-field plain style="padding:1rem 1rem;background: #FFFFFF;margin: 0.625rem;" v-if="orderDetail.State >= 2 && orderDetail.State != 6">
         <div style="font-size: 1.125rem;border-bottom: 0.0625rem dotted;">服务信息</div>
		<md-field-item solid title="服务订单" :content="orderDetail.svcRcd.RecordDate" />
        <md-field-item solid title="服务编号" :content="orderDetail.svcRcd.ServiceNo" />
        <md-field-item solid title="服务时间" :content='`${orderDetail.svcRcd.StartDate} 至 ${orderDetail.svcRcd.EndDate}`' />
        <md-field-item solid title="服务人员" :content="orderDetail.assRcd.ServicePerson" />
        <md-field-item solid title="实际工时" :content="orderDetail.svcRcd.RealHours" />
        <md-field-item solid title="新增问题" :content="orderDetail.svcRcd.Condition" />
        <md-field-item solid title="维修情况" :content="orderDetail.svcRcd.Problem" />
        <md-field-item solid title="配件列表" content="" @click="showPopUp('bottom')" arrow/>
       <div class="detail-img clear">
          <header>问题图片</header>
          <ul>
            <li v-for="(item, index) in sImg" @click="showViewer(index, $event)" :key="index">
              <img class="img" :src="item" >
            </li>
          </ul>
        </div>
        <md-popup v-model="isPopupShow.bottom" position="bottom">
          <div class="products-popup">
           <svcList :svcListData="orderDetail.svcPartsList"/>
          </div>
        </md-popup>
		<div style="font-size: 1rem;border-bottom: 0.0625rem dotted;margin-top: 0.625rem;">费用信息</div>
        <md-field-item solid title="配件费" :content="orderDetail.svcRcd.PartsPrice" />
        <md-field-item solid title="检修费" :content="orderDetail.CheckPrice" />
        <md-field-item solid title="运费" :content="orderDetail.svcRcd.RunPrice" />
        <md-field-item solid title="交通费" :content="orderDetail.svcRcd.JtPrice" />
        <md-field-item solid title="住宿费" :content=" orderDetail.svcRcd.ZsPrice" />
        <md-field-item solid title="其他费用" :content="orderDetail.svcRcd.OtherPrice" />
        <!-- 总额 -->
        <md-field-item solid title="合计" :content="total" />
		<div style="font-size: 1rem;border-bottom: 0.0625rem dotted;margin-top: 0.625rem;">评价信息</div>
        <md-field-item solid title="技术水平" :content="orderDetail.svcRcd.Technical" />
        <md-field-item solid title="服务态度" :content="orderDetail.svcRcd.Requiements" />
        <md-field-item solid title="建议及要求" :content="orderDetail.svcRcd.Attitude" />
		<div style="font-size: 1rem;border-bottom: 0.0625rem dotted;margin-top: 0.625rem;">确认信息</div>
        <md-field-item solid title="签字人" :content="orderDetail.svcRcd.SignBy" :addon="orderDetail.svcRcd.SignDate" />
       <md-image-viewer v-model="isViewerShow" :list="sImg" :has-dots="true" :initial-index="viewerIndex">
        </md-image-viewer>
      </md-field>
      <!-- 回访 -->
      <md-field plain style="padding:1rem 1rem;background: #FFFFFF;margin:0.625rem;" v-if="orderDetail.State >= 3 && orderDetail.State != 6">
       <div style="font-size: 1.125rem;border-bottom: 0.0625rem dotted;">回访信息</div>
		<md-field-item solid title="回访订单" :content="orderDetail.visitRcd.RecordDate" />
        <md-field-item solid title="服务人员" v-for="(person, index) in orderDetail.persAppraiseList" :key="index" :content="person.Name" />
        <md-field-item solid v-for="(person, index) in orderDetail.persAppraiseList" title="评价" :key="index" :content="`评价等级${person.VLevel}，评价总分${person.AllScore}`" />
        <md-field-item solid title="整体评价" :content="orderDetail.visitRcd.Comment" />
      </md-field>
 
    </div>
  </transition>
</template>

<script>

import {
  Field,
  FieldItem,
  Toast,
  Icon,
  ImageViewer,
  Popup,
  PopupTitleBar,
} from "mand-mobile";

import svcList from "@/views/shareOrder/svcList"

export default {
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [ImageViewer.name]: ImageViewer,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    svcList
  },
  data() {
    return {
      isViewerShow: false,
	   url: this.$store.getters.url,
	  viewerIndex:0,
      serviceImgs: [],
      isPopupShow: {},

    };
  },
 
  
  computed: {

    sImg(){//this.rptRecordId
       let imgs1 = [];
        for(var i=0;i<this.serviceImgs.length;i++){
          let img =
              this.url +
              "/userfile/serviceImg/111" + "/"+
              // this.rptRecordId +
              // "/thumbnail/" +
              this.serviceImgs[i].name;
            imgs1.push(img);
        }
          return imgs1;
    },
    total(){
      return '0';
    },
	
		
  },
  watch:{
	  orderDetail:{
		  handler(newName, oldName) {
			     if(newName.svcRcd.ServicePhotos.length){
			 		this.serviceImgs=JSON.parse(newName.svcRcd.ServicePhotos)
			 	}
			  return newName
		  },
		  deep: true,
	  }

  },
  methods: {

    showViewer(index) {
      this.viewerIndex = index;
      this.isViewerShow = true;
    },
    showPopUp(type) {
      this.$set(this.isPopupShow, type, true);
    },
    hidePopUp(type) {
      this.$set(this.isPopupShow, type, false);
    },
   
  },
  props:['orderDetail'],
 //  mounted(){
	// 
 //    if(this.orderDetail.svcRcd.ServicePhotos.length){
	// 	this.serviceImgs=JSON.parse(this.orderDetail.svcRcd.ServicePhotos)
	// }
 //  }
};
</script>

<style lang="scss">
.order-detail {
	background: #eee;
  header {
    .order-state {
      font-size: 0.8rem;
      padding: 1rem;
      background: #eee;
    }
  }
  .md-field-item-title {
    font-size: 0.77778rem;
  }
  .md-field-item-control {
    font-size: 0.77778rem;
    color: #666;
  }
  .detail-img {
    width: 100%;
    height: 100%;
    header {
      font-size: 0.77778rem;
      padding-top: 0.8rem;
      padding-bottom: 0.4rem;
    }
    ul {
      width: 100%;
      font-size: 0;
      li {
        position: relative;
        display: inline-block;
        width: 22%;
        padding-bottom: 22%;
        margin-right: 2%;
        margin-top: 2%;
        box-sizing: border-box;
        border-radius: 2px;
        overflow: hidden;
        list-style: none;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        &::after {
          content: "";
          display: table;
          clear: both;
        }
      }
    }
  }
  .md-popup-box {
    height: 80%;
    overflow: hidden;
    left: 0;
    right: 0;
    bottom: 0;
    .products-popup {
      height: 100%;
      position: relative;
      background: #fff;
    }
  }
}
</style>

