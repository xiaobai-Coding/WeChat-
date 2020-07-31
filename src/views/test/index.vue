<template>
  <div class="test">
    <md-drop-menu :data="paths" @change="nextPage" id="menu" />
    <div class="content">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title" />
    </div>
  </div>
</template>
<script>
import {Button,DropMenu} from "mand-mobile";
import {GetWeUserRegisterRequest} from "@/api/register"
export default {
  name: 'Test',
   provide(){
    return{
      reload:this.reload
    }
  },
  components:{
    [Button.name]: Button,
    [DropMenu.name]: DropMenu
  },
  data () {
    return {
      sid: '',
      paths:[],
      isRouterAlive:true,
      ishowRegister:false,
      userOptions:[],
      rpt:[],
      service:[{url:"",text:'关于长通'},{url:"",text:'行业动态'}]
    }
  },
  mounted(){
    this.sid=this.$store.getters.sid;
    this.weUserRegisterRequest()
  },
  methods:{
	  changeColor(){

	  },
    nextPage(barItem, listItem){
      this.$router.push({path:listItem.url})
    },
     reload(){
      this.isRouterAlive=false
      this.$nextTick(()=>{
        this.isRouterAlive=true
      })
    },
     weUserRegisterRequest(){
        GetWeUserRegisterRequest({ datas:{reviewResult: "1"},sid:this.$store.getters.sid })
        .then(res => {
            this.ishowRegister=(res.data.length > 0)
            this.setPaths()
            })
            .catch(err => {});
      },
      setPaths(){
          if(this.ishowRegister){
            //用户权限判断
            this.rpt.push({url:"/serviceList/"+this.sid,text:'服务导航'})
            this.userOptions.push( {url:"/toggleUser/"+this.sid,text:'用户列表'})
            // this.rpt.push({url:"/report/"+this.sid,text:'我的报修'})
            // this.rpt.push({url:"/dispatch/"+this.sid,text:'派修列表'})
            // this.rpt.push({url:"/service/"+this.sid,text:'服务列表'})
            // this.rpt.push( {url:"/visit/"+this.sid,text:'回访列表'})
            // this.rpt.push( {url:"/verify/"+this.sid,text:'审核列表'})
             this.userOptions.push({url:"/toggleUser/"+this.sid+"/register",text:'注册'})
          }else{
              this.userOptions.push({url:"/toggleUser/"+this.sid+"/register",text:'注册'})
          }
          this.paths=[
                {
                  text: '长通科技',
                  options:this.service
                },
                {
                  text: '服务',
                  options: this.rpt,
                },
                {
                  text: '我的',
                  options: this.userOptions
                },
          ]
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.content{
	padding-top: 3.125rem;
	background:#eee;
}
.bg{
	width: 6.25rem;
	height: 6.25rem;

}
</style>
