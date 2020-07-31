import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'
import print from './print'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins:[createPersistedState()],//数据持久化保存，防止页面刷新的时候状态消失
  mutations,
  actions,
  getters,
  state,
  print
})
