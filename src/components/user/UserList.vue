<template>
 <section class="py-5 text-center container">
        <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner">
          <h1 class="display-4">사용자 조회</h1>
          <select class="form-select" aria-label="Default select example" v-model="search_type" style="margin-left:1rem;">
              <option selected value="NAME">이름</option>
              <option value="NICKNAME">닉네임</option>
              <option value="EMAIL">이메일</option>
            </select>
           <input class="form-control mr-sm-2 custombar" type="search" placeholder="제목을 입력해주세요." aria-label="Search" v-model="user_info" v-on:keyup.enter="travelSearch" style="margin-left:1rem;">
          <button class="btn btn-outline-success my-2 my-sm-0" style="margin-left:1rem;" @click="travelSearch" >Search</button>
    
        </div>
      </div>
    </div>
    <!-- <button style="float:right; margin-left:10px;" type="button" class="btn btn-primary" @Click="agencyExcel()">엑셀</button> -->
  </section>
 
  <div class="container">
  <div class="row py-5">
    <div class="mb-3">
                <h5 class="card-title">목록 <span class="text-muted fw-normal ms-2">{{startPage}} to {{endPage}}  of {{totalList}}</span></h5>
            </div>
    <!-- For demo purpose -->

    <!-- End -->

    <div class="row">
        <div class="col-lg-12">
            <div class="">
                <div class="table-responsive">
                    <table class="table project-list-table table-nowrap align-middle table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">이름</th>
                                <th scope="col">닉네임</th>
                                <th scope="col">이메일</th>
                                <th scope="col">휴대폰</th>
                                <th scope="col">결제내역</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 조회수로 도시명 색상 변경-->
                            <tr v-for="(item,index) of user_list"   :key="index">
                         
                                <td>
                                    <img :src="item.img" alt="" class="avatar-sm rounded-circle me-2" v-if="item.img_real"/>
                                    <a  class="text-body" >{{item.name}}</a></td>
                                <td>{{item.nickName}}</td>
                                <td>{{item.email}}</td>
                                <td>{{item.phoneNumber}}</td>
                                <td><button type="button" class="btn btn-primary" @Click="userPayList(item.id)">결제 내역</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
     <BlackBg v-if="loading"></BlackBg>
    <Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal"></Pagination>
  </div>
</div>
<Dialog @close="payOpen=false" v-if="payOpen">
    <template #cont>
      <div class="row">
        <div class="col-lg-12">
            <div class="">
                <div class="table-responsive">
                    <table class="table project-list-table table-nowrap align-middle table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">결제id</th>
                                <th scope="col">결제일</th>
                                <th scope="col">여행 제목</th>
                                <th scope="col">이름</th>
                                <th scope="col">이메일</th>
                                <th scope="col">휴대폰</th>
                                <th scope="col">결제여부</th>
                            </tr>
                        </thead>
                        <tbody v-if="popReset">
                            <!-- 조회수로 도시명 색상 변경-->
                            <tr v-for="(item,index) of user_pay_list"   :key="index">
                                <td>{{item.imp_uid}}</td>
                                <td>{{item.pay_day}}</td>
                                <td>{{item.travel_title}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.email}}</td>
                                <td>{{item.phone}}</td>                                
                                <td v-if="item.use_ok=='결제 완료'"><span class="badge badge-soft-success mb-0">{{item.use_ok}}</span></td>       
                                <td v-if="item.use_ok=='환불 완료'"><span class="badge badge-soft-danger mb-0">{{item.use_ok}}</span></td>       
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    <Pagination v-if="pageChkPop" :pageListItem="pageListItem" @pageCurrent="pageCurrPop" :pageTotal="pageTotalPop"></Pagination>

    </div>
    </template>
</Dialog>
</template>

<script>
import Pagination from '../layout/Pagination';
import BlackBg from "../loading/BlackBg"
import Dialog from '../dialog/Dialog';

export default {
	data: function () {
    return {
      pageListItem : 10 ,
      page : 0 ,
      pagePop : 0,
      user_info : "" ,
      pageTotal : 0 ,
      pageTotalPop: 0 ,
      pageChk : false ,
      pageChkPop : false ,
      travel_list : [] ,
      loading:false,
      search_type : "NAME",
      adminAuth:'',
      startPage:'',
      endPage:'',
      totalList:'',
      payOpen:false,
      userId:'',
      popReset:false,

    }
  },
  components: {
    Pagination,
    BlackBg,
    Dialog
  },
  created() {
      this.init();
  },

  methods: {
    init() {
        this.userList();
        this.authChk();
    },
    authChk() {
      const headers = { 
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
      this.$axios.get(process.env.VUE_APP_AUTH,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            this.adminAuth = res.data.result.role;
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요22.','error');
        }).finally(() => {
        });
    },

    userList() {
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
      let parameter = {
        "page" : this.page,
        "searchAdmUserType" : this.search_type ,
        "input" : this.user_info
      }
      this.loading = true;
      this.$axios.get(process.env.VUE_APP_USER_LIST,{headers,params:parameter}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          this.pageTotal = res.data.result.totalElements;
          this.totalList =res.data.result.totalElements;
          this.startPage = (res.data.result.number*res.data.result.size)+1;
          if(res.data.result.numberOfElements==res.data.result.size){
              this.endPage = (res.data.result.number+1)*res.data.result.size;
          } else {
              this.endPage = (res.data.result.number*res.data.result.size)+res.data.result.numberOfElements;
          }
            this.user_list=[];
            res.data.result.content.forEach(element => {
                let obj = [];
                obj.name         =  element.name;
                obj.nickName     =  element.nickName;
                obj.email        =  element.email;
                obj.id           =  element.id;
                obj.phoneNumber  =  element.phoneNumber;
                if(element.profileId ==null || element.profileId==""){
                  obj.img_real = false;
                } else{
                  obj.img_real = true;
                }
                  obj.img     = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+element.profileId+"/"+1;
                this.user_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.pageChk = true;
          this.loading = false;
        });
    },

    userPayDetail(value) {
      this.popReset = false;
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
      let parameter = {
        "page" : this.pagePop,
        "userId" : value ,
      }
      this.$axios.get(process.env.VUE_APP_USER_PAY_LIST,{headers,params:parameter}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          this.pageTotalPop = res.data.result.totalElements;
            this.user_pay_list=[];
            res.data.result.content.forEach(element => {
                let obj = [];
                obj.imp_uid         =  element.imp_uid;
                obj.pay_day     =  element.createdAt.substr(0,10);
                obj.travel_title        =  element.travelAgencyListTitle;
                obj.name           =  element.tripUserDto.name;
                obj.email  =  element.tripUserDto.email;
                obj.phone  =   element.tripUserDto.phoneNumber;
                if(element.deleted) {
                  obj.use_ok  = '환불 완료'
                } else {
                  obj.use_ok  = '결제 완료'
                }
                this.user_pay_list.push(obj);
            });
            this.payOpen=true;
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.popReset = true;
          this.pageChkPop = true;
        });


    },
    pageCurr(value){
      this.page = value-1;
      this.userList();
    },
    pageCurrPop(value) {
      this.pagePop = value-1;
      this.userPayDetail(this.userId);
    },

    travelSearch(){
       this.page = 0;
       this.pageChk=false;
       this.userList();
    },
    travelWriteClick() {
      this.$router.push({
        path: "/TravelWrite",
        name: "travelWrite"
      });
    },

    userPayList(value) {

      this.userId = value;
      this.userPayDetail(this.userId);
    },

    agencyExcel() {
        let myDate = new Date();
        let yy = String(myDate.getFullYear());
        let mm = String(myDate.getMonth()+1 < 10 ? '0' + myDate.getMonth()+1 : myDate.getMonth()+1);
        let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
        let today = yy + '-' + mm + '-' + dd;
      const headers = { 
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
      let param = {
        "excelType" : "TRAVELAGENCYLIST"
      }
      this.$axios.get(process.env.VUE_APP_EXCEL_DOWN,{headers,responseType: 'blob',params:param}).then((res) =>{
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', today+"_여행 목록.xls");
          document.body.appendChild(link);
          link.click();
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.chk = true;
        });
    },
},

}
</script>
<style>
.custombar{
  width: 50%;
  display: inline-block;
}
.deco{
  text-decoration: line-through;
}
.curcus{
   cursor: pointer;
}

.banner {
  background: #a770ef;
  background: -webkit-linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b);
  background: linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b);
}
.custombar{
  width: 40%;
  display: inline-block;
}
.form-select {
  width : 9%;
  display: inline;
}

input[type="date"]{
  position: relative;
  min-height:14px;
  border: 1px solid #ddd;
  font-size:16px;
}

body{margin-top:20px;
}
.project-list-table {
    border-collapse: separate;
    border-spacing: 0 12px
}

.project-list-table tr {
    background-color: #fff
}

.table-nowrap td, .table-nowrap th {
    white-space: nowrap;
}
.table-borderless>:not(caption)>*>* {
    border-bottom-width: 0;
}
.table>:not(caption)>*>* {
    padding: 0.75rem 0.75rem;
    background-color: var(--bs-table-bg);
    border-bottom-width: 1px;
    box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);
}

.avatar-sm {
    height: 2rem;
    width: 2rem;
}
.rounded-circle {
    border-radius: 50%!important;
}
.me-2 {
    margin-right: 0.5rem!important;
}
img, svg {
    vertical-align: middle;
}

a {
    color: #3b76e1;
    text-decoration: none;
}

.badge-soft-danger {
    color: #f56e6e !important;
    background-color: rgba(245,110,110,.1);
}
.badge-soft-success {
    color: #63ad6f !important;
    background-color: rgba(99,173,111,.1);
}

.badge-soft-primary {
    color: #3b76e1 !important;
    background-color: rgba(59,118,225,.1);
}

.badge-soft-info {
    color: #57c9eb !important;
    background-color: rgba(87,201,235,.1);
}

.avatar-title {
    align-items: center;
    background-color: #3b76e1;
    color: #fff;
    display: flex;
    font-weight: 500;
    height: 100%;
    justify-content: center;
    width: 100%;
}
.bg-soft-primary {
    background-color: rgba(59,118,225,.25)!important;
}

</style>
