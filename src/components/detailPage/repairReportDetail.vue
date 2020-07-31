<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="order-detail">
      <header>
        <!-- <div class="order-state">当前订单状态：{{ orderDetail.State | stateTxt}}</div> -->
      </header>
      <!-- 报修详情 -->
      <md-field plain style="padding:1rem 1rem;background: #FFFFFF;margin: 0.625rem;" v-if="orderDetail.State >= 0 && orderDetail.State != 6">
        <div style="font-size: 1.125rem;border-bottom: 0.0625rem dotted;">报修信息</div>
		    <md-field-item solid title="报修订单" :content="orderDetail.rptRcd.RecordDate" />
        <md-field-item solid title="报修单位" :content="orderDetail.rptRcd.OrganName" />
        <md-field-item solid title="联系人员" :content="orderDetail.rptRcd.ContactBy" />
        <md-field-item solid title="联系电话" :content="orderDetail.rptRcd.ContactTel" />
        <md-field-item solid title="情况说明" :content="orderDetail.rptRcd.Problem" />
        <md-field-item solid title="报修产品"  @click="showPopUp1('bottom')" arrow/>
        <div class="rpt-detail detail-img">
          <header>问题图片</header>
          <ul>
            <li v-for="(item, index) in rptImg" @click="showViewer0(index, $event)" :key="index">
              <img class="img" :src="item" >
            </li>
          </ul>
        </div>
        <md-image-viewer v-model="isViewerShow0" :list="rptImg" :has-dots="true" :initial-index="viewerIndex">
        </md-image-viewer>
        <md-popup v-model="isPopupShow1.bottom" position="bottom">
          <div class="products-popup">
            <rptProduct :propData="orderDetail.rptProductList"/>
          </div>
        </md-popup>
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
import rptProduct from "@/views/shareOrder/rptProduct"
export default {
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [ImageViewer.name]: ImageViewer,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    rptProduct,
  },
  data() {
    return {
      isViewerShow0: false,
	   url: this.$store.getters.url,
	    rptRecordId: this.$store.getters.recordId,
      viewerIndex: 0,
      repImgs: [],
      serviceImgs: [],
      isPopupShow1: {}
    };
  },

  computed: {
    rptImg() {
      let imgs = [];
        for(var i=0;i<this.repImgs.length;i++){
          let img =
              this.url +
              "/userfile/problemImg/" +
              this.rptRecordId + "/"
              // "/thumbnail/"
               +
              this.repImgs[i].name;


            imgs.push(img);
        }
          // for ( let _img of this.repImgs) {
          //   console.log(_img)
          //   let img =
          //     this.url +
          //     "/userfile/problemImg/" +
          //     this.rptRecordId +
          //     "/thumbnail/" +
          //     _img;
          //   imgs.push(img);
          // }

          return imgs;


  }
  },
    watch:{
  	  orderDetail:{
  		  handler(newName, oldName) {
  			     if(newName.rptRcd.ProblemImg.length){
  			 		this.repImgs=JSON.parse(newName.rptRcd.ProblemImg)
  			 	}
  			  return newName
  		  },
  		  deep: true,
  	  }
  
  },
  methods: {
    showViewer0(index) {
      this.viewerIndex = index;
      this.isViewerShow0 = true;
    },
    showPopUp1(type) {
      this.$set(this.isPopupShow1, type, true);
    },
    hidePopUp1(type) {
      this.$set(this.isPopupShow, type, false);
    }
  },
	props:['orderDetail'],
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

