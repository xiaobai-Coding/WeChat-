<template>
  <div id="app">
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        class="page"
        v-wechat-title="$route.meta.title"
      />
    </keep-alive>

    <router-view
      v-if="!$route.meta.keepAlive"
      class="page"
      v-wechat-title="$route.meta.title"
    />
  </div>
</template>

<script>
  import {GetWeUserAccountList} from "@/api/userInfo"//获取当前登录的用户名称与机构
export default {
  name: "App",
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return {
      isRouterAlive:true,
    }
  },
   components: {
      Loading
    },
  created () {
     this.show();
    // document.body.removeChild(document.getElementById('Loading'))
    // let loading=document.getElementById('Loading')
    // if(loading!=null){
    //   document.body.removeChild(loading)
    // }
},
  methods:{
    reload(){
      this.isRouterAlive=false
      this.$nextTick(()=>{
        this.isRouterAlive=true
      })
    },

  },
  computed: {

  },
  mounted() {

    // GetWeUserAccountList().then(data => {
    //   console.log(data)
    //   let userAccount = JSON.stringify(data.data[0])
    //   localStorage.setItem('userAccount',userAccount)
    // });
     let loading=document.getElementById('Loading')
    if(loading!=null){
      document.body.removeChild(loading)
    }
  }
};
</script>
<style lang="scss">
@import "./style/normalize.css";
@import "./style/animate.css";
#app{
  background: #eee;
}
.is-bold > .md-detail-title,
.is-bold > .md-detail-content{
  font-size: $ft-size1;
}
.md-detail-item > .md-detail-title,
.md-detail-item > .md-detail-content{
  font-size: $ft-size1;
}
.md-field-item-right{
  font-size: $ft-size1;
  color: #333;
}
.md-field-item-content > .md-field-item-title,
.md-field-item-content > .md-field-item-control{
  font-size: $ft-size1!important;
}
.md-field-item-content > .md-field-item-title{
  width: 5.3rem!important;
  color: #999d9c!important;
  text-align: left!important;
}
.md-field-item-content > .md-field-item-control{
  width: calc(100% - 5rem)!important;
}

.md-field-item-content:before{
  border-bottom:0 solid #fff!important;
}

//设置input框输入字体大小
.md-field-item-control >.md-input-item-input{
  font-size: 1rem!important;
}
.fade-enter-active {
  // animation: bounce-in .3s;
  transition: all cubic-bezier(0, 0.7, 0.8, 1) 0.4s;
}
.fade-leave-active {
  // animation: bounce-out .3s;
  transition: all 0.4s cubic-bezier(0, 0.6, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-180px);
}
#app {
	background: $bg-color;
}
.md-button.primary:after{
	border: .08333rem solid $color!important;
}
.md-button.primary,.md-tab-bar-ink{
	background-color: $color!important;
}
.md-popup-title-bar .title-bar-right,
.md-picker-column-item .column-list .column-item.active,
.md-check.is-checked .md-check-icon,
.md-dialog-btn:last-child,
.md-radio.is-checked .md-radio-icon,
.md-tab-bar-item.is-active,
.md-drop-menu-bar .bar-item.selected.column-item.active,
.md-drop-menu-list .md-radio-item.is-selected .md-cell-item-title,
.md-drop-menu-bar .bar-item.selected ,
.md-drop-menu-bar .bar-item.active,
.md-steps .icon-wrapper
{
	color: $color!important;
}
.md-drop-menu-bar .bar-item.active span:after{
	    border-top-color: $color!important;
}
.md-steps .step-wrapper.reached .icon-wrapper .step-node-default-icon{
	background: $color!important;
}

  /*选择器的字体大小*/
.column-item{
  font-size: 1rem!important;
}
/*详细信息字体颜色*/
.order-detail .md-field-item-control{
  color: #333!important;
}
.md-field-item-content:before{
  height: 0!important;
}

  /*日期字体加大*/
.md-picker-column-list .column-list .column-item{
    font-size: 1.2rem!important;
  }
  /*多行文本框字体大小*/
  .md-textarea-item__textarea{
    font-size: 1rem!important;
  }

  //图标页面
  .md-cell-item-body{
    height: 3.5rem;

  }
.md-cell-item-body .md-cell-item-content{
  font-size: 1rem;
}
.md-cell-item .md-cell-item-body::before{
  border-bottom: 1px solid #e1e1e1!important;
}
.md-landscape-body i{
  display: none!important;
}
.md-dialog .md-popup{
  margin-top: 100%;
  height: 100%!important;
  margin-left: 50%!important;
  width: 100%!important;
}

</style>