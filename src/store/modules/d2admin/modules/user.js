import { AreaTreeCityFun } from '@/api/modules/sys.user'
export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},
    cityData:[],
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      }, { root: true })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
      }, { root: true })
    },
    async getCityData ({ state, dispatch }) {
      const res = await AreaTreeCityFun()
      console.log("执行了省市区，，，",res)
      if(res.code == 0){
        state.cityData = res.data
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.cityData',
          value: state.cityData,
          user: true
        }, { root: true })
      }
      return res
    }
    
  }
}
