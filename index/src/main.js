// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;
Vue.use(Mint);
Vue.use(ElementUI);

router.beforeEach(({ meta, path }, from, next) => {
  let { auth = true } = meta;
  // var isLogin = Boolean(sessionStorage.getItem('token'))
  var isLogin = true;
  if (auth && !isLogin && path !== '/login') {
    return next({ path: '/login' });
  }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
