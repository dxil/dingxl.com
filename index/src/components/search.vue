<template>
  <div>
    <el-container>
      <el-main>
        <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
        </el-input>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <!--<el-row type="flex" class="row-bg" justify="space-between">-->
          <!--<el-col :span="5" class="list" v-for="list in lists" :key="list.name">-->
            <!--<ul>-->
              <!--<li>123</li>-->
              <!--<li>123</li>-->
            <!--</ul>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <router-link v-show="name" :to="{ path: 'storys', query: { url: url }}">{{name}}</router-link>
        <p v-show="errMsg">{{errMsg}}</p>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import {storys} from '../server'
  import { Toast, MessageBox, Indicator } from 'mint-ui'

  const spinner = {
    open: () => Indicator.open({
      text: '叔叔帅...',
      spinnerType: 'fading-circle'
    }),
    close: () => Indicator.close()

  }
  export default {
    data() {
      return {
        searchValue: '',
//        lists: []，
        url: '',
        name: ''
      }
    },
    computed: {
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {

      },
      search () {
        this.reset()
        spinner.open()
        if (!this.searchValue) {
          return;
        }
        storys.searchBook(this.searchValue).then(res => {
          spinner.close()
          if (!res) {
            return;
          }
          const info = res.match(/<a cpos=\"title\" href=\"(.*)\" title=\"(.*)\" class=\"result-game-item-title-link\" target=\"_blank\">/)
          if (!info.length) {
            this.errMsg = '未找到该书啊，肖宇豪'
          }else {
            this.url = info[1]
            this.name = info[2]
          }
        }).catch(e => {
          spinner.close()
        })
      },
      reset () {
        this.errMsg = ''
        this.url = ''
        this.name = ''
      }
    }
  }
</script>
