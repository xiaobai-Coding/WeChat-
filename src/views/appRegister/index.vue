<template>
	<div class="appRegister" ref="app">
<!--    <nav style="height: 40px;background: white;border-bottom: 2px solid #e0e0e0;position: relative;" >-->
<!--      <md-icon name="arrow-left" size="lg" @click="goBack" style="line-height: 40px;margin-left: 10px;display: inline-block;position: absolute;"></md-icon>-->
<!--      <h4 style="display: block;text-align: center;line-height: 40px">统计列表</h4>-->
<!--    </nav>-->

    <nav style="padding: 5px 10px">
      <div style="padding: 10px;border: 1px solid #eee;height: 20px;width: calc(100% - 80px);display: inline-block">
        <md-input-item
          placeholder="请输入需要查询的软件名称"
          is-highlight
          align="center"
          v-model="inputValue"
        ></md-input-item>
      </div>
      <md-button type="primary" inline size="small" style="width: 50px;height: 42px;vertical-align: top;" @click="searchApp">查询</md-button>
    </nav>

    <section >
<!--      <md-scroll-view-->
<!--        ref="scrollView"-->
<!--        :scrolling-x="false"-->
<!--        @refreshing="$_onRefresh"-->
<!--      >-->
<!--        <md-scroll-view-refresh-->
<!--          slot="refresh"-->
<!--          slot-scope="{isRefreshActive, isRefreshing }"-->
<!--          :is-refreshing="isRefreshing"-->
<!--          :is-refresh-active="isRefreshActive"-->
<!--        ></md-scroll-view-refresh>-->
        <ul>
          <li v-for="(item,index) in tagList" :key="index" class="App_list" @click="AppVInfo(item)" >
            <div style="height: 53px">
              <div style="float: left;width: 40px;padding: 5px 9px 5px 0;height: 43px;overflow: hidden">
                <img :src="$store.getters.getIconName + item.Icon" alt="" style="width: 100%;">
              </div>
              <div style="float: left;width: calc(100% - 49px)">
                <div>
                  <h4 style="width: 100%;overflow: hidden;white-space:nowrap;text-overflow:ellipsis;">{{item.Name}}</h4>
                </div>
                <div style="overflow: hidden;">
                  <span style="color: #1c1fbd;display: inline-block;">{{item.Code}}</span>
                  <span class="App_Vl">{{item.LastVersion}}</span>
                </div>
              </div>
            </div>
            <div>
              <span class="App_label">
                <span style="padding:3px;height: 20px;font-size: 12px;color: #0bb20c;border-radius: 4px;border: 1px solid #0bb20c;margin: 3px" v-for="(t,i) in labelTitle(item.labelList)" :key="i + 10">{{t}}</span>
              </span>
            </div>
          </li>
        </ul>
<!--      </md-scroll-view>-->

    </section>

  </div>
</template>

<script>

  import {Icon,InputItem,Button,ScrollView,ScrollViewRefresh} from 'mand-mobile'
  import * as api from "@/api/AppRegister"
	export default {
		name: "appRegister",
    components: {

      [Icon.name]:Icon,
      [InputItem.name]: InputItem,
      [Button.name]: Button,
      [ScrollView.name]: ScrollView,
      [ScrollViewRefresh.name]: ScrollViewRefresh,
    },
    data(){
		  return{
		    tagList:[],
        inputValue:'',
      }
    },
    computed:{
      labelTitle(row){
        return function (row) {
          return row.split(",");
        }
      }
    },
    mounted() {
      this.entrance();
    },
    activated(){
      this.entrance();
    },
    beforeRouteEnter:function(to,from,next){
      if(from.name == "serviceList"){
        next(vm=>{
          vm.$refs.app.scrollTop = 0;
        })
      }else{
        next(vm=>{
          vm.$refs.app.scrollTop = to.meta.scrollTop;
        })
      }
    },
    beforeRouteLeave:function(to,from,next){
		  const scroll = this.$refs.app.scrollTop;
      this.$route.meta.scrollTop = scroll;
      next()
    },
    watch:{
      inputValue:{
        handler(newValue,oldValue){
          if(newValue == ""){
            this.entrance();
          }
        },
        deep:true,
        immediate: false,
      }
    },
    methods:{
      $_onRefresh(){
        api.appRegister({keyWord:this.inputValue}).then(res=>{
          if(res.data.success == 1){
            if(res.data.tag.length == 0){
              alert("暂无数据")
            }
            this.tagList = res.data.tag;
            this.$refs.scrollView.finishRefresh()
          }
        })
      },
      searchApp(){
        this.entrance();
      },
      entrance(){
        api.appRegister({keyWord:this.inputValue}).then(res=>{
          if(res.data.success == 1){
            if(res.data.tag.length == 0){
              alert("暂无数据")
            }
            this.tagList = res.data.tag;
          }
        })
      },
      AppVInfo(item){
        this.$router.push({
          name:"editionInfo",
          query:{
            AppId:item.AppId,
            AppName:item.Name,
          }
        })
      },
      goBack(){
        this.$router.back();
      },
    }
  }
</script>

<style scoped lang="scss">
.appRegister{
  height: 100%;
  overflow: auto;
  background: white;
  .App_list{
    width: 100%;
    height: 225px;
    padding: 20px;
    border-bottom: 2px solid #e0e0e0;
    box-sizing: border-box;
    &:active{
      background: #eee;
      opacity: 0.8;
    }
    .App_label{
      width: 100%;
      overflow: hidden;
      height: 62px;
    }
    .App_Vl{
      font-size: 1rem;
      display: inline-block;
      margin-left: 10px;
      /*vertical-align: top;*/
    }
  }
}


</style>
