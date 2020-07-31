<template>
	<div class="md-example-child md-example-child-steps md-example-child-steps-7">
		<md-steps
		  direction="vertical"
		  :steps="steps"
		  :current="5"
		  vertical-adaptive>
		</md-steps>
  </div>
</template>

<script>
  import {GetWeUserAccountList} from "@/api/userInfo"//获取当前登录的用户名称与机构
	import {Steps} from 'mand-mobile'
	export default {
	name: 'steps-demo',
	components: {
		[Steps.name]: Steps,
	},
	data() {
    return {
      steps: [
        {
        name: '报修',
        text: '检测站出现问题在app提交报修申请，或者打电话给客服',
        },
        {
        name: '派修',
        text: '收到派修单，客服经理安排工程师处理',
        },
        {
        name: '服务',
        text: '工程师在接收到派修单之后根据问题的难易程度进行相应处理，然后填写相应服务单',
        },
	    {
	    name: '回访',
	    text: '工程师完成服务之后客服经理回访所在订单处理的是否合格',
	    },
		{
		name: '审核',
		text: '财务将工单进行进一步的审核，主要审核其中所用到的材料和花费是否正常，处理完成！',
		},
		{
		name: '完成',
		text: '工单完成',
		}
      ],
    }
  },
    mounted() {
      GetWeUserAccountList(this.$store.getters.getServiceProduct).then(data => {
        let userAccount = JSON.stringify(data.data[0])
        localStorage.setItem('userAccount',userAccount)
      });
    }
  }
</script>

<style  lang="stylus">
.md-example-child-steps-7 .md-steps{
	   height 37.5rem
 }
.name{
	font-size 1.125rem!important;
	color:#1aad19!important;
}
.desc{
	font-size: 0.9375rem!important;
    line-height: 1.375rem!important;
	color:#2f86f6!important;
}
</style>
