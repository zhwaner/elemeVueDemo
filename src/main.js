// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App';
import goods from 'components/goods/goods';//1.定义组件
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import axios from 'axios';
import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.prototype.$ajax = axios;

const store = new Vuex.Store({
  //创建一个对象来保存应用启动时的初始状态
  state: {
    selectType: ""
  },
  //用于更改状态的mutation函数
  mutations: {
    changeSelectType(state) {
      
    }
  }
})

const routes = [
//2.定义路由，每个路由映射一个组件，其中"component" 可以是通过 Vue.extend() 创建的组件构造器，也可以直接写在下面
	{ path : '/goods', component: goods },
	{ path : '/ratings', component: ratings },
	{ path : '/seller', component: seller }
]
//3.创建router实例，传配置
const router = new VueRouter({
	routes,
	linkActiveClass: 'active'// linkActiveClass设置点击的时候添加class为active
})

/* eslint-disable no-new */
//4.创建和挂载根实例，通过router配置参数注入路由，让整个应用都有路由功能
new Vue({
  router,
  store,
  template: '<App/>',
  components: { App },
  data: {
  	eventHub: new Vue()
  }
}).$mount('#app');

router.push('goods');