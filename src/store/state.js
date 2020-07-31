
const state = {
  //192.168.0.3:8125  http://ctw.sxctkj.com http://localhost:12345/
  host_name: 'http://ctw.sxctkj.com',//照片请求地址
  Icon_name:'http://ct.sxctkj.com/',
  isAndroid: navigator.userAgent.match(/android/i),
  isIOS: navigator.userAgent.match(/(iPhone|iPod|iPad);?/i),
  sid: '',
  products: [],
  user: {},
  rptRecordId: '',//报修编码
  assRecordId:'',//ass的编码
  order: {},
  serviceId: '',
  serviceProduct: [],
  serviceProductDetail:{
    detail:{},
    index: ''
  },
  visitPersons:[],
  visitPersonDetail:{
    detail: {},
    index: ''
  },
  settlementId: '',
  RoleId:0,
  RptId:0,//报修编号
  AccountAll:{},//所有单号信息
  routeSate:true,//路由是否刷新
  orderStyle:'',//进入的菜单名称
  agencyId:{},//进入详情列表进行检索的id与开始结束日期
  detailBtn:false,//是否显示详情按钮
  detailCondition:{},//保存机构id或用户id判断是服务人员或是检测机构(title：用户类别 id:查询的id)
  CustomerId:'',//机构id
  videoData:'',//视频信息
  seachStar: "" // 用户输入的关键词

};
export default state;
