<template>
  <div class="player">
    <!--视频播放器-->
    <div class="prism-player" id="J_prismPlayer" style="width:100%; height:252px;position: relative;" @click="palyFull">
      <span style="position: absolute;color: red;font-size: 20px;top:20px;left: 20px">{{userName}}</span>
      <!--        <nav style="background: #00000000;width: 30px;height: 30px;position: absolute;top: 10px;left: 10px;z-index: 9999" @click="backBtn"><van-icon name="arrow-left" size="22" color="#7f7f7f" style="margin-top: 4px" /></nav>-->
    </div>
    <!--导航-->
    <md-tabs>
      <md-tab-pane class="course_content" name="p1" label="课程介绍">
        <section style="margin: 0.6rem;background: #fff;border: 1px solid #f5f5f5;border-radius: 5px">
          <div class="course-title">
            <h2>{{demoData.Intro}}</h2>
            <ul>
              <li>类别：教学类</li>
              <li>时长：{{videoTime(demoData)}}m</li>
              <li style="border: 0;">点击数：{{demoData.HitCount}}</li>
            </ul>
          </div>
        </section>
        <section style="margin: 0.6rem;background: #fff;border: 1px solid #f5f5f5;border-radius: 5px">
          <div class="course-present">
            <div>
              <h2>讲师</h2>
              <p>{{demoData.Lecturer}}</p>
              <p>{{demoData.LecturerIntro}}</p>
            </div>
            <div>
              <h2>课程内容</h2>
              <span>{{demoData.Subject}}</span>
            </div>
          </div>
        </section>
      </md-tab-pane>
      <md-tab-pane class="course_content" name="p2" label="目录">
        <p class="table-title"><span>授课方式：</span><span style="margin-left: 1rem;">视频（{{demoData.VideoCount}}）</span></p>
        <!--课程目录-->
        <div style="padding: 1rem;">
          <ul class="course-table" v-for="(item,index) in tableData" :key="index">
            <li @click="playBtn(item)" style="box-shadow: 0 2px 2px 0 rgba(7,17,27,.1);" class="palyer_card">
              <ol>
                <li style="float: left;width: 40px;height: 2.5rem">
                  <img src="/static/images/start.png" alt="" style="width: 23px;height: 23px;margin: 9px 7px;">
                </li>
                <li style="float: left;width:calc(100% - 120px);height: 2.5rem;margin: 0">
                  <span>{{item.Subject}}</span>

                </li>
                <li style="float: left;width:60px;height: 2.5rem;margin: 0">
                  <span>{{videoTime(item)}}分钟</span>
                </li>
                <li style="float: left;width: 20px;height: 2.5rem">
                  <div style="width: 10px;height: 10px;border-radius: 50%;background: white;border: 1px solid #333;margin-top: 14px"></div>
                </li>
              </ol>
            </li>
          </ul>
        </div>
      </md-tab-pane>
    </md-tabs>
  </div>
</template>

<script>
  import {Tabs, TabPane,Toast} from 'mand-mobile'
  import VideoPlayer from '../../assets/js/index';
  import util from '../../assets/js/util';
  import {GetVideoList,GetVideoPlayAuth,KeeSession} from '@/api/videoPlayer'
  export default {
    name: "player",
    components:{
      [Tabs.name]:Tabs,
      [TabPane.name]:TabPane,
      [Toast.name]:Toast,
    },
    data(){
      return{
        videoUrl:'',
        videoHeight:'',
        demoData:{},
        isAutoplay:false,
        changeColor:'#333',
        player:'',
        tableData:[],
        timing:0,
        VideoId:"",
        userName:'',
      }
    },
    computed:{
      videoTime(item){
        return function (item) {
          return parseInt(item.Duration / 60);
        }
      }
    },
    methods:{
      Entrance(){
        this.videoHeight = document.documentElement.clientWidth * 0.618 + 'px';
        this.demoData = JSON.parse(this.$store.getters.getVideoData);
        this.checkFull();
        this.changeVideoMode();
        this.getVidoList();
      },

      getVideoUrl(id){
        GetVideoPlayAuth({vid:id}).then(res=>{
          if(res.data.success == 1){
            this.userName = res.data.result.userName;
            this.getVoild(res.data.result);
          }else{
            alert(res.data.result)
          }
        }).catch(error=>{
          alert(error)
        })
      },

      getVidoList(){
        let _this = this;
        GetVideoList({CourseId:this.demoData.CourseId}).then(res=>{
          if(res.data.success == 1){
            this.tableData = res.data.result;
            this.VideoId = res.data.result[0].VideoId;
            this.getVideoUrl(res.data.result[0].VideoId,res =>{
              _this.getVoild(res)
            })
          }else{
            alert(res.data.result)
          }
        }).catch(error=>{
          alert(error)
        })
      },

      changeVideoMode(){
        $(function () {
          $('#J_prismPlayer').find('video').attr('x5-playsinline');
          $('#J_prismPlayer').find('video').attr('loop');
          $('#J_prismPlayer').find('video').attr('autoplay','autoplay');
          $('#J_prismPlayer').find('video').attr('preload','auto');
          $('#J_prismPlayer').find('video').attr('controls');
          $('#J_prismPlayer').find('video').attr('x5-video-player-fullscreen',true)
          $('#J_prismPlayer').find('video').attr('webkit-playsinline',true)
          $('#J_prismPlayer').find('video').attr('x-webkit-airplay',true)
          $('#J_prismPlayer').find('video').attr('playsinline',true)
        })
      },

      palyFull(){

      },
      checkFull(){
        window.onresize = function(){
        };
        var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        if(isFull === undefined) isFull = false;
        return isFull;
      },
      backBtn(){
        this.$router.back()
      },
      playBtn(item){
        this.getVideoUrl(item.VideoId);
        this.VideoId = item.VideoId;
      },
      getVoild(resAuth){

        if(this.player != ""){
          this.player.replayByVidAndPlayAuth(resAuth.cid,resAuth.auth);
        }else {
          this.player = new Aliplayer({
            width:'100%',
            id: 'J_prismPlayer',
            autoplay: false,
            isLive:false,
            format:'m3u8',
            vid:resAuth.cid,//897d97824cc14984ab8fbc74123902f2
            playauth:resAuth.auth,
          });
          this.player.on("play",this.play);
          this.player.on("pause",this.pause);
          this.player.on("timeupdate",this.timeupdate);

        }
      },
      play(){

      },
      pause(){

      },
      timeupdate(){
        if(this.timing < 40){
          this.timing ++
        }else{
          this.saveTime();
          this.timing = 0;
        }
      },
      saveTime(){
        KeeSession({vid:this.VideoId}).then(res=>{
          if(res.data.success == 1){

          }else {
            alert(res.data.result)
          }
        }).catch(error=>{
          alert(error)
        })
      }
    },

    watch:{
      player(NewValue,OldValue){
        console.log(NewValue)
      }
    },
    mounted() {
      this.Entrance();
    }
  }
</script>

<style scoped>

  .player{
    width: 100%;
    height: 100%;
    background: rgb(248, 250, 252);
    /*position: fixed;*/
    /*top: 0;*/
  }
  .courseDetail{
    width: 100%;

  }
  .prism-player{
    width: 100%;
    object-position: 50% 50%;
  }
  .table-title{
    box-sizing: border-box;
    margin-top: -0.4rem;
    border-top: 0.5rem solid #ebecec;
    width: 100%;
    background: #fff;
    line-height: 1.6rem;
    height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: #646566;
    margin-bottom: 0;
    box-shadow: 0 2px 8px 0 rgba(7,17,27,.1);
  }

  .course-title{
    box-sizing: border-box;
    padding: 1rem;
    width: 100%;
    background: #fff;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 2px 8px 0 rgba(7,17,27,.1);
  }
  .course-title h2{
    height: 2.3rem;
    font-size: 1rem;
    margin: 0;
    font-weight: normal;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #ababab;
    overflow: hidden;
    text-overflow: -o-ellipsis-lastline;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .course-title ul{
    margin-top: 5px;
  }
  .course-title ul li{
    width: 32%;
    border-right: 1px solid #ababab;
    display: inline-block;
    color: rgb(84, 92, 99);
    font-size: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
  }
  .course-table{
    margin-bottom: 1.5rem;

  }

  .course-table .palyer_card{
    height: 2.5rem;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 2px 0 rgba(7,17,27,.1);
  }
  .course-table .palyer_card span{
    box-sizing: border-box;
    float: left;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 0.7rem;
    color: rgb(84, 92, 99);
  }
  .course-table .palyer_card:active{
    background: #eaebece0;
  }
  .course-table .palyer_card:hover span{
    color: #87dc24;
  }
  .course-present{
    padding: 1rem;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(7,17,27,.1);
  }
  .course-present h2{
    font-size: 1rem;
    margin: 0;
    font-weight: normal;
    padding-bottom: 0.5rem;
    margin-top: 1rem;
  }
  .course-present p{
    margin: 0;
    font-size: 0.9rem;
    color: rgb(84, 92, 99);
  }
  .course-present span{
    margin: 0;
    font-size: 0.9rem;
    color: rgb(84, 92, 99);
  }
  video{
    object-fit: fill!important;
  }

  .recom-title{
    box-sizing: border-box;
    width: 62%;
    float: left;
    padding-left: 10px;
    height: 4.35rem;
  }
  .recom-list{
    display: block;
    height: 4.4rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ececec;
  }
  .recom-title h5{
    margin: 0;
    font-size: 1rem;
    font-weight: normal;
    height: 2.7rem;
    overflow: hidden;
    text-overflow: -o-ellipsis-lastline;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .recom-title p{
    margin: 0;
    color: rgb(84, 92, 99);font-size: 0.8rem;
    margin-top: 5px;
  }
  .recom-list:hover .recom-title{
    background: #f5f5f5;
  }
</style>
