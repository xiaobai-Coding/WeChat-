<template>
  <div class="course">
    <!--课程推荐-->
    <div class="more-course">
      <p></p>
      我的课程
      <div style="height: 20px;font-size: 1rem;line-height: 20px;margin-top:-14px;margin-right: 10px;">
        <span>剩余<i style="color: red">{{Duration1}}</i>分钟</span>
        <span>已用<i style="color: green">{{Duration2}}</i>分钟,</span>
      </div>
    </div>

    <!--最新上线-->
    <div style=" padding: 0 15px;">
      <ul @click="courseJump(item)" class="grid-card" style="margin-top: -10px;margin-bottom: 40px;border-radius: 5px;" v-for="(item,index) in NewestList" :key="index">
        <li class="course-img" :style="{height:imgHeight}" style="display: flex;align-items: center;justify-content: center;">
          <img :src="item.CoverUrl" alt="" class="courseImg">
        </li>
        <li style="height: 50px;width: 100%;background: #fff;line-height: 50px">
          <span style="color: #333;width: 100%;font-weight: bold;margin-left: 10px">{{item.Intro}}</span>
            <!--            <p style="color: #333">主讲人:<span>{{item.Lecturer}}</span></p>-->
        </li>
      </ul>
      <div style="height: 40px;width: 100%"></div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mand-mobile'
  import {GetCourseList} from '@/api/videoPlayer'
  export default {
    name: "course",
    components:{
      [Toast.name]:Toast,
    },
    data(){
      return{
        imgHeight:'',
        Duration1:'',
        Duration2:'',
        // http://player.alicdn.com/video/11.mp4
        NewestList:[],
      }
    },
    mounted(){
      this.getCourse();//网页唯一入口
    },
    computed:{

    },
    /**
     * courseJump  课程跳转
     */
    methods:{
      getCourse(){
        this.initialHtml();
        GetCourseList().then(res=>{
          if(res.data.success == 1){
            this.Duration1 = parseInt(res.data.Duration1/60);
            this.Duration2 = parseInt(res.data.Duration2/60);
            this.NewestList = res.data.result;
          }else{
            alert(res.data.result);
            alert(res.data.result);
          }
        }).catch(error=>{
          alert(res.data.result);
          alert(error)
        })
      },

      initialHtml(){
        this.imgHeight = (window.screen.width / 2) + 'px';
      },

      courseJump(item){
        this.$store.dispatch('saveData',JSON.stringify(item));
        setTimeout(()=>{
          this.$router.push({name:'player'})
        },400)
      }
    }
  }
</script>

<style scoped>
  .course{
    margin-top: -40px;
    background: #eee;
  }


  .more-course{
    margin-left: 10px;
    box-sizing: content-box;
    padding: 1rem 0;
    margin-top: 1rem;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .more-course ul{
    height: 2rem;
    margin-top: 10px;
  }
  .more-course ul li{
    float: left;
    font-weight: normal;
    color: #333;
    font-size: 1rem;
    height: 2rem;
    line-height: 2rem;
    border-bottom: 2px solid #f8f8f8;
    margin-right: 20px;
  }
  .more-course ul li:hover{
    border-bottom: 2px solid dodgerblue;
    color: dodgerblue;
  }
  .title-style{
    border-bottom: 2px solid dodgerblue!important;
    color: dodgerblue!important;
  }
  .more-course p{
    float: left;
    height: 1.8rem;
    width: 0.4rem;
    border-radius: 10px;
    background: orange;
    margin-top: -2px;
    margin-right: 0.4rem;
  }
  .more-course span{
    float: right;
    font-size: 0.9rem;
    font-weight: normal;
    line-height: 1.8rem;
    margin-right: 0.5rem;
    margin-top: -30px;
  }
  .more-course span .van-icon{
    line-height: 1.8rem;
    vertical-align: bottom;
  }
  .course-img{
    width: 100%;
    text-align: center;
    color: #fff;
    overflow: hidden;
    background: #e0e0e0;
  }
  .course-title{
    height: 2.3rem;
  }
  .course-title h4{
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    font-size: 0.9rem;
    font-weight: normal;
    height: 1.5rem;
    line-height: 1.5rem;
    margin: 0;
    margin-top: 5px;
    margin-left: 5px;
    color: #7f7f7f;
  }
  .courseImg{
    display: block;
    width: 100%;
    height: 100%;
  }
  .grid-card:hover img{
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    margin-top: -5px;
    margin-left: -5px;
  }
  .course-img p {
    margin: 0;
    height: 1.2rem;
    font-size: 1rem;
  }
  .van-grid-item{
    overflow: hidden;
  }
  .course-title{
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .course-title span{
    margin: 0;
    font-size: 0.8rem;
    color: #7f7f7f;
    height: 2rem;
    line-height: 2.3rem;
    margin-right: 0.5rem;
  }
  .van-search__content{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)!important;
  }
</style>
