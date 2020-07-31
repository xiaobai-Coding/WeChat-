<template>
	<div class="scan">
<!--    <md-button type="primary" @click="wxReady">扫码</md-button>-->
    <div class="scan_code"></div>
  </div>
</template>

<script>
  import { Button } from 'mand-mobile'
  import * as api from "@/api/login"
	export default {
		name: "scan",
    data(){
		  return{

      }
    },
    components:{
		  [Button.name]:Button,
    },
    mounted() {
		  this.entrance();
    },
    methods:{
      entrance(){
        this.wxConfig();
      },
      wxConfig(){
        api.getWxConfig().then(res=>{
          // alert(location.href.split('#')[0])
          // alert("api ---------->" + JSON.stringify(res.data));
          wx.config({
            debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId : res.data.appId, // 必填，公众号的唯一标识
            timestamp : res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr : res.data.noncestr, // 必填，生成签名的随机串
            // HoagFKDcsGMVCIY2vOjf9qouw7aKQuY26FPYplceP_J8Q0c5AWYlryiwI3egL_aDDZcPov0f1RZXNprU-fejnw
            signature :res.data.signature,// 必填，签名，见附录1
            jsApiList: ['scanQRCode']
          });
          wx.ready(function() {
            wx.checkJsApi({
              jsApiList : ['scanQRCode'],
              success : function(res) {
                console.log(res)
              }
            });
          });

          wx.error(function (res) {
            console.log("error的错误------->" + JSON.stringify(res))
            // alert("error的错误------->" + JSON.stringify(res))
          })
          this.wxReady();
        })

      },
      wxReady(){
        wx.scanQRCode({
          needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType : [ "qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success : function(res) {
            // alert("scanQRCode.success------------->" + res)
          },
          error : function(){

          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
