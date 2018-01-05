<template>
  <el-container class="storys">
    <el-main>
      <el-select v-model="link" filterable placeholder="请选择" @change="changeChapter">
        <el-option
          v-for="item in storys"
          :key="item.link"
          :label="item.title"
          :value="item.link"
        >
        </el-option>
      </el-select>
      <div class="detail" style="white-space: pre-wrap;">
        {{body}}
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {storys} from '../server'
  import { Toast, MessageBox } from 'mint-ui'

  export default {
    data() {
      return {
        storys: [],
        link: '',
        body: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        storys.getChapters().then(res => {
          console.log(res)
//          let arr = [];
//          res.mixToc.chapters.forEach(_arr => {
//            arr = arr.concat(_arr)
//          })
          this.storys = res.mixToc.chapters
        }).catch(e => {
          console.log(e)
        })
      },
      changeChapter (item) {
        MessageBox.confirm('叔叔是不是很帅?').then(action => {
          storys.getDetailByLink(encodeURIComponent(item)).then(res => {
            console.log(res)
            this.body = res.chapter.body
            Toast({
              message: '叔叔真的帅',
              position: 'center',
              duration: 2000
            });
          }).catch(e => {
            console.log(e)
          })
        })

      }
    }
  }
</script>

<style>
  .storys {
    overflow-x: hidden;
    font-size: 14px;
  }
  .el-main {
    width: 10rem;
  }
</style>
