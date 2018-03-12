<template>
  <div>
    <el-container>

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
        isShow: false,
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
        const day = new Date().getDay()
        if (day === 0 || day === 6) {
          return true
        }else {
          return false
        }
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
