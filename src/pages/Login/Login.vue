<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.pervent="login">
          <div :class="{on:loginWay}">
            <section class="login_message">
              <!--v-model收集phone-->
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button  class="get_verification" :class="{right_phone_number:isRightPhone}" @click = "sendCode">
              {{computeTime > 0 ? `已发送(${computeTime}s)` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <!--v-model收集code-->
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <!--v-model="name"-->
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isHide ? 'password' : 'text'" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" :class="isHide ? 'off' : 'on'" @click = "isHide = !isHide">
                  <div class="switch_circle" :class="{right: !isHide}"></div>
                  <span class="switch_text">{{isHide ? '' : 'abc'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha"
                @click="changeCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip v-show="isShowAlert" :alertText="alertText" @closeTip="closeTip"/>
  </section>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip.vue'

  export default {
    data() {
      return {
        loginWay: true,  //true:短信  false:密码
        phone: '', //手机号
        code:'', //短信验证码
        name:'',//同户名
        pwd:'', //密码
        captcha:'',//图形验证码
        computeTime: 0,  //倒计时剩余的时间
        isHide: true, //是否隐藏密码
        alertText:'', //警告的提示文本
        isShowAlert:false, //是否显示警告框
      }
    },
    computed:{
      isRightPhone () {
//        console.log(' isRightPhone ()', /^1\d{10}$/.test(this.phone))

        return /^1\d{10}$/.test(this.phone)
      }
    },

    methods: {
//      发送验证码
      sendCode(){
//        如果是正确的手机号并且没有计时,才开始倒计时
        if(this.isRightPhone && this.computeTime === 0){
          this.computeTime = 10
//          启动循环定时器
          const interverId = setInterval(() => {
            this.computeTime--
            if( this.computeTime === 0){
              //          清除定时器
              clearInterver(interverId)
            }
          },1000)
        }
//        alert('-----')
      },
//      关闭警告框
      closeTip (){
        this.isShowAlert = false
        this.alertText = ''
      },
//      显示提示
      showTip (text){
        this.isShowAlert = true
        this.alertText = text
      },
//      请求登录
      login(){
//先进行前台表单验证
        if(this.loginWay){ //短信登录
          const {phone,code,isRightPhone} = this
          /*if(!isRightPhone){
            this.isShowAlert = true
            this.alertText = '请输入正确的手机号'
          }else if(!/^d{6}/.test(code)){
            this.isShowAlert = true
            this.alertText = '请输入正确的验证码'
          }*/
          if(!isRightPhone){
            this.showTip('请输入正确的手机号')
            return
          }else if(!/^d{6}/.test(code)){
            this.showTip('请输入正确的验证码')
            return
          }
        }else { //密码登录
          const {name, pwd, captcha} = this
          // 表单验证
          if(!name) { // 用户名
            showTip('请输入用户名')
            this.return
          } else if(!pwd) { // 密码
            this.showTip('请输入密码')
            return
          } else if(!captcha) { // 图片验证码
            this.showTip('请输入图片验证码')
            return
          }

        }
      },

      changeCaptcha (event){
//        拼串的时候不能加空格
        event.target.src = 'http://localhost:4000/captcha?time=' + Date.now()
//        event.target.src = 'http://localhost:4000/captcha?time='+Date.now()
      }
     /* changeCaptcha () {
        // 必须指定一个不同的src
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
      }*/
    },
    components:{
      AlertTip
    }


  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                outline none
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                /*因为与get_verification同级所以在前面加 & */
                &.right_phone_number
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
