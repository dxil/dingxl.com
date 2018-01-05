import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Story from '@/components/storys'


Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/storys',
      name: 'storys',
      component: Story
    }
  ]
})
