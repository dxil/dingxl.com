<template>
  <el-container class="storys" :style="fontStyle">
    <el-main>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-button size="mini" round @click="setting(true)">设置</el-button>
        </el-col>
        <el-col :span="12">
          <el-select size="mini" class="el-icon--right" v-model="index" filterable placeholder="请选择" @change="changeChapter">
            <el-option
              v-for="(item, index) in storys"
              :key="item.id"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-col>

      </el-row>

      <div class="detail" style="white-space: pre-wrap;">
        {{body}}
      </div>
    </el-main>
    <el-footer>
      <el-row type="flex" justify="space-between" v-show="body">
        <el-col :span="12" style="text-align: center;">
          <el-button icon="el-icon-arrow-left" size="mini" @click="go(-1)">上一章</el-button>
        </el-col>
        <el-col :span="12" style="text-align: center;">
          <el-button size="mini" @click="go(1)">下一章<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-col>

      </el-row>
    </el-footer>
    <mt-popup
      v-model="popupVisible"
      position="left"
      closeOnClickModal="false"
      modal=false
      style="width: 100%;height: 100%"
      :style="fontStyle"
    >
      <el-container>
        <el-main>
          <mt-switch v-model="settings.night">夜间模式</mt-switch>
          <mt-switch v-model="settings.isProtectEye">护眼模式</mt-switch>
          <mt-range v-model="settings.fontSize"
                    :min="14"
                    :max="22"
                    style="margin-top: 0.7rem;"
          >
            <div slot="start">字体:   14</div>
            <div slot="end">22</div>
          </mt-range>
        </el-main>
        <el-footer>
          <el-button size="mini" plain @click="setting(false)">关闭设置</el-button>
        </el-footer>
      </el-container>

    </mt-popup>
  </el-container>
</template>

<script>
  import {storys} from '../server'
  import { Toast, MessageBox, Indicator } from 'mint-ui'

  const spinner = {
    open: () => Indicator.open({
      text: '舅舅帅...',
      spinnerType: 'fading-circle'
    }),
    close: () => Indicator.close()

  }
  export default {
    data() {
      return {
        storys: [],
        index: '',
        body: '',
        popupVisible: false,
        settings: {
          fontSize: 14,
          isProtectEye: false,
          night: true
        }
      }
    },
    computed: {
      fontStyle () {
        let _backgroundColor
        let _color = '#000'
        if (!this.body) {
          _backgroundColor = '#fff'
        }else {
          if (!this.settings.night) {
            _backgroundColor = this.settings.isProtectEye? 'rgb(241,229,201)':'#eee'
          }else {
            _backgroundColor = '#333333'
            _color = '#DADADA'
          }
        }

        return {
          fontSize: this.settings.fontSize + 'px',
          backgroundColor: _backgroundColor,
          color: _color
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let url = this.$route.query.url
        if (!url) {
          Toast({
            message: '请搜索后再查看！',
            position: 'center',
            duration: 2000
          });
          return;
        }
        spinner.open()
        storys.getChapters(url).then(res => {
          let arr = [];
          eval('res='+res)
          res.data.list.forEach(_arr => {
            arr = arr.concat(_arr.list)
          })
          spinner.close()
          this.storys = arr
        }).catch(e => {
          spinner.close()
          console.log(e)
        })
      },
      changeChapter (item) {
        this.index = item
        let _link = this.$route.query.url + this.storys[item].id + '.html'
        MessageBox.confirm('舅舅是不是很帅?').then(action => {
          spinner.open()
          storys.getDetailByLink(_link).then(res => {
            spinner.close()
            Toast({
              message: '舅舅真的帅',
              position: 'center',
              duration: 2000
            });
            this.body = res.data.content
          }).catch(e => {
            spinner.close()
            console.log(e)
          })
        }).catch(e => {
          Toast({
            message: '舅舅不帅还看什么小说？',
            position: 'center',
            duration: 2000
          });
        })

      },
      go (i) {
        let sum = +this.index + i
        console.log(sum)
        if ( sum > 0) {
          this.changeChapter(sum)
        }

      },
      setting (boolean) {
        this.popupVisible = boolean
      }
    }
  }
</script>

<style>
  .storys {
    height: 100%;
    overflow-x: hidden;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
</style>
