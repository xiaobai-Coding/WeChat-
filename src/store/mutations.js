const mutations = {
  GET_TOKEN(state, payload) {
    var newSid = payload;
    return (state.sid = newSid);
  },
  ADDPRODUCT(state, payload) {
    var product = payload;
    state.products.push(product);
  },
  GETUSER(state, payload) {
    var user = payload;
    state.user = user;
  },
  CLEARPRODUCT(state) {
    state.products = [];
  },
  CHANGEPRODUCT(state, payload) {
    var products = payload;
    state.products = products;
  },
  EDITPRODUCT(state, payload) {
    var data = payload;
    state.products.splice(data.index, 1, data.payload);
  },
  GETRPTID(state, payload) {
    state.RptId = payload;
  },
  GETRECORDID(state, payload) {
    var id = payload;
    state.rptRecordId = id;
  },
  EDITORDERDATA(state, payload) {
    let edit = payload;
    state.order = payload;
  },
  GETSERVICEPRODUCT(state, payload) {
    this.state.serviceProduct = payload;
  },
  ADDSERVICEPRODUCT(state, payload) {
    let product = payload;
    state.serviceProduct.push(product);
  },
  DELECTSERVICEPRODUCT(state, payload) {
    state.serviceProduct.splice(payload, 1);
  },
  EDITSERVICEPRODUCT(state, payload) {
    state.serviceProduct.splice(payload.index, 1, payload.detail);
  },
  EDITSERVICEPRODUCTDETAIL(state, payload) {
    state.serviceProductDetail.detail = state.serviceProduct[payload];
    state.serviceProductDetail.index = payload;
  },
  CLEARSERVICEPRODUCT(state, payload) {
    state.serviceProduct = [];
  },
  CLRARSERVICEPRO(state) {
    state.serviceProductDetail = {
      detail: {},
      index: "",
    };
  },
  CREATEVISITEPERSON(state, payload) {
    let persons = payload;
    state.visitPersons = persons;
  },
  SAVEVISITPERSON(state, payload) {
    state.visitPersons.splice(payload.index, 1, payload.detail);
  },
  EDITVISITPERSONDETAIL(state, payload) {
    state.visitPersonDetail.detail = state.visitPersons[payload];
    state.visitPersonDetail.index = payload;
  },
  SETSETTLEMENTID(state, payload) {
    let newId = payload;
    state.settlementId = newId;
  },
  SAVEACCOUNTALL(state, payload) {
    state.AccountAll = payload;
  },
  CHAGEROUTESATE(state, payload) {
    state.routeSate = payload;
  },
  SAVEORDERSTYLE(state, payload) {
    state.orderStyle = payload;
  },
  SAVEASSRECORDID(state, payload) {
    state.assRecordId = payload;
  },
  SAVEAGENCYID(state, payload) {
    state.agencyId = payload;
  },
  SAVEDETAILCONDITION(state, payload) {
    state.detailCondition = payload;
  },
  SAVECUSTOMERID(state, payload) {
    state.CustomerId = payload;
  },
  SAVEDATA(state, payload) {
    state.videoData = payload;
  },
  // 存储用户输入的关键词信息
  setPrint(state, payload) {
    //设置参数
    state.seachStar = payload;
  },
};

export default mutations;
