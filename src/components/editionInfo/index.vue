<template>
	<div class="editionInfo">
<!--    <nav style="height: 40px;background: white;border-bottom: 2px solid #e0e0e0;position: relative" id="abcac">-->
<!--      <md-icon name="arrow-left" size="lg" @click="goBack" style="line-height: 40px;margin-left: 10px;display: inline-block;position: absolute"></md-icon>-->
<!--      <h4 style="display: block;text-align: center;line-height: 40px">软件详情</h4>-->
<!--    </nav>-->


    <section style="padding: 5px;position: relative;">
      <div style="width: 100%">
        <h2 style="padding: 10px 0;font-size: 20px;">{{appName}}</h2>
        <span style="padding:3px;height: 20px;font-size: 12px;color: #0bb20c;border-radius: 4px;border: 1px solid #0bb20c;margin: 3px" v-for="(t,i) in AppList.labelList" :key="i + 10">
        {{t}}
      </span>
        <p style="padding-top: 10px;">
          <i style="font-style: normal;font-size: 18px;padding: 5px 0;display: inline-block">软件功能</i>
          <br>
          <span style="text-indent:50px;line-height: 30px;color: #7f7f7f">{{AppList.Intro}}</span>
        </p>
      </div>
      <img :src="$store.getters.getIconName + AppList.Icon" alt="" style="width: 70px;height: 70px;position: absolute;top: 10px;right: 15px">

      <h5 style="font-size: 18px;display: inline-block;margin-top: 20px;padding: 5px 0;font-weight: normal;">版本信息</h5>
      <ul style="margin-top: -20px">
        <li v-for="(item,index) in versionList" :key="index" style="color: #7f7f7f;margin: 30px 0;">
          <div style="width: calc(100% - 45px);float: left">
            <p>版本号：<span style="color: #333;">{{item.Version}}</span></p>
            <p>发布时间：<span style="color: #333;">{{item.PublishTime}}</span></p>
            <p>发布者：<span style="color: #333;">{{item.PublishBy}}</span></p>
          </div>
          <div style="width: 45px;float: right">
            <p :style="{color: item.State == '在用'? '#0bb20c':'red'}">{{item.State}}</p>
          </div>
          <div style="clear: both"></div>
          <p>版本描述：{{item.Description}}</p>
          <i style="border-bottom: 2px solid #f7f7f7;display: block;width: 100%;padding: 10px 0;margin: 0 auto;opacity: 0.8;"></i>
        </li>
      </ul>

    </section>

  </div>
</template>

<script>
  import { Icon  } from 'mand-mobile'
  import * as api from "@/api/AppRegister"
	export default {
		name: "editionInfo",
    components:{
		  [Icon.name]:Icon,
    },
    data(){
		  return{
		    id:'',
        appName:"",
        versionList:[],
        AppList:{},
      }
    },
    computed:{

    },

    mounted() {
		  this.id = this.$route.query.AppId;
		  this.appName = this.$route.query.AppName;
		  this.getAppInfo();
    },
    methods:{
      getAppInfo(){
        api.appVersionInfo({AppId:this.id}).then(res=>{
          if(res.data.success == 1){
            this.versionList = res.data.tag.list;
            this.AppList = res.data.tag.App[0];
            this.AppList.labelList = this.AppList.labelList.split(",");
          }else{
            alert(res.data.result);
          }
        })
      },
      goBack(){
        this.$router.back();
      }
    }
  }
</script>

<style scoped lang="scss">
.editionInfo{
  background: white;
  padding: 20px;
}
</style>
