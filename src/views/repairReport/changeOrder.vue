<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="edit">
      <div>
        <md-field>
          <md-input-item
            v-show="isShow"
            v-model="unitName"
            title="机构名称"
            placeholder="请输入报检机构名称"
            is-amount
            @change="unitNameChange"
          ></md-input-item>
          <md-input-item v-model="contactBy" title="联系人员" placeholder="请输入联系人姓名"></md-input-item>
          <md-input-item title="联系方式" type="phone" v-model="phone" placeholder="请输入联系人电话"></md-input-item>
          <md-input-item title="报修问题" type="text" v-model="problem" placeholder="请输入问题实际情况"></md-input-item>
        </md-field>
        <div class="image-list">
          <ul class="image-reader-list">
            <li
              class="image-reader-item"
              v-for="(img, index) in problemImg"
              :key="index"
              :style="{
            'backgroundImage': `url(${img.url})`,
            'backgroundPosition': 'center center',
            'backgroundRepeat': 'no-repeat',
            'backgroundSize': 'cover'
            }"
            >
              <md-tag
                class="image-reader-item-del"
                size="small"
                shape="quarter"
                fill-color="#111A34"
                type="fill"
                font-color="#fff"
                @click.native="onDeleteImage(index)"
              >
                <md-icon name="close"></md-icon>
              </md-tag>
            </li>
            <li class="image-reader-item add">
              <md-image-reader
                name="reader0"
                @select="onReaderSelect"
                @complete="onReaderComplete"
                @error="onReaderError"
                is-multiple
              ></md-image-reader>
              <md-icon name="camera" size="md" color="#CCC"></md-icon>
              <p>添加图片</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="save">
        <md-button :type="type" :disabled="disabled" @click="postInfo">保存</md-button>
      </div>

      <transition
        type="transition"
        appear
        enter-active-class="animated bounceInLeft active"
        leave-active-class="animated bounceOutRight active"
        appear-class="animated bounceInLeft"
        :duration="{enter: 500, leave: 500}"
      >
        <div class="dispatch-person">
          <md-selector
            v-model="isShowUnit"
            default-value="2"
            :data="UnitList"
            max-height="320px"
            title="报检机构"
            large-radius
            @choose="unitNameVal"
          ></md-selector>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import {
  InputItem,
  Field,
  Icon,
  FieldItem,
  Dialog,
  ImageReader,
  Tag,
  Toast,
  Button,
  Popup,
  PopupTitleBar,
  Selector
} from "mand-mobile";
import imageProcessor from "mand-mobile/lib/image-reader/image-processor";
import uuid from "../../../static/script/uuid.js";
import {
  GetRptRecordById,
  UploadFile,
  EditRpt,
} from "@/api/repairreport";
export default {
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [ImageReader.name]: ImageReader,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    [Selector.name]: Selector
  },
  data() {
    return {
      contactBy: "",
      phone: "",
      problem: "",
      productList: [],
      problemImg: [],
      imageList: [],
      getImgsName: [],
      guid: uuid(16, 16),
      isUpload: true,
      disabled: false,
      type: "primary",
      url: "",
      headers: {},
      id: "", //记录id
      unitName: "", //报检机构选择
      isShowUnit: false, //机构搜索页
      UnitList: [], //搜索框数据
      num: 0, //用户id权限
      productName:"",//产品名称
    };
  },

  mounted() {
    this.num = this.$store.state.RoleId;
    this.fetchData();
  },
  created () {
  this.$loading.hide()
  },
  computed: {
    //组织数据
    getData() {
      let data = {
        RptRecordId: this.id,
        Problem: this.problem,//问题
        ContactTel: this.phone,//电话
        ProblemImg: JSON.stringify(this.getImgsName),//问题图片
        // productList: {"productName":this.productName},//设备列表
        imgTempGuid: this.guid,//图片格式
        OrganizId:this.OrganizId//报检解机构id
      };
      return data;
    },
    getProducts() {
      return this.$store.getters.products;
    },
    //权限小于7的显示
    isShow() {
      return this.$store.state.RoleId < 7;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "product" || to.name == "editProduct") {
      from.meta.keepAlive = true;
      next();
    } else {
      from.meta.keepAlive = false;
      next();
    }
  },
  //搜索框变化监听
  watch: {
    unitName: {
      handler(newVal, oldVal) {
        if (newVal.length < 2) {
          this.isSearch = true;
        }
      },
      deep: true
    }
  },
  methods: {
    //输入的检索条件
    unitNameChange(name, value) {
      if (this.isSearch) {
        GetUnitbyName({ unitName: value }).then(data => {
          this.UnitList = [];
          data.data.result.forEach((item, index) => {
            this.UnitList.push({
              value: item.OrganizId,
              text: item.OrganName
            });
          });
          this.isShowUnit = true;
        });
      }
    },
    // 搜索框
    unitNameVal(value, text) {
      this.unitName = value.text;
      this.OrganizId = value.value;
      this.isShowUnit = false;
      this.isSearch = false;
    },
    fetchData() {
      alert("数据加载中...");
      GetRptRecordById(
        { rptRecordId: this.$store.getters.recordId },
        this.$store.getters.sid
      )
        .then(res => {
          console.log(res);
          if (res.data.success == 1) {
            alert("加载成功");
            this.$store.dispatch("editOrder", res.data.result);
            this.contactBy = res.data.result.ContactBy;
            this.phone = res.data.result.ContactTel;
            this.problem = res.data.result.Problem;
            this.unitName = res.data.result.OrganName;
            if (JSON.parse(res.data.result.ProblemImg).length > 0) {
              let imgs = JSON.parse(res.data.result.ProblemImg);
              this.getImgsName = JSON.parse(res.data.result.ProblemImg);
              if (imgs.length > 0)
                for (var i = 0; i < imgs.length; i++) {
                  let _img = {
                    url:
                      this.$store.getters.url +
                      "/userfile/problemImg/" +
                      res.data.result.RptRecordId +
                      "/" +
                      imgs[i].name
                  };
                  // for (let img of imgs) {
                  //   let _img = {
                  //     url:
                  //       this.$store.getters.url +
                  //       "/userfile/problemImg/" +
                  //       res.data.result.RptRecordId +
                  //       "/" +
                  //       img
                  //   };
                  this.problemImg.push(_img);
                }
            }
            this.productList = res.data.productList;
            this.$store.dispatch("changeProduct", res.data.result.productList);
            Toast.hide();
          } else {
            alert("加载失败");
          }
        })
        .catch(err => {
          alert("连接失败，检查您的网络");
        });
    },
    onClick(type) {
      this.$router.push({ name: "product" });
      this.$store.dispatch("editOrder", this.getData);
    },
    deleteProduct(index) {
      this.getProducts.splice(index, 1);
    },
    onReaderSelect(name, { files }) {
      Toast.loading("图片读取中...");
    },
    onReaderComplete(name, { dataUrl, file }) {
      Toast.hide();
      const demoImageList = this.problemImg;
      let initSize = 1 * 1024 * 1024;
      let postImg = {};
      let len = demoImageList.length;
      if (this.isUpload) {
        this.isUpload = false;
        if (file.size > initSize) {
          imageProcessor({
            dataUrl,
            quality: 0.3
          }).then(({ dataUrl }) => {
            dataUrl && demoImageList.push({ url: dataUrl });
          });
        } else {
          demoImageList.push({ url: dataUrl });
        }
        setTimeout(() => {
          this.problemImg = demoImageList;
          postImg.imgTempGuid = this.guid;
          postImg.fileStr = this.problemImg[this.problemImg.length - 1]["url"];
          UploadFile(postImg, this.$store.getters.sid)
            .then(res => {
              if (res.data.success == 1) {
                alert("上传成功");
                this.getImgsName.push({
                  name: res.data.result
                });
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
      const demoImageList = this.problemImg;
      demoImageList.splice(index, 1);

      this.getImgsName.splice(index, 1);
      this.problemImg = demoImageList;
    },
    checkData(txt) {
      setTimeout(() => {
        Toast.hide();
        alert(txt);
        this.type = "primary";
        this.disabled = false;
      }, 500);
    },
    changeProduct(index) {
      this.$router.push({ name: "editProduct", params: { index: index } });
      this.$store.dispatch("editOrder", this.getData);
    },
    postInfo() {
      // 服务人员必须填写检测机构
      if (this.num < 7) {
        if (this.unitName.length == 0) {
          this.checkData("报检机构不能为空！");
          return;
        }
      }
      let data = this.getData;
      this.type = "disabled";
      this.disabled = true;
      if (!this.contactBy) {
        this.checkData("联系人不能为空！");
      } else if (this.contactBy.length > 5) {
        this.checkData("联系人姓名不能超过5个字！");
      } else if (!this.phone) {
        this.checkData("联系方式不能为空！");
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.checkData("电话号码不正确！");
      } else if (!this.problem) {
        this.checkData("情况说明不能为空！");
      } else {
        if (this.isUpload) {
          Toast.hide();
          EditRpt(data, this.$store.getters.sid)
            .then(res => {
              Toast.loading("提交中");
              if (res.data.success == 1) {
                setTimeout(() => {
                  Toast.hide();
                  this.type = "primary";
                  this.disabled = false;
                  this.$router.replace({
                    name: "report",
                    params: { sid: this.$store.getters.sid }
                  });
                  this.$store.dispatch("clearProduct");
                }, 500);
              } else {
                alert(res.data.result);
              }
            })
            .catch(err => {
              alert("保存失败，请检查您当前网络！");
            });
        } else {
          alert("文件上传中，请稍后...");
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.edit {
  margin: 0!important; ;
  border: 1.5rem solid #eee;
  background: #eee;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .image-list {
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
        background: #eee;
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
  .product-list {
    padding: 0;
    margin: 0;
    .product {
      padding: 0.8rem 0;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .save {
    background: $bg-color;
    margin-top: 3rem;
  }
}
</style>
