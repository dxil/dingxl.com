<template>
  <div class="cssClock">
    <div class="cssDotWrap">
      <div class="cssDot" v-for="(dot,i) in 60" :style="{transform: 'rotateZ('+i*6+'deg)',height: i%5==0?'10px':'4px',}"></div>
    </div>
    <div class="hour cssNeedle" :style="{transform: 'rotateZ('+hour+'deg)'}"></div>
    <div class="min cssNeedle" :style="{transform: 'rotateZ('+min+'deg)'}"></div>
    <div class="sec cssNeedle" :style="{transform: 'rotateZ('+sec+'deg)'}"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currTime: new Date()//当前日期对象
    }
  },
  computed: {
    sec() {//将当前秒数转化为秒针旋转的度数
      return this.currTime.getSeconds()*6;
    },
    min() {//将当前的分钟数转化为分针旋转的度数
      return this.currTime.getMinutes()*6 + this.currTime.getSeconds()/10 ;
    },
    hour() {//将当前的小时数转化为时针旋转的度数
      return this. currTime.getHours()*30 + this.currTime.getMinutes()/2;
    }
  },
  created() {
    setInterval(()=>{//钩子函数，在实例创建的时候运行定时器，我们只需要动态刷新当前的日期对象即可
      this.currTime = new Date();
    },1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cssClock {
    position: absolute;
    margin-left: 50%;
    margin-top: 50px;
    left: -200px;
    width: 400px;
    height: 400px;
    border: 1px solid rgb(112,128,144);
    border-radius: 50%;
  }

  .cssDotWrap {
    transform: translateX(200px);
  }

  .cssDot {
    position: absolute;
    width: 2px;
    background-color: rgb(112,128,144);
    transform-origin: 0px 200px;
  }

  .cssNeedle {
    position: absolute;
    left: 200px;
    background-color: rgb(112,128,144);
    transform-origin: center bottom;
  }

  .hour {
    width: 8px;
    height: 150px;
    top: 50px;
    margin-left: -4px;
  }

  .min {
    width: 4px;
    height: 180px;
    top: 20px;
    margin-left: -2px;
  }

  .sec {
    width: 2px;
    height: 200px;
    margin-left: -1px;
  }

  @media (max-width: 768px) {
    .cssClock {
      margin-top: .666666rem;
      left: -4rem;
      width: 8rem;
      height: 8rem;
    }

    .cssDotWrap {
      transform: translateX(4rem);
    }

    .cssDot {
      width: .053333rem;
      transform-origin: 0px 4rem;
    }

    .cssNeedle {
      left: 4rem;
    }

    .hour {
      width: .106666rem;
      height: 3.333333rem;
      top: .666666rem;
      margin-left: -2px;
    }

    .min {
      width: .053333rem;
      height: 3.733333rem;
      top: .266666rem;
      margin-left: -1px;
    }

    .sec {
      width: .053333rem;
      height: 4rem;
      margin-left: -1px;
    }
  }
</style>



