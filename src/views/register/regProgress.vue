<template>
  <div class="reg-progress">
    <md-steps :steps="steps" :current="currentStep" transition>
    </md-steps>
  </div>
</template>

<script>
import {Steps} from 'mand-mobile'
import {GetWeUserRegisterRequest} from "@/api/register"
export default {
   components: {
    [Steps.name]: Steps,
  },
  data(){
    return {
       steps: [
        {
          name: '注册',
        },
        {
          name: '验证',
        },
        {
          name: '结果',
        },
      ],
      currentStep:1,
    }
  },
  mounted(){
    this.weUserRegisterRequest()
  },
  methods:{
    weUserRegisterRequest(){
      GetWeUserRegisterRequest({datas:{},sid:this.$store.getters.sid})
          .then(res => {
            if(res.data.length > 0){
              this.currentStep = 2;
            }
          }).catch(err=>{
          })
    }
  }


}
</script>

<style lang="scss" scoped>
</style>
