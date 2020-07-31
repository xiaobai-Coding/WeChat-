<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="order-detail">
      <header>
        <!-- <div class="order-state">当前订单状态：{{ orderDetail.State | stateTxt}}</div> -->
      </header>
  
      <!-- 派修 -->
      <md-field plain style="padding:1rem 1rem;background: #FFFFFF;margin: 0.625rem;" v-if="orderDetail.State >= 1 && orderDetail.State != 6">
        <div style="font-size: 1.125rem;border-bottom: 0.0625rem dotted;">派修信息</div>
		<md-field-item solid title="派修订单" :content="orderDetail.assRcd.RecordDate" />
        <md-field-item solid title="派修人员" :content="orderDetail.assRcd.RecordBy" />
        <md-field-item solid title="服务方式" :content="orderDetail.assRcd.ServiceType" />
        <md-field-item solid title="计划日期" :content="orderDetail.assRcd.PlanDate" />
        <md-field-item solid title="计划工时" :content="orderDetail.assRcd.PlanHours" />
        <md-field-item solid title="派修备注" :content="orderDetail.assRcd.Mark" />
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


export default {
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [ImageViewer.name]: ImageViewer,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,

  },
	props:['orderDetail']
 
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

