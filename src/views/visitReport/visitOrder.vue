<template>
  <div class="visit">
    <!--数据卡片-->
    <div class="detailed">
      <div>
        <p style="font-size:1.5rem;margin-left: 10px;color:#1aad19;margin-top:5px;">{{RptRecordNo}}</p>
        <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          报检单位：
          <span>{{OrganName}}</span>
        </p>
        <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          联系方式：
          <span>{{ContactTel}}</span>
        </p>
        <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          服务时间：
          <span>{{ServicePerson}}</span>
        </p>
        <ul class="amount-lit">
          <li v-if="jcf != '0.00'" style="color: #999d9c;font-size: 1rem;">检测费:<span style="color:#1aad19;font-size: 1rem;">{{jcf}}</span></li>
          <li v-if="yf != '0.00'" style="color: #999d9c;font-size: 1rem;">运费:<span style="color:#1aad19;font-size: 1rem;">{{yf}}</span></li>
          <li v-if="jtf != '0.00'" style="color: #999d9c;font-size: 1rem;">交通费:<span style="color:#1aad19;font-size: 1rem;">{{jtf}}</span></li>
          <li v-if="zsf != '0.00'" style="color: #999d9c;font-size: 1rem;">住宿费:<span style="color:#1aad19;font-size: 1rem;">{{zsf}}</span></li>
          <li v-if="qtfy != '0.00'" style="color: #999d9c;font-size: 1rem;">其它:<span style="color:#1aad19;font-size: 1rem;">{{qtfy}}</span></li>
          <li v-if="sbmc != '0'" style="color: #999d9c;font-size: 1rem;">设备:<span style="color:#1aad19;font-size: 1rem;">{{sbmc}}</span></li>
        </ul>
        <p v-if="hj != '0'" style="right:20px; position: absolute;bottom:24px;color:#fff;font-size:1.2rem">合计:&nbsp;&nbsp;{{hj}}￥</p>
      </div>
    </div>
    <!--填写内容-->
    <div class="visit-eval">
      <header style="background: #FFF;">评价</header>
      <textarea
        name="visit-eval"
        rows="6"
        placeholder="填写整体评价"
        v-model="Comment"
        style="font-size:1rem;margin-bottom: -10px;"
      ></textarea>
      <div style="background: #FFFFFF;padding: 0.625rem;">
        <div style="font-size: 1rem;margin-bottom: 10px;margin-top: 5px;margin-left: 5px">回访人员</div>
        <div style="border-bottom: 1px solid #eee;"></div>
        <md-field-item
          v-for="(person, index) in persons"
          :key="index"
          solid
          :title="person.SvPersonalName"
          :content="person.VLevel"
          :addon="`得分：${person.AllScore}`"
          arrow
          @click="evaluatePerson(index)"
        ></md-field-item>
      </div>
    </div>

    <div class="confirm">
      <md-button type="primary" :disabled="disabled" @click.native="postVisitOrder">保存</md-button>
    </div>
  </div>
</template>
<script>
import { InputItem, Field, FieldItem, Icon, Toast, Button } from "mand-mobile";
import { GetBackVisitRecordByAssRecordId, BackVisit } from "@/api/visitreport";
import { GetRptRecordDetailApi } from "@/api/shareorderapi"; //获取提示信息
export default {
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Icon.name]: Icon,
    [Button.name]: Button
  },
  data() {
    return {
      Comment: "",//评价
      disabled: false,
      url: this.$store.getters.url,
      headers: this.$store.getters.sid,
      SettlementId: this.$store.getters.getSettlementId,
      persons: [],
      RptRecordNo: "", //报检编号
      OrganName: "", //报检单位
      ContactTel: "", //联系人及电话
      ServicePerson: "", //服务时间
      jcf: "", //检测费
      yf: "", //运费
      jtf: "", //交通费
      zsf: "", //住宿费
      qtfy: "", //其他费用
      hj: "", //合计
      sbmc: '0' //设备总金额
    };
  },
  beforeRouteEnter(to, from, next) {
    if(from.name == 'detail'){
      next(vm=>{
        vm.postData();//数据查询
        vm.backVisitRecordByAssRecordId();//评价人员列表
        vm.SettlementId = vm.$store.getters.getSettlementId;
      })
    }else {
      next()
    }
  },
  computed: {
    getPostData() {
      let data = {
        SettlementId: this.SettlementId,
        Comment: this.Comment,
        appraiseList: this.persons
      };
      return data;
    }
  },
  activated(){

  },
  mounted() {
    this.postData();//数据查询
    this.backVisitRecordByAssRecordId();//评价人员列表
  },
  methods: {
    /**
     * 根据报检编号获取详细信息
     */
    postData(){
      GetRptRecordDetailApi({ rptRecordId: this.$store.getters.getRptId }).then(res => {
          this.jcf =  res.data.result.svcRcd.CheckPrice; //检测费
          this.yf = res.data.result.svcRcd.RunPrice; //运费
          this.jtf = res.data.result.svcRcd.JtPrice; //交通费
          this.zsf = res.data.result.svcRcd.ZsPrice; //住宿费
          this.qtfy = res.data.result.svcRcd.OtherPrice; //其他费用
          this.hj =
            parseFloat(res.data.result.svcRcd.CheckPrice) +
            parseFloat(res.data.result.svcRcd.RunPrice) +
            parseFloat(res.data.result.svcRcd.JtPrice) +
            parseFloat(res.data.result.svcRcd.ZsPrice) +
            parseFloat(res.data.result.svcRcd.OtherPrice);

          // 如果有设备列表
          if (res.data.result.svcPartsList.length != 0) {
            //设备列表
            let num  = Number()
            res.data.result.svcPartsList.forEach(item =>{
              num += (parseFloat(item.PartsPrice))
            })
            this.sbmc = num.toFixed(2);
            this.hj = (parseFloat(num) + this.hj).toFixed(2);
          }
          this.RptRecordNo = res.data.result.rptRcd.RptRecordNo; //报检编号
          this.OrganName = res.data.result.rptRcd.OrganName; //报检单位
          this.ContactTel =
            res.data.result.rptRcd.ContactBy + res.data.result.rptRcd.ContactTel; //联系人及电话
          this.ServicePerson = res.data.result.svcRcd.CrcdDate; //服务人员及服务时间
        }
      );
    },
    evaluatePerson(index) {
      this.$router.push({ name: "evaluate" });
      this.$store.dispatch("editVisitPersonDetail", index);
    },
    // 保存
    postVisitOrder() {
      Toast.loading('保存中...')
      BackVisit(this.getPostData, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            alert("保存成功");
            this.$router.replace({
              name: "visit",
              params: {
                sid: this.$store.getters.sid,
                actOder:'刷新'
              }
            });
          } else {

            alert(JSON.stringify(res.data.result));
          }
        })
        .catch(err => {

          if (err) {
            alert("网路异常，请检查您的网络！");
          }
        });
    },
    // 获取评价用户列表
    backVisitRecordByAssRecordId(){
      GetBackVisitRecordByAssRecordId({ assRecordId: this.$store.getters.getAssRecordId }, this.$store.getters.sid).then(res => {
          // 返回成功
          if (res.data.success == 1) {
            // 保存当前评价人列表
            this.$store.dispatch("createVisitPerson", res.data.result.personAppraiseList);

            // 是否有评价
            if (res.data.result.Comment) {
              this.Comment = res.data.result.Comment;
            } else {
              this.Comment = "";
            }

            // 获取当前评价人员列表
            this.persons = this.$store.getters.visitPersons;

          } else {
            alert(JSON.stringify(res.data.result));
          }
      }).catch(err => {
          if (err) {
            alert("网络异常，请检查您的网络!");
          }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// 设备列表
.amount-lit {
  margin-left: 20px;
  li {
    width: 33%;
    float: left;
  }
}
.detailed {
  background-image: url(../../../static/images/vistback.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: calc(100% + 60px);
  border-radius: 10px;
  margin-top: 10px;
  font-size: 1rem;
  height: 550px;
  position: relative;
  margin-left: -30px;
  div{
    padding: 30px;
    p {
    margin-left: 20px;
    color: #999d9c;
    span {
      color: #1aad19;
      font-size: 1rem;
    }
  }
  }
}
.visit {
  margin: 0!important; ;
  border: 1rem solid #eee;
  background: $bg-color;
  display: flex;
  flex-direction: column;

  .visit-eval {
    border: 0.7rem solid #fff;
    header {
      padding: 1rem;
    }

    textarea {
      width: 100%;
      padding: 1rem;
      font-size: 0.9rem;
      border: 1px solid #eee;
      outline: none;
      box-sizing: border-box;
      box-shadow: 0 0 5px #eee;
      color: #666;
    }
  }
  .md-field{
    margin: 0!important;
  }
  .confirm{
    padding-top: 20px;
  }
}
</style>
