//引入
import Vue from 'vue'
import Vuex from 'Vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//声明使用vuex
Vue.use(Vuex)

//向外默认暴露
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters

})
