<template>
  <div>
    <div class="header-login">
      <p>{{header}}</p>
    </div>
    <div class="body-login">
      <div class="account-login login-form">
        <span>
        <img src="../assets/imgs/manage_login_icon_account.png" alt="">
      </span>
        <input type="text" ref="account" placeholder="请输入账号..." style="background-color:transparent">
      </div>
      <div class="password-login login-form">
        <span>
        <img src="../assets/imgs/manage_login_icon_password.png" alt="">
      </span>
        <input type="password" ref="password" placeholder="请输入密码..." style="background-color:   transparent">
      </div>
    </div>
    <div class="confirm-login">
      <el-button @click="login()">登录</el-button>
    </div>
  </div>
</template>

<script>
  /* eslint-disable*/
  import { Toast, Indicator } from '../../node_modules/mint-ui';

  export default {
    data() {
      return {
        header: '尧尧帅哥网'
      };
    },
    created () {
      sessionStorage.removeItem('token')
//      this.test()
    },
    methods: {
      login () {
        let tel = this.$refs.account.value
        let password = this.$refs.password.value
        this.loginConfirm(tel, password)
      },
      loginConfirm (tel, pass) {
        if (tel === 'xiaoyuhao' && pass=== "hehehe") {
          sessionStorage.setItem('token', 'hehehe')
          this.$router.push('/storys')
        }else {
          Toast({
            message: '呵呵，找我要密码！',
            position: 'center',
            duration: 2000
          });
        }
      },
      // 测试代码，无用
      test() {
        var MyModules = (function Manager() {
          var modules = {};
          function define(name, deps, impl) {
            for (var i=0; i<deps.length; i++) {
              deps[i] = modules[deps[i]];
            }
            modules[name] = impl.apply( impl, deps );
          }

          function get(name) {
            console.log(modules)
            return modules[name];
          }

          return {
            define: define,
            get: get
          };
        })();


        MyModules.define( "bar", [], function() {
          function hello(who) {
            return "Let me introduce: " + who;
          }
          return {
            hello: hello
          };
        });

        MyModules.define( "foo", ["bar"], function(bar) {
          var hungry = "hippo";

          function awesome() {
            console.log(bar)
            console.log(bar.hello(hungry).toUpperCase())
          }
          return {
            awesome: awesome
          };
        });

        var bar = MyModules.get( "bar" );
        var foo = MyModules.get( "foo" );
        console.log(
          bar.hello( "hippo" )
        ); // Let me introduce: hippo
        foo.awesome(); // LET ME INTRODUCE: HIPPO
      }
    }
  };
</script>

<style scoped>
  .header-login {
    height: 5.6666rem; /* 250px */
    position: relative;
  }

  .header-login p {
    width: 8rem; /* 300px */
    height: 1.4934rem; /* 112px */
    font-size: 20px;
    text-align: center;
    line-height: 1.4934rem;
    margin: auto;
    position: absolute;
    top: .4rem; left: 0; bottom: 0; right: 0;
    font-family: PingFang-SC-Medium;
    color: #333333;
  }

  .login-form {
    margin-left: 1.1866rem;
  }

  .confirm-login {
    text-align: center;
  }

  .login-form span img {
    height: 0.4rem;
    width: 0.4rem;
  }

  .login-form > input {
    padding-left: 5px;
    font-size: 14px;
    background-color: #f5f5f5;
    width: 7.2rem;
    /*padding-left: 5px;*/
    border-bottom: 1px solid #A4A9B0;
    border-radius: 0;
  }

  .account-login input {
    margin-bottom: 0.866667rem;
  }

  .body-login {
    margin-bottom: 2.8666rem;
  }
</style>
