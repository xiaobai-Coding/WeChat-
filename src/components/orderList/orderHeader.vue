<template>
  <header >
    <!--返回-->
    <md-button type="link" style="width: 3.5rem;float: left;font-size: 1.2rem;color: #333;margin-top: 5px;" @click="backBtn"><md-icon name="arrow-left" size="md"></md-icon>返回</md-button>
    <!--用户名与机构-->
    <div class="userNameSty">
      <span style="color: #2a78dc;width: 3.6rem">{{getTrueName}}</span>
      <span class="userNameSty-jg">-&nbsp;{{getOrgName}}</span>
    </div>
    <!--<md-notice-bar   scrollable style="background:rgba(0,0,0,0);">-->
      <!---->
    <!--</md-notice-bar>-->

    <div class="page-header">
    <div class="page-options"
         v-for="page in pages"
         :key="page.name"
         :class="{'page-filter': page.url == 'filter', 'page-search': page.url == 'search', 'page-add': page.url == 'add','page-useradd': page.url == 'useradd'}">
      <div class="page-bar"  style="height: 1.8rem;">
        <!-- 条件筛选框 -->
       <!-- <p v-clickoutside="handleClose"> -->
          <div v-if="page.url == 'filter'" style="line-height:2.2rem;font-size:18px;" @click="changeBtn(page)">
          <img src="../../../static/images/screen_btn.png" alt="" style="width:14px;">&nbsp;{{page.label}}
          <md-icon class="p-left" v-if="isDown" name="arrow-down" style="font-size:18px;"></md-icon>
          <md-icon class="p-left" v-if="!isDown" name="arrow-up" style="font-size:18px;"></md-icon>
        </div>
       <!-- </p> -->
        <!--@change="getInputValue"-->
        <!-- 关键字搜索框 -->
        <div v-if="page.url == 'search'" class="searchInput" @click="changeBtn(page)">
          <img src="../../../static/images/search_btn.png" alt="" style="width:16px">
          <md-field style="padding: 0;width: calc(100% - 1.6rem);display: inline-block;margin-top: -5rem;height: 2.4rem;font-size: 2rem">
            <md-input-item ref="input11" :value="code" placeholder="请输入报修单号" @confirm="getInputValue" clearable size="small">
            </md-input-item>
          </md-field>
        </div>

        <div v-if="page.url == 'add'" style="height: 2rem;line-height:2rem;padding: 3px;border-radius: 5px;margin-top: -5px;margin-right: -10px;background: #eee;color: #333;border: 1px solid #333;" @click="changeBtn(page)">
          <md-icon name="order" style="font-size:20px;line-height: 2rem"></md-icon>
          <span style="font-size:20px;line-height: 2rem">{{page.label}}</span>
        </div>


        <div v-if="page.url == 'useradd'" style="height: 2rem;line-height:2rem;padding: 3px;border-radius: 5px;margin-top: -5px;margin-right: -10px;background: #eee;color: #333;border: 1px solid #333;" @click="changeBtn(page)">
          <md-icon name="order" style="font-size:20px;line-height: 2rem"></md-icon>
          <span style="font-size:20px;line-height: 2rem">{{page.label}}</span>
        </div>
      </div>
    </div>
    </div>
    <div class="md-example-child md-example-child-notice-bar md-example-child-notice-bar-6">

      <!--数字键盘-->
      <md-number-keyboard
        v-model="isKeyBoardShow"
        hide-dot
        @enter="onNumberEnter"
        @delete="onNumberDelete"
      ></md-number-keyboard>
  </div>
  </header>
</template>

<script>
import { Icon,NoticeBar,InputItem, Field,Toast,NumberKeyboard,Codebox,Button  } from "mand-mobile";
import { GetSysUserInfoByUserId } from "@/api/userInfo";
export default {
  components: {
    [Icon.name]: Icon,
    [NoticeBar.name]: NoticeBar,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Toast.name]: Toast,
    [NumberKeyboard.name]: NumberKeyboard,
    [Codebox.name]: Codebox,
    [Button.name]: Button,
  },
  props: ["pages"],
  data() {
    return {
      getTrueName:'',
      getOrgName:'',
      isDown: true,
      searchData: [],//筛宣得到的数据
      isKeyBoardShow:false,
      code:'',//搜索内容
    };
  },
  mounted(){
    this.getTrueName = JSON.parse(localStorage.getItem('userAccount'))[0].TrueName;
    this.getOrgName = JSON.parse(localStorage.getItem('userAccount'))[0].OrgName;
    // sessionStorage.setItem("num",12)
  },
  computed:{
  },
  methods: {
    /**
     * 返回函数
     */
    backBtn(){
      this.$router.push({'name':'serviceList'})
      console.log(this.code)
    },
    changeBtn(data) {
      console.log('奥利给!')
      if (data.url == "filter") {
        if (this.isDown) {
          this.isDown = false;
        } else {
          this.isDown = true;
        }
      }












      this.$emit("change", data);
    },
    getInputData(name,value){
      console.log(value)
    },
    cbd(){
      this.isKeyBoardShow = true;
    },
    onNumberEnter(value){
      this.code += value
    },
    onNumberDelete(){
      if (this.code === '') {
        return
      }
      this.code = this.code.substr(0, this.code.length - 1)
      console.log(this.code)
    },
    getInputValue(name, value){
      console.log(name,value)
      console.log(123)
      // console.log(this.code)
      let self = this;
      self.$emit("searchData",{
          searchStr: value
      });
      // let self = this;
      // let IsNumOrLetter = '';
      // if(value != ''){
      //   Toast.loading('搜索中...')
      //   if(!/.*[\u4e00-\u9fa5]+.*$/.test(value)){
      //     IsNumOrLetter = ''
      //   }else{
      //     IsNumOrLetter = '汉字'
      //   }
      //   GetSysUserInfoByUserId({ search: value,IsNumOrLetter:IsNumOrLetter},this.$store.getters.sid).then(res => {
      //     console.log(res.data)
      //     if(res.data.success == 1){
      //       Toast.hide()
      //       if(res.data.result.length == 0){
      //         alert('暂无数据')
      //       }
      //       let DemoAry = res.data.result
      //       self.$emit("searchData",
      //       )
      //     }
      //   }).catch(err => {
      //     alert("加载失败，请检查您的网络");
      //     setTimeout(() => {
      //       Toast.hide()
      //     }, 1000)
      //   });
      // }else {
      //   setTimeout(function () {
      //     self.$emit("closeBtn",true)
      //     self.searchData = [];
      //   },500)
      // }
    }
  },
  directives: {
    clickoutside:{
      bind:function(el,binding,vnode){
        function documentHandler(e) {
          if(el.contains(e.target)){
            return false;
          }
          if(binding.expression){
            binding.value(e)
          }
        }
        el._vueClickOutside_=documentHandler;

      }
    }
  }
};
</script>

<style lang="scss" scoped>
.md-field{
  padding:0px!important;
}
.userNameSty{
  font-size: $ft-size12;
  width: calc(100% - 4.5rem);
  float: left;
  margin-left: 1rem;
  margin-top: 10px;
}
.userNameSty-jg{
  width: calc(100% - 4rem);
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis
}
.userNameSty span{
  display: inline-block;
  vertical-align: bottom;
}
.searchInput{
  font-size: $ft-size12;
  height: 1.8rem;
  line-height:2rem;
  md-icon{
    font-size: $ft-size12;
  }
}
.page-header {
  padding: 0.3rem 0.5rem;
  display: flex;
  justify-content: start;
  align-items: center;
  background: $color;
  div:nth-child(3) > div{
    background: #1AAD19!important;
  }
  .page-options {
    color: #666;
  }
  .page-search {
    flex: 1;
    padding: 0 0.5rem 0 1rem;
  }
  .page-filter {
    // border-right: 1px solid #697bff;
	border-right: 1px solid $color;
  }

  .page-add {
    > div {
      background: $color;
      color: #fff;
    }
  }

  .p-left {
    padding: 1.5px 0 1.5px 5px;
  }
  .page-bar {
    background: #fff;
    padding: 0.5rem 0.2rem;
  }
}

.weui-search-bar{
  background: $color;
  padding: 0px;
}
#app > div > div.content > div > header > div.page-header > div.page-options.page-search > div > div > fieldset > div > div > div > div.md-field-item-control > input{
  font-size: 1rem!important;
}
</style>
