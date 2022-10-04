<template>
 <div class="py-5 text-center bakr">
      <img class="d-block mx-auto mb-4" src="/docs/5.2/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57">
      <h2>회원가입</h2>
      <p class="lead">회원가입을 환영합니다.</p>
    </div>

    <div class="row g-5 ars">
      <div class="col-md-7 col-lg-8">
        <form class="needs-validation" novalidate>
          <div class="row g-3">
            <div class="col-10">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" placeholder="you@example.com" v-model="email">
              <div v-if="!email_chk" style="color:red;">
                정확한 이메일을 입력해주세요.
              </div>
            </div>
            <div class="col-10">
              <label for="email" class="form-label">비밀번호 <br><span style="font-size: 12px;">(하나 이상의 문자 , 숫자 , 특수 문자,최소 8자의 비밀번호가 필요합니다.)</span></label>
              <input type="password" class="form-control" id="password" placeholder="비밀번호를 입력해주세요." v-model="password">
            </div>
            <div class="col-10">
              <label for="email" class="form-label">비밀번호 확인</label>
              <input type="password" class="form-control" id="password" placeholder="비밀번호를 입력해주세요." v-model="password_chk">
              <div v-if="!pw_equal_chk" style="color:red;">
                비밀번호가 일치하지 않습니다.
              </div>
            </div>
            <div class="col-10">
              <label for="email" class="form-label">이름</label>
              <input type="text" class="form-control"  placeholder="이름을 입력해주세요." v-model="user_name">
            </div>
           <div class="col-10">
              <label for="email" class="form-label">닉네임 </label>
              <input type="text" class="form-control"  placeholder="닉네임을 입력해주세요." v-model="nick_name">
            </div>
            <div class="col-10">
              <label for="email" class="form-label">휴대폰 번호</label>
              <input type="text" class="form-control"  placeholder="ex)01023456899" v-model="phone_number" maxlength="13">
            </div>
           <div class="col-10">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required value="M" v-model="gender">
              <label class="form-check-label" for="credit">남자</label>
            </div>
            <div class="form-check">
              <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required value="F" v-model="gender">
              <label class="form-check-label" for="debit">여자</label>
            </div>
          </div>

          </div>

          <p class="my-4"></p>



        </form>

 <div class="col-10">
 <button class="w-100 btn btn-primary btn-lg" type="submit" @click="joinSucc">회원가입</button>
  </div>
  <p class="my-4"></p>
   <div class="col-10">
<button class="w-100 btn btn-primary btn-lg" style="background-color: #F56E6E;"  @click="backClick">뒤로가기</button>
  </div>

</div>

    </div>
      <BlackBg v-if="loading"></BlackBg>
</template>


<script>
import BlackBg from "../loading/BlackBg"

export default {
  components: {
    BlackBg
  },
	data: function () {
    return {
      email:"",
      email_chk:false,
      password: "",
      password_chk:"",
      pw_valid_chk:false,
      pw_equal_chk:true,
      user_name:"",
      nick_name:"",
      gender:"M",
      phone_number:"",
      loading:false,

    }
  },
  methods: {
      joinSucc() {
        if(!this.email_chk) {
            this.alert_chk("이메일 을");
            return false;
        }
        if(!this.password){
          this.alert_chk("비밀번호 를");
          return false;
        }
        if(this.$emptyChk(this.user_name)){
            this.alert_chk("이름 을");
            return false;
        }
        if(this.$emptyChk(this.nick_name)){
            this.alert_chk("닉네임 을");
            return false;
        }
        if(this.$emptyChk(this.phone_number)){
          this.alert_chk("휴대폰 번호 를");
          return false;
        }
        if(!this.$phoneNumberValidation(this.phone_number)){
            this.alert_chk("휴대폰 번호 형식 을");
            return false;
        }

        let param  = {
              "email"       : this.email ,
              "password"    : this.password ,
              "name"        : this.user_name ,
              "nickName"    : this.nick_name,
              "gender"      : this.gender,
              "phoneNumber" : this.phone_number
        }

        this.loading = true;

        this.$axios.post(process.env.VUE_APP_TRIP_JOIN ,param).then(() =>{
              this.$router.push("/loginSuccess");
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });

      },
      backClick() {
        this.$router.push("/");
      },

      pw_chk(value) {
            return this.$passwordValidation(value);  
      },
      
      alert_chk(value) {
          this.$swal('', value+' 확인해주세요','error');
          return;
      }

  },
  watch : {
    email() {
      this.email_chk = this.$emailValidation(this.email);  
    },
    password() {
       this.pw_valid_chk = (this.pw_chk(this.password)&&this.pw_chk(this.password_chk));
       this.pw_equal_chk = this.password == this.password_chk;
    },
    password_chk() {
     this.pw_valid_chk = (this.pw_chk(this.password)&&this.pw_chk(this.password_chk));
     this.pw_equal_chk = this.password == this.password_chk;
    },
    phone_number() {
      this.phone_number = this.phone_number.replace(/[^0-9]/g, '');
      this.phone_number = this.$phoneNumberGetMask(this.phone_number);
    }

  },

}


</script>





<style>
  .ars {
    display: flex;
    justify-content: center;
    background: #f5f5f5;
    
  }
  .row {
    margin-left  : 0 !important;
    margin-right : 0 !important;

  }
  .row > * {
    padding-left: calc(var(--bs-gutter-x) * 1.0) !important;
  }
  .bakr{
    background: #f5f5f5; 
  }
  html{
       background: #f5f5f5;
  }
  .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }

      .b-example-divider {
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
      }

      .b-example-vr {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
      }

      .bi {
        vertical-align: -.125em;
        fill: currentColor;
      }

      .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
      }

      .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }
</style>

