import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueKonva from 'vue-konva';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false
Vue.use(VueKonva);
Vue.use(Antd);
//全局引入
import { install } from '@icon-park/vue/es/all';
install(Vue); // use default prefix 'icon', eg: icon is People, name is icon-people.
import {
  Sketch, Twitter,
  Compact
} from 'vue-color'
Vue.component('SketchColor', Sketch)
Vue.component('TwitterColor', Twitter)
Vue.component('CompactColor', Compact)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
