<template>
<div class="container">
    <div class="row">
        <div class="col-md-12">
<div class="container">
   <div class="row">
      <div class="col-md-12">
         <div id="content" class="content content-full-width">
            <div class="profile">
               <div class="profile-header">
                  <div class="profile-header-cover"></div>
                  <div class="profile-header-content">
                     <div class="profile-header-img" >
                        <img v-if="img_real" v-bind:src= "img" style="width:100%; height:100%;">
                     </div>
                     <div class="profile-header-info" >
                        <h4 class="m-t-10 m-b-5">{{user_name}}</h4>
                        <p class="m-b-10">{{user_email}}</p>
                        <label class="file-label" for="chooseFile">프로필 변경</label>
                            <input class="file" id="chooseFile"
                            type="file" 
                            @click="resetImageUploader"
                            v-on:change="upload"
                            accept="image/png, image/jpeg, image/gif"
                            ref="imageUploader"
                            >
                     </div>
                  </div>
               </div>
            </div>
            <div class="profile-content">
               <div class="tab-content p-0">
                  <div class="tab-pane fade in active show" id="profile-about">
                     <div class="table-responsive">
                        <table class="table table-profile">
                           <thead>
                           </thead>
                           <tbody>
                              <tr class="highlight">
                                 <td class="field">닉네임</td>
                                 <td><input type="text" style="margin:1px;" v-model="user_nickname"></td>
                              </tr>
                              <tr class="highlight">
                                 <td class="field">휴대폰</td>
                                 <td><input type="text" style="margin:1px;" v-model="phone_number"></td>
                              </tr>
                              <tr class="highlight">
                                 <td class="field">비밀번호</td>
                                 <td><input type="password" style="margin:1px;" v-model="user_password"><button class="btn btn-primary" style="margin-left:1rem;" @click="passwordClick">저장</button> *비밀번호는 따로 저장 버튼을 눌러야 변경 가능 합니다.</td>
                              </tr>
                              <tr class="highlight">
                                 <td class="field">성별</td>
                                 <td>
                                    <input id="credit" name="paymentMethod" type="radio" class="form-check-input" required value="M" v-model="gender">
                                    <label class="form-check-label" for="credit" style="margin-right:1rem;">남자</label>
                                    <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required value="F" v-model="gender">
                                    <label class="form-check-label" for="debit">여자</label>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div style="display:flex; justify-content: end;">
                     <button  class="btn btn-primary width-150" @click="userUpd">수정</button>
                     <button  class="btn btn-white btn-white-without-border width-150 m-l-5" @click="cancle">취소</button>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
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
        loading : false,
        user_name:"",
        user_email:"",
        user_nickname:"",
        phone_number:"",
        gender:"",
        img_real:false,
        img:"",
        img_id:"",
        user_password:"",
    }
  },
  created(){
        this.init();
  },
  methods: {
    init() {
        this.myPage();
    }, 

    myPage() {
        const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
          }
        this.loading = true;
        this.$axios.get(process.env.VUE_APP_TRIP_USER_MY_PAGE,{headers}).then((res) =>{
            if(res.data.resultCode=="SUCCESS"){
                this.user_name = res.data.result.name;
                this.user_email = res.data.result.email;
                this.user_nickname = res.data.result.nickName;
                this.phone_number = res.data.result.phoneNumber;
                this.gender = res.data.result.gender;
                if(res.data.result.profileId==null || res.data.result.profileId==""){
                    this.img_real = false;
                } else {
                    this.img_real = true;
                }
                this.img_id = res.data.result.profileId;
                this.img = process.env.VUE_APP_FILE_IMAGE_READ+res.data.result.profileId+"/"+1;

            }
          }).catch(() => {
          }).finally(() => {
              this.loading = false;
          });
    },
    passwordClick(){
        if(!this.pw_chk(this.user_password)){
            this.$swal('',"하나 이상의 문자 , 숫자 , 특수 문자,최소 8자의 비밀번호가 필요합니다.","warning");
            return false;
        }
        let param = {
            "password" : this.user_password
        }
        const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
        this.$axios.post(process.env.VUE_APP_TRIP_USER_PASSWORD,param,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.$swal('',"저장되었습니다.",'success');
            }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
    },

    pw_chk(value) {
            return this.$passwordValidation(value);  
    },

    resetImageUploader() {
        this.$refs.imageUploader.value = '';
    },
    userUpd() {

        if(this.$emptyChk(this.user_nickname)){
            this.$swal('',"닉네임을 확인해주세요.",'warning');
            return false;
        }
        if(this.$emptyChk(this.phone_number)){
            this.$swal('',"휴대번호를 확인해주세요.",'warning');
            return false;
        }
        if(this.$emptyChk(this.gender)){
            this.$swal('',"성별을 확인해주세요.",'warning');
            return false;
        }
        const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
        let param = {
            "nickName" : this.user_nickname,
            "phoneNumber" : this.phone_number,
            "gender"    :this.gender,
            "profileId" : this.img_id
        }
        this.$axios.post(process.env.VUE_APP_TRIP_USER_OTHER,param,{headers}).then((res) =>{
                if(res.data.resultCode=="SUCCESS"){
                    this.$swal('',"저장되었습니다.",'success');
            }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
          this.myPage();
        });

    },
    cancle() {
        this.$router.push("/");
    },

    upload(e) {
      const file = e.target.files[0];
      var url = URL.createObjectURL(file);
        const headers = {
          "content-type" : "multipart/form-data"
        }
            const formdata = new FormData();
            formdata.append("multiFile",file);
            
        this.$axios.post(process.env.VUE_APP_FILE_UPLOAD,formdata,{headers}).then((res) =>{
            this.img = process.env.VUE_APP_FILE_IMAGE_READ+res.data[0].fileId+"/1";
            this.img_id = res.data[0].fileId;
        }).catch(() => {
        }).finally(() => {
        });
    }
  },
  watch : {
    phone_number() {
      this.phone_number = this.phone_number.replace(/[^0-9]/g, '');
      this.phone_number = this.$phoneNumberGetMask(this.phone_number);
    }
  },

}

</script>


<style scoped>
body{
    /* margin-top:20px; */
    /* background:#eee; */
}

.profile-header {
    position: relative;
    overflow: hidden
}

.profile-header .profile-header-cover {
    background-color: #00b5ec;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0
}

.profile-header .profile-header-cover:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .75) 100%)
}

.profile-header .profile-header-content {
    color: #fff;
    padding: 25px
}

.profile-header-img {
    float: left;
    width: 120px;
    height: 120px;
    overflow: hidden;
    position: relative;
    z-index: 10;
    margin: 0 0 -20px;
    padding: 3px;
    border-radius: 4px;
    background: #fff
}

.profile-header-img img {
    max-width: 100%
}

.profile-header-info h4 {
    font-weight: 500;
    color: #fff
}

.profile-header-img+.profile-header-info {
    margin-left: 140px
}

.profile-header .profile-header-content,
.profile-header .profile-header-tab {
    position: relative
}

.b-minus-1,
.b-minus-10,
.b-minus-2,
.b-minus-3,
.b-minus-4,
.b-minus-5,
.b-minus-6,
.b-minus-7,
.b-minus-8,
.b-minus-9,
.b-plus-1,
.b-plus-10,
.b-plus-2,
.b-plus-3,
.b-plus-4,
.b-plus-5,
.b-plus-6,
.b-plus-7,
.b-plus-8,
.b-plus-9,
.l-minus-1,
.l-minus-2,
.l-minus-3,
.l-minus-4,
.l-minus-5,
.l-minus-6,
.l-minus-7,
.l-minus-8,
.l-minus-9,
.l-plus-1,
.l-plus-10,
.l-plus-2,
.l-plus-3,
.l-plus-4,
.l-plus-5,
.l-plus-6,
.l-plus-7,
.l-plus-8,
.l-plus-9,
.r-minus-1,
.r-minus-10,
.r-minus-2,
.r-minus-3,
.r-minus-4,
.r-minus-5,
.r-minus-6,
.r-minus-7,
.r-minus-8,
.r-minus-9,
.r-plus-1,
.r-plus-10,
.r-plus-2,
.r-plus-3,
.r-plus-4,
.r-plus-5,
.r-plus-6,
.r-plus-7,
.r-plus-8,
.r-plus-9,
.t-minus-1,
.t-minus-10,
.t-minus-2,
.t-minus-3,
.t-minus-4,
.t-minus-5,
.t-minus-6,
.t-minus-7,
.t-minus-8,
.t-minus-9,
.t-plus-1,
.t-plus-10,
.t-plus-2,
.t-plus-3,
.t-plus-4,
.t-plus-5,
.t-plus-6,
.t-plus-7,
.t-plus-8,
.t-plus-9 {
    position: relative!important
}

.profile-header .profile-header-tab {
    background: #fff;
    list-style-type: none;
    margin: -10px 0 0;
    padding: 0 0 0 140px;
    white-space: nowrap;
    border-radius: 0
}

.text-ellipsis,
.text-nowrap {
    white-space: nowrap!important
}

.profile-header .profile-header-tab>li {
    display: inline-block;
    margin: 0
}

.profile-header .profile-header-tab>li>a {
    display: block;
    color: #929ba1;
    line-height: 20px;
    padding: 10px 20px;
    text-decoration: none;
    font-weight: 700;
    font-size: 12px;
    border: none
}

.profile-header .profile-header-tab>li.active>a,
.profile-header .profile-header-tab>li>a.active {
    color: #242a30
}

.profile-content {
    padding: 5px;
    border-radius: 4px
}

.profile-content:after,
.profile-content:before {
    content: '';
    display: table;
    clear: both
}

.profile-content .tab-content,
.profile-content .tab-pane {
    background: 0 0
}

.profile-left {
    width: 200px;
    float: left
}

.profile-right {
    margin-left: 240px;
    padding-right: 20px
}

.profile-image {
    height: 175px;
    line-height: 175px;
    text-align: center;
    font-size: 72px;
    margin-bottom: 10px;
    border: 2px solid #E2E7EB;
    overflow: hidden;
    border-radius: 4px
}

.profile-image img {
    display: block;
    max-width: 100%
}

.profile-highlight {
    padding: 12px 15px;
    background: #FEFDE1;
    border-radius: 4px
}

.profile-highlight h4 {
    margin: 0 0 7px;
    font-size: 12px;
    font-weight: 700
}

.table.table-profile>thead>tr>th {
    border-bottom: none!important
}

.table.table-profile>thead>tr>th h4 {
    font-size: 20px;
    margin-top: 0
}

.table.table-profile>thead>tr>th h4 small {
    display: block;
    font-size: 12px;
    font-weight: 400;
    margin-top: 5px
}

.table.table-profile>tbody>tr>td,
.table.table-profile>thead>tr>th {
    border: none;
    padding-top: 7px;
    padding-bottom: 7px;
    color: #242a30;
    background: 0 0
}

.table.table-profile>tbody>tr>td.field {
    width: 20%;
    text-align: right;
    font-weight: 600;
    color: #2d353c
}

.table.table-profile>tbody>tr.highlight>td {
    border-top: 1px solid #b9c3ca;
    border-bottom: 1px solid #b9c3ca
}

.table.table-profile>tbody>tr.divider>td {
    padding: 0!important;
    height: 10px
}

.profile-section+.profile-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #b9c3ca
}

.profile-section:after,
.profile-section:before {
    content: '';
    display: table;
    clear: both
}

.profile-section .title {
    font-size: 20px;
    margin: 0 0 15px
}

.profile-section .title small {
    font-weight: 400
}

body.flat-black {
    background: #E7E7E7
}

.flat-black .navbar.navbar-inverse {
    background: #212121
}

.flat-black .navbar.navbar-inverse .navbar-form .form-control {
    background: #4a4a4a;
    border-color: #4a4a4a
}

.flat-black .sidebar,
.flat-black .sidebar-bg {
    background: #3A3A3A
}

.flat-black .page-with-light-sidebar .sidebar,
.flat-black .page-with-light-sidebar .sidebar-bg {
    background: #fff
}

.flat-black .sidebar .nav>li>a {
    color: #b2b2b2
}

.flat-black .sidebar.sidebar-grid .nav>li>a {
    border-bottom: 1px solid #474747;
    border-top: 1px solid #474747
}

.flat-black .sidebar .active .sub-menu>li.active>a,
.flat-black .sidebar .nav>li.active>a,
.flat-black .sidebar .nav>li>a:focus,
.flat-black .sidebar .nav>li>a:hover,
.flat-black .sidebar .sub-menu>li>a:focus,
.flat-black .sidebar .sub-menu>li>a:hover,
.sidebar .nav>li.nav-profile>a {
    color: #fff
}

.flat-black .sidebar .sub-menu>li>a,
.flat-black .sidebar .sub-menu>li>a:before {
    color: #999
}

.flat-black .page-with-light-sidebar .sidebar .active .sub-menu>li.active>a,
.flat-black .page-with-light-sidebar .sidebar .active .sub-menu>li.active>a:focus,
.flat-black .page-with-light-sidebar .sidebar .active .sub-menu>li.active>a:hover,
.flat-black .page-with-light-sidebar .sidebar .nav>li.active>a,
.flat-black .page-with-light-sidebar .sidebar .nav>li.active>a:focus,
.flat-black .page-with-light-sidebar .sidebar .nav>li.active>a:hover {
    color: #000
}

.flat-black .page-sidebar-minified .sidebar .nav>li.has-sub:focus>a,
.flat-black .page-sidebar-minified .sidebar .nav>li.has-sub:hover>a {
    background: #323232
}

.flat-black .page-sidebar-minified .sidebar .nav li.has-sub>.sub-menu,
.flat-black .sidebar .nav>li.active>a,
.flat-black .sidebar .nav>li.active>a:focus,
.flat-black .sidebar .nav>li.active>a:hover,
.flat-black .sidebar .nav>li.nav-profile,
.flat-black .sidebar .sub-menu>li.has-sub>a:before,
.flat-black .sidebar .sub-menu>li:before,
.flat-black .sidebar .sub-menu>li>a:after {
    background: #2A2A2A
}

.flat-black .page-sidebar-minified .sidebar .sub-menu>li:before,
.flat-black .page-sidebar-minified .sidebar .sub-menu>li>a:after {
    background: #3e3e3e
}

.flat-black .sidebar .nav>li.nav-profile .cover.with-shadow:before {
    background: rgba(42, 42, 42, .75)
}

.bg-white {
    background-color: #fff!important;
}
.p-10 {
    padding: 10px!important;
}
.media.media-xs .media-object {
    width: 32px;
}
.m-b-2 {
    margin-bottom: 2px!important;
}
.media>.media-left, .media>.pull-left {
    padding-right: 15px;
}
.media-body, .media-left, .media-right {
    display: table-cell;
    vertical-align: top;
}
select.form-control:not([size]):not([multiple]) {
    height: 34px;
}
.form-control.input-inline {
    display: inline;
    width: auto;
    padding: 0 7px;
}
#chooseFile {
    visibility: hidden;
}
.file-label {
  background-color: #5b975b;
  color: #fff;
  text-align: center;
  padding: 10px 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.file {
  display: none;
}
</style>