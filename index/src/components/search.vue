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
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="5" class="list" v-for="list in lists">
            <ul>
              <li>123</li>
              <li>123</li>
            </ul>
          </el-col>
        </el-row>
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
        lists: []
      }
    },
    computed: {
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {

      }
    }
  }
</script>
