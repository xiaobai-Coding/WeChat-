/**
 *  存放 ** 数据
 * **/

// initial state
const state = {
  seachStar:""
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  setPrint(state, seachStar) { //设置参数
    state.seachStar = seachStar;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
