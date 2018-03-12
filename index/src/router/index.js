import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Story from '@/components/storys'
import Login from '@/components/login'
import Search from '@/components/search'
import Lists from '@/components/lists'

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
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/lists',
      name: 'Lists',
      component: Lists
    }
  ]
})
