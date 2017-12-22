<template>
  <div>
    <div class="clock">
      <div class="cssClock">
        <div class="cssDotWrap">
          <div class="cssDot" v-for="(dot,i) in 60" :style="{transform: 'rotateZ('+i*6+'deg)',height: i%5==0?'10px':'4px',}"></div>
        </div>
        <div class="hour cssNeedle" :style="{transform: 'rotateZ('+hour+'deg)'}"></div>
        <div class="min cssNeedle" :style="{transform: 'rotateZ('+min+'deg)'}"></div>
        <div class="sec cssNeedle" :style="{transform: 'rotateZ('+sec+'deg)'}"></div>
      </div>
    </div>
    <p class="content">你{{liveDate.fullYear}}岁了</p>
    <ul class="flex">
      <li><p>{{liveDate.year}}</p><p>年</p></li>
      <li><p>{{liveDate.month}}</p><p>月</p></li>
      <li><p>{{liveDate.day}}</p><p>天</p></li>
      <li><p>{{liveDate.week}}</p><p>周</p></li>
      <li><p>{{liveDate.hour}}</p><p>小时</p></li>
      <li><p>{{liveDate.min}}</p><p>分钟</p></li>
    </ul>
    <div class="user">
      <ul>
        切换
        <span @click="change('dxl')">dxl</span>
        <span @click="change('daughter')">daughter</span>
        <span @click="selectDate()">其他</span>
      </ul>
    </div>
    <mt-datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="startDate"
      :endDate="endDate"
      v-model="pickerValue"
      @confirm="changeBorn()">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import moment from 'moment'
  const my = {
    year: '1995',
    month: '04',
    day: '17'
  }
  const myDaughter = {
    year: '1996',
    month: '08',
    day: '20'
  }
  export default {
    data() {
      return {
        currTime: new Date(), //当前日期对象
        born: {
          year: '1995',
          month: '04',
          day: '17'
        },
        startDate: new Date('1900-1-1'), // picker选取的起始时间
        endDate: new Date(),
        pickerValue: new Date('1990-1-1')
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
        return this.currTime.getHours()*30 + this.currTime.getMinutes()/2;
      },
      liveDate() {
        let date = `${this.born.year}${this.born.month}${this.born.day}`
        let time = moment(this.currTime).diff(moment(date), 'milliseconds');
  //      let monthTime =
        let fullYear = (time / 31536000000).toFixed(8)
        let years = moment(this.currTime).diff(moment(date), 'years');
        let month = moment(this.currTime).diff(moment(date), 'month');
        let days = moment(this.currTime).diff(moment(date), 'days');
        let week = moment(this.currTime).diff(moment(date), 'week');
        let hour = moment(this.currTime).diff(moment(date), 'hours');
        let mins = moment(this.currTime).diff(moment(date), 'minutes');
        return {
          fullYear: fullYear,
          year: years,
          month: month,
          day: days,
          week: week,
          hour: hour,
          min: mins,
        }
        return fullYear
      }
    },
    created() {
      setInterval(()=>{//钩子函数，在实例创建的时候运行定时器，我们只需要动态刷新当前的日期对象即可
        this.currTime = new Date();
      },1000)
    },
    mounted () {
      let person = window.localStorage.getItem('person')
      this.born = person && person === 'daughter' ? myDaughter : my
    },
    methods: {
      change (name) {
        window.localStorage.setItem('person', name)
        if (name === 'dxl') {
          this.born = my
          console.log(my)
          console.log(this.born)
        }else {
          this.born = myDaughter
          console.log(myDaughter)
          console.log(this.born)
        }
      },
      changeBorn () {
        console.log(this.pickerValue)
        this.born.year = moment(this.pickerValue).format('YYYY')
        this.born.month = moment(this.pickerValue).format('MM')
        this.born.day = moment(this.pickerValue).format('DD')
      },
      selectDate () {
        this.$refs.picker.open();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  span, p, ul, li {
    font-size: 16px;
    color: #ccc;
  }

  .clock {
    height: 500px;
  }

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

  .content {
    text-align: center;
    margin-bottom: 20px;
  }

  .flex {
    display: flex;
    display: -webkit-flex; /* Safari */
    flex-flow: wrap;
    justify-content: center;
  }

  .flex li {
    text-align: center;
    width: 100px;
    height: 80px;
    padding-top: 20px;
    margin: 0 5px 5px 0;
    border: 1px solid #ccc;
  }

  .user {
    position: fixed;
    bottom: 0;
    right: 0;
  }

  @media (max-width: 768px) {
    .clock {
      height: 9.333333rem;
    }
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



