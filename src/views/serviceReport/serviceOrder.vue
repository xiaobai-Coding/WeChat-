<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="dispatch-order">

      <!-- 信息卡片 -->
      <div class="serverCard">
        <ul>
          <li style="font-size:1.5rem;color:#1aad19;">{{RptRecordNo}}</li>
          <li style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">报检单位：<span>{{ShortName}}</span></li>
          <li style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">联系方式：<span>{{ContactBy}}</span></li>
          <li style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">报修时间：<span>{{RptRecordDate}}</span></li>
          <li style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><p style="float:left;">派修信息：</p>
            <span style="float:left;"><p style="background:#1aad19;color:#fff;width:55px;text-align:center;float:left;">{{RecordBy}}</p>&nbsp;&nbsp;{{AssRecordDate}}</span>
          </li>
        </ul>
      </div>

      <div class="dispatch-info">
        <!--服务信息-->
        <md-field>
          <md-input-item title="服务单编号" placeholder="请输入服务编号" align="right" v-model.trim="ServiceNo" type="text"/>
          <md-field-item ref="start" name="name" title="服务开始日期" :arrow="StartDate == ''" align="right" :content="StartDate" @click.native="isStartShow = true"></md-field-item>
          <md-field-item name="name" title="服务结束日期" :arrow="EndDate == ''" align="right" :content="EndDate" @click.native="isEndShow = true"></md-field-item>
          <md-input-item solid type="number" title="实际工时" placeholder="请输入计划工时" align="right" v-model.trim="RealHours">
            <span slot="right">小时</span>
          </md-input-item>
          <md-input-item solid title="问题现象" align="right" readonly />
          <div class="ct-textarea">
                  <textarea
                    name="problem"
                    placeholder="请输入问题现象描述"
                    rows="4"
                    v-model.trim="Problem"
                    style="font-size:1rem"
                  ></textarea>
          </div>
          <md-input-item solid title="维修情况" align="right" arrow="arrow-right" readonly />
          <div class="ct-textarea">
                  <textarea
                    name="condition"
                    placeholder="请输入维修情况"
                    rows="4"
                    v-model.trim="Condition"
                    style="font-size:1rem"
                  ></textarea>
          </div>
        </md-field>

        <!--配件列表-->
        <md-field>
          <md-field title="配件列表" style="margin: 0 -1.125rem;">
            <div slot="action" @click="showPopUp" id="addPro" >添加</div>
            <md-field-item v-for="(product, index) in getProduct" @click="serviceProductDetail(index)" :key="index" align="right">
              <span slot="left" style="font-size: 1rem;width: 14.3rem;text-align: left"><p style="color: #2a78dc;display: inline-block">{{product.PartsName}}</p>({{product.Qty}}{{product.Unit}})&nbsp;<p style="color: #333;display: inline-block">{{product.Price}}/元</p></span>
              <span slot="right" style="display: inline-block;">
                <md-icon name="delete" color="red" @click="deleteServiceProduce(index)" style="font-size: 1.5rem;width: 30px;height: 30px"></md-icon>
              </span>
            </md-field-item>
            <div style="dispaly: flex; font-size: 1rem; color:#666;" slot="footer">合计：{{allPrice}} 元</div>
          </md-field>
          <md-input-item solid type="number" title="检修费" align="right" v-model.trim="CheckPrice"><span slot="right">元</span></md-input-item>
          <md-input-item solid type="number" title="运费" align="right" v-model.trim="RunPrice"><span slot="right">元</span></md-input-item>
          <md-input-item solid type="number" title="交通费" align="right" v-model.trim="JtPrice"><span slot="right">元</span></md-input-item>
          <md-input-item solid type="number" title="住宿费" align="right" v-model.trim="ZsPrice"><span slot="right">元</span></md-input-item>
          <md-input-item solid type="number" title="其他费用" align="right" v-model.trim="OtherPrice"><span slot="right">元</span></md-input-item>
          <div style="color: rgb(102, 102, 102);float: right;padding: 0.6rem 0;font-size: 1rem">费用总计：<span style="margin-right: 5px;color: red">{{allCost}}</span>元</div>
          <div class="image-list" style="margin-top: 20px">
            <ul class="image-reader-list">
              <li class="image-reader-item" v-for="(img, index) in serviceImg" :key="index" :style="{'backgroundImage': `url(${img.url})`,'backgroundPosition': 'center center','backgroundRepeat': 'no-repeat','backgroundSize': 'cover'}">
                <md-tag class="image-reader-item-del" size="small" shape="quarter" fill-color="#111A34" type="fill" font-color="#fff" @click.native="onDeleteImage(index)">
                  <md-icon name="close"></md-icon>
                </md-tag>
              </li>
              <li class="image-reader-item add" style="background: #CCC">
                <md-image-reader name="reader0" @select="onReaderSelect" @complete="onReaderComplete" @error="onReaderError" is-multiple></md-image-reader>
                <md-icon name="camera" size="md" color="#333" style="font-size: 22px"></md-icon>
                <p style="font-size: 0.8rem;color: #333;">添加图片</p>
              </li>
            </ul>
          </div>
        </md-field>


        <!--服务评价-->
        <md-field style="padding-bottom:0px;">
          <md-field-item title="技术水平" solid >
            <md-radio name="高" v-model="Technical" label="高" inline />
            <md-radio name="中" v-model="Technical" label="中" inline />
            <md-radio name="低" v-model="Technical" label="低" inline />
          </md-field-item>
          <md-field-item title="服务态度" solid>
            <md-radio name="好" v-model="Requiements" label="好" inline />
            <md-radio name="一般" v-model="Requiements" label="一般" inline />
            <md-radio name="差" v-model="Requiements" label="差" inline />
          </md-field-item>
          <md-input-item solid title="建议要求" align="right" arrow="arrow-right" readonly />
          <div class="ct-textarea">
            <textarea
              name="attitude"
              placeholder="请输入建议或要求"
              rows="5"
              v-model.trim="Attitude"
              style="font-size:1rem"
            ></textarea>
          </div>
        </md-field>
        <md-field style="">
          <md-field-item
            :arrow="SignDate == ''"
            name="name"
            title="签字日期"
            align="right"
            :content="SignDate"
            @click.native="isSignShow = true"
          ></md-field-item>
          <md-input-item
            solid
            title="签字人"
            placeholder="请输入签字人姓名"
            align="right"
            v-model.trim="SignBy"
          />
          <md-input-item
            solid
            type="phone"
            title="手机号"
            placeholder="请输入签字人电话号码"
            align="right"
            v-model.trim="Telephone"
          />
        </md-field>
      </div>
      <div class="confirm">
        <md-button type="primary" :disabled="disabled" @click="postData">保存</md-button>
      </div>

      <!--弹框-->
      <md-date-picker v-model="isStartShow" type="custom" title="选择服务开始日期" :custom-types="['yyyy', 'MM','dd', 'hh', 'mm']" :default-date="currentDate" @confirm="onStartDate"></md-date-picker>
      <md-date-picker v-model="isEndShow" type="custom" title="选择服务结束日期" :custom-types="['yyyy', 'MM','dd', 'hh', 'mm']" :default-date="currentDate" @confirm="onEndDate"></md-date-picker>
      <md-date-picker v-model="isSignShow" type="custom" title="选择签字日期" :custom-types="['yyyy', 'MM','dd']" :default-date="currentDate" @confirm="onSignDate"></md-date-picker>


      <md-popup v-model="isPopupShow" position="bottom" style="background: #eee" :mask-closable="false">
        <service-product v-on:onloadOk="dataIsOk" :OrderIndex="OrderIndex" :eventCond="eventCond"></service-product>
      </md-popup>

    </div>
  </transition>
</template>

<script>
import {
  Selector,
  Field,
  FieldItem,
  InputItem,
  CheckList,
  DatePicker,
  ImageReader,
  Tag,
  Button,
  Toast,
  Icon,
  Radio,
  Landscape,
  TabBar,
  Swiper,
  SwiperItem,
  Popup,
  PopupTitleBar,

} from "mand-mobile";

import imageProcessor from "mand-mobile/lib/image-reader/image-processor";
import uuid from "../../../static/script/uuid.js";
import {
  GetServicePartsListByServiceId,
  GetServiceRecordByAssId,
  ProblemService
} from "@/api/servicereport";
import { UploadFile } from "@/api/servicereport";//服务单照片上传
import { GetRptRecordDetailApi } from "@/api/shareorderapi"; //获取提示信息
import serviceProduct from "@/views/serviceReport/serviceProduct";//添加组件
export default {
  components: {
    [Selector.name]: Selector,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [CheckList.name]: CheckList,
    [ImageReader.name]: ImageReader,
    [DatePicker.name]: DatePicker,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Radio.name]: Radio,
    [Icon.name]: Icon,
    [Landscape.name]: Landscape,
    [TabBar.name]: TabBar,
    [Swiper.name]: Swiper,
    [SwiperItem.name]: SwiperItem,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
  
    serviceProduct
  },
  inject: ["reload"],
  data() {
    return {
      showMaskClosable: false, //遮罩层
      AssRecordId: this.$store.getters.getAssRecordId, //只有在获取到派修id才能提交
      SettlementId: "",
      ServiceNo: "",
      StartDate: "",
      EndDate: "",
      RealHours: "",
      Problem: "",
      Condition: "",//维修情况
      CheckPrice: 0, //检修费
      JtPrice: 0, //交通费
      ZsPrice: 0, //住宿费
      RunPrice: 0, //运费
      OtherPrice: 0, //其他费用
      SignBy: "", //签字人
      SignDate: "", //签字时间
      Telephone: "", // 签字人电话
      Attitude: "", //用户评价
      Technical: "高", //技术水平  高中低
      Requiements: "好", //服务态度  好 一般 差
      PartsPrice: "", //配件总额
      ServicePhotos: "",
      partsList: [],//设备列表
      isSelectorShow: false,
      currentDate: new Date(),
      isStartShow: false,
      isEndShow: false,
      isSignShow: false,
      url: this.$store.getters.url,//图片保存地址
      headers: this.$store.getters.sid,
      serviceImg: [],//图片地址列表
      getImgsName: [],//图片名称列表
      disabled: false,
      type: "primary",
      isUpload: true,
      guid: uuid(16, 16),
      ShortName: "", //报检单位
      ContactBy: "", //报修姓名与电话
      RptRecordDate: "", //报修时间
      RptRecordNo: "", //报检编号
      RecordBy: "", //派修用户名
      AssRecordDate: "", //派修时间
      isPopupShow:false,//弹框显示
      OrderIndex:0,//编辑的序号
      eventCond:true,//点击编辑与新增都取反值
    };
  },
  created() {
    this.SettlementId = this.$store.getters.getSettlementId;
    if (this.SettlementId) {
      GetServicePartsListByServiceId({ serviceId: this.SettlementId }, this.$store.getters.sid).then(res => {
        if (res.data.success) {
          this.$store.dispatch("createServiceProducts", res.data.result);
        } else {
          alert(JSON.stringify(res.data.result));
        }
      }).catch(err => {
          if (err) {
            alert("网络异常，请检查您的网络！");
          }
      });
    }
  },
  // 清空配件列表
  beforeRouteLeave(to,from,next){
    this.$store.dispatch("clearServiceProduct");
    next()
  },
  mounted(){
    //获取列表信息
    GetRptRecordDetailApi({ rptRecordId: this.$store.getters.getRptId }).then(res => {
        this.ShortName = res.data.result.rptRcd.OrganName;
        this.ContactBy = res.data.result.rptRcd.ContactBy + res.data.result.rptRcd.ContactTel; //报修姓名与电话
        this.RptRecordDate = res.data.result.rptRcd.RecordDate; //报修时间
        this.RptRecordNo = res.data.result.rptRcd.RptRecordNo; //报检编号
        this.RecordBy = res.data.result.assRcd.RecordBy; //派修用户名
        this.AssRecordDate = res.data.result.assRcd.RecordDate; //派修时间
      }
    );
    //编辑进行数据请求
    if (this.SettlementId) {
      //加载服务订单数据
      GetServiceRecordByAssId({ assRecordId: this.AssRecordId }, this.$store.getters.sid).then(res => {
          if (res.data.success == 1) {
            let data = res.data.result;
            this.Condition = data.Condition;
            this.ServiceNo = data.ServiceNo;
            this.StartDate = data.StartDate;
            this.EndDate = data.EndDate;
            this.RealHours = data.RealHours;
            this.Problem = data.Problem;
            this.CheckPrice = data.CheckPrice;
            this.JtPrice = data.JtPrice;
            this.ZsPrice = data.ZsPrice;
            this.RunPrice = data.RunPrice;
            this.OtherPrice = data.OtherPrice;
            this.SignBy = data.SignBy;
            this.SignDate = data.SignDate;
            this.Telephone = data.Telephone;
            this.PartsPrice = data.PartsPrice;
            this.Attitude = data.Attitude;
            this.Technical = data.Technical;
            this.Requiements = data.Requiements;
            if (JSON.parse(data.ServicePhotos).length > 0) {
              let imgs = JSON.parse(data.ServicePhotos);//请求到的图片名称列表
              this.getImgsName = imgs;
              if (imgs.length > 0)
                for (var i = 0; i < imgs.length; i++) {
                  let _img = {url: this.url + "/userfile/serviceImg/"+res.data.result.SettlementId +'/'+ imgs[i].name};
                  this.serviceImg.push(_img);
                }
            }
          } else {
          }
        })
        .catch(err => {
          if (err) {
            alert("网络异常，请检查您的网络！");
          }
        });
    }
  },
  destroyed(){
    let self = this
    // window.removeEventListener('popstate', self.PhoneBack(), false);//false阻止默认事件
  },
  computed: {
    allCost(){
      if(this.CheckPrice == ''){
        this.CheckPrice = 0
      }else if(this.RunPrice == ''){
        this.RunPrice = 0
      }else if(this.JtPrice==''){
        this.JtPrice = 0
      }else if(this.ZsPrice == ''){
        this.ZsPrice = 0
      }else if(this.OtherPrice == ''){
        this.OtherPrice = 0
      }
      return parseFloat(this.allPrice) + parseFloat(this.CheckPrice) + parseFloat(this.RunPrice) + parseFloat(this.JtPrice) + parseFloat(this.ZsPrice) + parseFloat(this.OtherPrice)
    },
    //组织所有数据
    getData() {
      let data = {
        AssRecordId: this.AssRecordId,
        ServiceNo: this.ServiceNo,
        StartDate: this.StartDate,
        EndDate: this.EndDate,
        RealHours: this.RealHours,
        Problem: this.Problem,
        Condition: this.Condition,
        CheckPrice: this.CheckPrice,
        JtPrice: this.JtPrice,
        ZsPrice: this.ZsPrice,
        RunPrice: this.RunPrice,
        OtherPrice: this.OtherPrice,
        SignBy: this.SignBy,
        SignDate: this.SignDate,
        Telephone: this.Telephone,
        partsList: this.partsList,
        PartsPrice: (this.allPrice).toString(),
        Attitude: this.Attitude,
        Technical: this.Technical,
        Requiements: this.Requiements,
        ServicePhotos: JSON.stringify(this.getImgsName),
        imgTempGuid: this.guid,
      };
      return data;
    },
    //获取所有配件产品
    getProduct() {
      console.log(this.$store.getters.getServiceProduct)
      this.partsList = this.$store.getters.getServiceProduct;
      return this.partsList;
    },
    //结算总额
    allPrice() {
      this.partsList = this.$store.getters.getServiceProduct;
      let allprice = Number();
      for (let price of this.partsList) {
        allprice += parseFloat(price.PartsPrice);
      }
      return allprice;
    }
  },
  methods: {
    /**
     * 监听返回键
     */
    PhoneBack(){
      this.$router.push({'name':'detail'})
    },
    // 子传的填写完成
    dataIsOk(data){
      this.isPopupShow = false
    },
    //添加设备
    showPopUp() {
      this.OrderIndex = -1;//-1为新增
      this.eventCond = !this.eventCond;//表示点击了增加按钮
      this.isPopupShow = true
    },
    //删除配置列表
    deleteServiceProduce(index) {
      this.$store.dispatch("deleteServiceProcudt", index);
    },
    // 修改设备列表
    serviceProductDetail(index) {
      this.$store.dispatch("editServiceProductDetail", index);
      this.OrderIndex = index;//列表的第几个数据
      this.eventCond = !this.eventCond;//表示点击了修改按钮
      this.isPopupShow = true
    },
    //时间格式化
    formatDate(data, name) {
      let month, day, hour, minute;
      if (data[1].value < 10) {
        month = "0" + data[1].value;
      } else {
        month = data[1].value;
      }

      if (data[2].value < 10) {
        day = "0" + data[2].value;
      } else {
        day = data[2].value;
      }

      if (name === "SignDate") {
        return data[0].value + "-" + month + "-" + day;
      } else {
        if (data[3].value < 10) {
          hour = "0" + data[3].value;
        } else {
          hour = data[3].value;
        }
        if (data[4].value < 10) {
          minute = "0" + data[4].value;
        } else {
          minute = data[4].value;
        }
        return (
          data[0].value + "-" + month + "-" + day + " " + hour + ":" + minute
        );
      }
    },
    onStartDate(data) {
      this.StartDate = this.formatDate(data);
    },
    onEndDate(data) {
      this.EndDate = this.formatDate(data);
    },
    onSignDate(data) {
      this.SignDate = this.formatDate(data, "SignDate");
    },
    onReaderSelect(name, { files }) {
      alert("加载中...");
    },
    //照片添加
    onReaderComplete(name, { dataUrl, file }) {
      Toast.hide();
      const demoImageList = this.serviceImg;//暂存图片地址列表
      let initSize = 1 * 1024 * 1024;
      let postImg = {};
      let len = this.serviceImg.length;//图片地址列表长度
      if (this.isUpload) {
        this.isUpload = false;
        if (file.size > initSize) {//判断图片是否为大图
          imageProcessor({dataUrl, quality: 0.3}).then(({ dataUrl }) => {
            dataUrl && demoImageList.push({ url: dataUrl });
          });
        } else {
          demoImageList.push({ url: dataUrl });
        }

        setTimeout(() => {
          this.serviceImg = demoImageList;
          postImg.imgTempGuid = this.guid;
          postImg.fileStr = this.serviceImg[this.serviceImg.length - 1]["url"];
          postImg.sid = this.headers;
          UploadFile(postImg, this.$store.getters.sid).then(res => {
              if (res.data.success == 1) {
                alert("上传成功");
                this.getImgsName.push({ name: res.data.result });
                this.isUpload = true;
              } else {
                this.isUpload = true;
              }
            })
            .catch(err => {
              if (err) {
                alert("网络连接有问题！");
              }
            });
        }, 500);
      } else {
        alert("图片上传中...请稍后");
      }

    },
    onReaderError(name, { msg }) {
      alert(msg);
    },
    onDeleteImage(index) {
      const demoImageList = this.serviceImg;
      demoImageList.splice(index, 1);
      this.getImgsName.splice(index, 1);
      this.serviceImg = demoImageList;
    },

    /**
     * 数据保存
     * ProblemService （提交函数）
     */
    postData() {
      var reg = /^[0-9a-zA-Z]+$/
      if (!this.getData.ServiceNo) {
        alert("服务单号不能为空！");
      } else if(!reg.test(this.getData.ServiceNo)){
        alert("服务单号只能为数字或字母！");
      }else if (!this.getData.StartDate) {
        alert("服务开始日期不能为空！");
      } else if (!this.getData.EndDate) {
        alert("服务结束日期不能为空！");
      } else if (!this.getData.RealHours) {
        alert("实际工时不能为空！");
      } else if (!this.getData.SignBy) {
        alert("签字人不能为空！");
      } else if (!this.getData.SignDate) {
        alert("签字日期不能为空！");
      } else if (!this.getData.Telephone) {
        alert("签字人电话不能为空！");
      } else if (!/^1[3456789]\d{9}$/.test(this.getData.Telephone)) {
        alert("电话格式不正确！");
      } else {
        Toast.hide();
        ProblemService(this.getData, this.$store.getters.sid).then(res => {
            if (res.data.success == 1) {
              alert(res.data.result);
              this.serviceImg = [];
              this.getImgsName = [];
              this.$store.dispatch("clearServiceProduct",);
              this.$router.push({name:'service',
                params:{
                  actOder:'刷新'
                }
              });
            } else {
              alert(res.data.result);
            }
        }).catch(err => {
            alert("连接失败，请检查您的网络！");
        });
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.serverCard {
  background-image: url(../../../static/images/serviceback.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: calc(100% + 70px);
  height: 450px;
  border-radius: 14px;
  margin-left: -35px;

  ul {
    padding: 45px;
    li {
      font-size: 1rem;
      color: #999d9c;
      span {
        color: #1aad19;
      }
    }
  }
}
.dispatch-order {
  position: relative;
  margin: 0!important; ;
  border: 1rem solid #eee;
  background: #eee;
  .dispatch-info {
    border: 0.7rem solid #fff;
    /*height: 100%;*/
    display: flex;
    flex-direction: column;
    #addPro {
      dispaly: flex;
      align-items: center;
      color: $color;
      font-size: 1rem;
    }
    .image-list {
      background: #ffffff;
      margin-left: 0.125rem;
      margin-right: 0.125rem;
      .image-reader-list {
        float: left;
        width: 96%;
        padding-left: 4%;
        .image-reader-item {
          position: relative;
          float: left;
          width: 20.5%;
          padding-bottom: 20.5%;
          margin-bottom: 0.5rem;
          margin-right: 2%;
          box-shadow: 0 5px 20px rgba(197, 202, 213, 0.25);
          box-sizing: border-box;
          background-size: cover;
          list-style: none;
          border-radius: 4px;
          overflow: hidden;
          :nth-of-type(4n) {
            margin-right: 0;
          }
          &.add .md-icon {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.5;
          }

          p {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            margin-top: 15px;
            font-size: 22px;
            color: #ccc;
            text-align: center;
          }
          .image-reader-item-del {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 3;
            opacity: 0.8;
          }
          .md-icon-close {
            font-size: 24px;
          }
        }
      }
    }
  }
  .ct-textarea {
    > textarea {
      width: 100%;
      padding: 1rem;
      box-sizing: border-box;
      border: 1px solid #eee;
      font-size: 0.9rem;
      color: #666;
      outline: none;
    }
  }
  .md-field{
    margin: 0!important;
    padding: 0!important;
  }
  .md-field-item-right{
    font-size: 5rem!important;
  }
  .confirm{
    padding: 0.5rem 0;
  }

}
</style>

