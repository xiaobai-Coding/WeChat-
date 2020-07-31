<!-- 添加报修， -->
<template>
  <transition type="transition" mode="out-in" appear name="fade">
    <div class="add add-Style" :style="{height:htmlHeight}">
      <div class="input-info">
        <md-field>
          <md-input-item v-model="unitName" title="机构名称" placeholder="请输入报修机构全称" is-amount readonly></md-input-item>
          <md-input-item v-model="contactBy" title="联系人员" placeholder="请输入机构联系人姓名" style="font-size:20px;"></md-input-item>
          <md-input-item title="联系方式" type="phone" v-model="phone" placeholder="请输入机构联系人电话"></md-input-item>
          <md-textarea-item
            title="报修问题"
            class="example"
            :autosize="true"
            :rows="1"
            placeholder="请输入问题实际情况"
            v-model="problem"
            style="font-size:20px;"
          />
          <!--<md-input-item title="报修问题" type="text" v-model="problem" placeholder="请输入问题实际情况"></md-input-item>-->
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
            <li class="image-reader-item add" style="margin-top: 0px;background: #ccc">
              <md-image-reader name="reader0" @select="onReaderSelect" @complete="onReaderComplete" @error="onReaderError" is-multiple></md-image-reader>
              <md-icon name="camera" size="lg" color="#333" style="font-size: 30px"></md-icon>
              <p style="font-size: 0.8rem;margin-top: 10px;color: #333">添加图片</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="save">
        <md-button :type="type" :disabled="disabled" @click="postInfo">提交</md-button>
      </div>

    </div>
  </transition>
</template>

<script>
  import {
    InputItem,
    Field,
    Icon,
    FieldItem,
    ImageReader,
    Tag,
    Toast,
    Button,
    Popup,
    PopupTitleBar,
    Selector,
    TextareaItem,
  } from "mand-mobile";
  import imageProcessor from "mand-mobile/lib/image-reader/image-processor";
  import uuid from "../../../static/script/uuid.js";
  import { UploadFile, CreateRpt, } from "@/api/repairreport";
  import { SysUserInfoByUserId } from "@/api/userInfo";
  export default {
    components: {
      [InputItem.name]: InputItem,
      [Field.name]: Field,
      [Icon.name]: Icon,
      [FieldItem.name]: FieldItem,
      [ImageReader.name]: ImageReader,
      [Tag.name]: Tag,
      [Toast.name]: Toast,
      [Button.name]: Button,
      [Popup.name]: Popup,
      [PopupTitleBar.name]: PopupTitleBar,
      [Selector.name]: Selector,
      [TextareaItem.name]: TextareaItem,
    },
    data() {
      return {
        userInfo:JSON.parse(localStorage.getItem('userAccount')),//微信用户信息
        contactBy: "",//联系人
        phone: "",//联系电话
        problem: "",//问题
        productName:"",//产品名称
        OrganizId:-1,//检测机构上传id
        productList: [],
        problemImg: [],//问题图片列表
        imageList: [],
        getImgsName: [],//上传图片地址
        disabled: false,
        type: "primary",
        isUpload: true,
        url: this.$store.getters.url,
        headers: this.$store.getters.sid,
        guid: uuid(16, 16),
        unitName: "",
        isShowUnit: false,
        isShowInput: false,
        UnitList: [],
        isSearch: true,
        num:0,
        htmlHeight:'',//屏幕高度
      };
    },
    created () {
      this.$loading.hide()
    },
    mounted() {
      SysUserInfoByUserId().then(res=>{
        this.OrganizId = res.data[0].SysUser.OrgId
      });

      // 获取屏幕的高度
      this.htmlHeight = window.screen.height + 'px';
      this.unitName = this.userInfo[0].OrgName;//机构名称

      //   填写用户姓名与电话
      this.contactBy = this.userInfo[0].TrueName
      this.phone = this.userInfo[0].PhoneNumber


      this.num = this.$store.state.RoleId;
      this.productList = this.$store.getters.products;
      if (this.productList.length > 0) {
        this.$store.dispatch("clearProduct");
      }
    },

    destroyed() {
      this.$store.dispatch("clearProduct");
    },
    computed: {
      getData() {
        let data = {
          ContactBy: this.contactBy,//联系人
          Problem: this.problem,//问题
          ContactTel: this.phone,//电话
          ProblemImg: JSON.stringify(this.getImgsName),//问题图片
          // productList: [{"productName":this.productName,ProductNo: "",ProduceDate: "",Mark: "",Model: ""}],//设备列表
          imgTempGuid: this.guid,//图片格式
          OrganizId:this.OrganizId//报检解机构id
        };
        return data;
      },
      getProducts() {
        this.productList = this.$store.getters.products;
        return this.productList;
      },
    },

    methods: {
      onClick(type) {
        this.$router.push({
          name: "product"
        });
      },
      onReaderSelect(name, { files }) {
        alert("加载中...");
      },
      //图片上传，并且保存的格式为[{key:value}]形式的字符串
      onReaderComplete(name, { dataUrl, file }) {
        Toast.hide();
        const demoImageList = this.problemImg;
        let initSize = 1 * 1024 * 1024;
        let postImg = {};
        let len = this.problemImg.length;
        if (this.isUpload) {
          this.isUpload = false;
          if (file.size > initSize) {
            imageProcessor({
              dataUrl,
              quality: 0.3
            }).then(({ dataUrl }) => {
              dataUrl &&
              demoImageList.push({
                url: dataUrl
              });
            });
          } else {
            demoImageList.push({
              url: dataUrl
            });
          }
          setTimeout(() => {
            this.problemImg = demoImageList;
            postImg.imgTempGuid = this.guid;
            postImg.fileStr = this.problemImg[this.problemImg.length - 1]["url"];
            //图片上传
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
      //若是图片上传错误，点击删除图片
      onDeleteImage(index) {
        const demoImageList = this.problemImg;
        demoImageList.splice(index, 1);
        this.getImgsName.splice(index, 1);
        this.problemImg = demoImageList;
      },
      //删除产品
      deleteProduct(index) {
        this.getProducts.splice(index, 1);
      },
      //修改产品
      changeProduct(index) {
        this.$router.push({
          name: "editProduct",
          params: {
            index: index
          }
        });
      },
      checkData(txt) {
        setTimeout(() => {
          Toast.hide();
          alert(txt);
          this.type = "primary";
          this.disabled = false;
        }, 500);
      },

      //把报修的信息上传至服务器
      postInfo() {
        this.type = "disabled";
        this.disabled = true;
        // const headers = this.$store.getters.sid;
        // let url = this.url + "/AfterSaleRpt/CreateRpt";
        let self = this;
        // let sid = "sid=" + headers.headers["ASP.NET_SessionId"];
        Toast.loading("提交中");


        // 必填选项
        if (!this.contactBy) {
          this.checkData("联系人不能为空！");
        } else if (this.contactBy.length > 5) {
          this.checkData("联系人姓名不能超过5个字！");
        } else if (!this.phone) {
          this.checkData("联系方式不能为空！");
        } else if (! /^(0[0-9]{2,3})([2-9][0-9]{6,7})+([0-9]{1,4})?$/.test(this.phone) && ! /^0*(13|15|18|17|19|14|16)\d{9}$/.test(this.phone)) {
          this.checkData("电话号码不正确！");
        } else if (!this.problem) {
          this.checkData("情况说明不能为空！");
        }else {
          CreateRpt(this.getData, this.$store.getters.sid)
            .then(res => {
              if (res.data.success == 1) {
                Toast.hide();
                Toast.loading("提交中");
                setTimeout(() => {
                  Toast.hide();
                  setTimeout(() => {
                    alert("成功");
                    self.problemImg = [];//照片列表清空
                    self.getImgsName = [];//图片地址清空
                    self.problem = '';//报修问题清空
                    self.$router.replace({
                      name: "report",
                      params: {
                        sid: self.$store.getters.sid,
                        actOder:'刷新'
                      },
                      meta: {
                        isRefresh: true
                      },
                    });
                    self.type = "primary";
                    self.disabled = true;
                    this.$store.dispatch("clearProduct");
                  }, 10);
                }, 500);

              } else {
                alert(res.data.result);
              }
            })
            .catch(err => {
              // alert(JSON.stringify(err));
            });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .add-Style{
    margin: 0!important; ;
    border: 1rem solid #eee;
    background: #eee;
  }
  .add {
    background: $bg-color;
    margin: $distance-15;
    height: 100%;
    display: flex;
    flex-direction: column;
    /*justify-content: space-between;*/

    .input-info {
      border: 0.5rem solid #fff;
      .image-list {

        .image-reader-list {
          padding-top: 1rem;
          float: left;
          width: 96%;
          padding-left: 4%;
          background: #fff;

          .image-reader-item {
            position: relative;
            float: left;
            width: 20.5%;
            padding-bottom: 20.5%;
            margin-bottom: 0.5rem;
            margin-right: 2%;
            background: $bg-color;
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
          font-size: 0.8rem;

          .product-list-btn {
            i {
              margin-right: 0.5rem;
            }
          }
        }
      }
    }
    .save {
      margin-top: 2rem;
    }
    .md-field{
      margin: 0!important;
    }

  }
  div.md-field-item.md-textarea-item.example.is-solid.is-ios > div > label{
    font-size: 1rem!important;
  }
</style>
