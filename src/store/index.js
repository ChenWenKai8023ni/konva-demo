import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // namespaced: true,
  state: {
    pageStage: null,
    pageLayer: null,
    pageGroup: null,
    pageTransformer: null,
    activeElment: null,
    bgElement: null,
    Preview: "",
    templateDetail: {
      // 模板Guid 
      guid: "",
      /// 登录用户的guid
      loginGuid: "",
      // 名片模板名称
      tem_title: "",
      // 名片模板分类  海报 = 10,名片 = 20,相册书 = 30,
      tem_type: 10,
      // 名片模板宽
      tem_width: 500,
      // 名片模板高
      tem_height: 500,
      //毫米高度
      tem_heightMillimeter: 0,
      //毫米宽度
      tem_widthMillimeter: 0,
      // 价格 decimal
      tem_price: 0,
      // 名片模板说明
      tem_explain: "",
      /// 名片模板预览图片（多图 逗号隔开）
      tem_Images: "",
      // 名片模板是否推荐
      tem_isReferrals: false,
      remark: "",
      //页面数组
      temolateList: [
        {
          // guid 添加的时候不用  修改的时候一定要传入
          guid: "",
          // 顺序（第几个绑定的模板）
          tem_orderSum: 0,
          // 图片
          tem_Image: "",
          // 尺寸 高 decimal
          tem_height: 0,
          // 尺寸 宽 decimal
          tem_width: 0,
          // Data Json(画布周所有的元素)
          tem_DataJson: "",
          // 是否使用
          tem_IsEmploy: true,
          //模板名称
          tem_Title: "页面一",
        },
      ],
    },
  },
  getters: {
    activeClassName: (state) => {
      if (state.activeElment != null) {
        return state.activeElment.getClassName();
      } else {
        return '';
      }
    }
  },
  mutations: {
    SetPreview(state, data) {
      state.Preview = data;
    },
    SetPage(state, { pageStage, pageLayer, pageGroup, pageTransformer }) {
      state.pageStage = pageStage;
      state.pageLayer = pageLayer;
      state.pageGroup = pageGroup;
      state.pageTransformer = pageTransformer;
    },
    SetActive(state, data) {
      state.activeElment = data;
      console.log(data, 'data')
    },
    SetbgElement(state, data) {
      state.bgElement = data;
    },
  },
  actions: {
    SetPreview({ commit }, data) {
      commit('SetPreview', data)
    },
    SetPage({ commit }, data) {
      commit('SetPage', data)
    },
    SetActive({ commit }, data) {
      commit('SetActive', data)
    },
    SetbgElement({ commit }, data) {
      commit('SetbgElement', data)
    },
  },
  modules: {
  }
})
