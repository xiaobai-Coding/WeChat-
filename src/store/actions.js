const actions = {
  getSid({ commit }, payload) {
    commit("GET_TOKEN", payload);
  },
  addProduct({commit}, payload){
    commit("ADDPRODUCT", payload)
  },
  getUser({commit}, payload){
    commit("GETUSER", payload)
  },
  clearProduct({commit}){
    commit("CLEARPRODUCT");
  },
  changeProduct({commit}, payload){
      commit("CHANGEPRODUCT",payload)
  },
  editProduct({commit},{payload, index}){
    commit("EDITPRODUCT", {payload, index})
  },
  getRecordId({commit}, payload){
    commit("GETRECORDID", payload);
  },
  //保存ass的id
  saveAssRecordId({commit}, payload){
    commit("SAVEASSRECORDID", payload);
  },
  getRptId({commit},payload){
    commit("GETRPTID", payload);
  },
  editOrder({commit}, payload){
    commit("EDITORDERDATA", payload)
  },
  createServiceProducts({commit}, payload){
    commit("GETSERVICEPRODUCT", payload)
  },
  addServiceProduct({commit}, payload){
    commit("ADDSERVICEPRODUCT", payload)
  },
  deleteServiceProcudt({commit}, payload){
    commit("DELECTSERVICEPRODUCT", payload)
  },
  editServiceProduct({commit}, payload){
    commit('EDITSERVICEPRODUCT', payload)
  },
  editServiceProductDetail({commit}, payload){
    commit('EDITSERVICEPRODUCTDETAIL', payload)
  },
  clearServiceProduct({commit}){
    commit("CLEARSERVICEPRODUCT")
  },
  clearSerProduct({commit}){
    commit("CLRARSERVICEPRO");
  },
  createVisitPerson({commit}, payload){
    commit("CREATEVISITEPERSON", payload)
  },
  saveVisitPerson({commit}, payload){
    commit("SAVEVISITPERSON", payload)
  },
  editVisitPersonDetail({commit}, payload){
    commit("EDITVISITPERSONDETAIL", payload)
  },
  setSettlementId({commit}, payload){
    commit('SETSETTLEMENTID', payload)
  },
  // 记录服务单所有单号信息
  saveAccountAll({commit},payload){
    commit('SAVEACCOUNTALL',payload)
  },
  //设置路由是否刷新
  chageRouteSate({commit},payload){
    commit('CHAGEROUTESATE',payload)
  },
  //保存菜单名称
  saveOrderStyle({commit},payload){
    commit('SAVEORDERSTYLE',payload)
  },
  //保存详情检页面id
  saveAgencyId({commit},payload){
    commit('SAVEAGENCYID',payload)
  },
  //保存机构id或用户id判断是服务人员或是检测机构
  saveDetailCondition({commit},payload){
    commit('SAVEDETAILCONDITION',payload)
  },
  //保存机构id
  saveCustomerId({commit},payload){
    commit('SAVECUSTOMERID',payload)
  },
  //保存视频播放数据
  saveData({commit},payload){
    commit("SAVEDATA",payload)
  }
}

export default actions;
