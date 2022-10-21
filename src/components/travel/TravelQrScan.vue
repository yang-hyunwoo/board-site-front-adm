<template>
 <section class="py-5 text-center container">
        <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner">
          <h1 class="display-4">{{title}} QR 스캔</h1>
          <div style="width: 300px; height: 300px; display:inline-block;" >
          <qrcodescanner  @qrEmit="qrScan"></qrcodescanner>
          <p class="qr-code__toast" v-if="QrCodeToast">{{toastText}}</p>
        </div>
        </div>
      </div>
    </div>
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
                                <th scope="col">imp_uid</th>
                                <th scope="col">이름</th>
                                <th scope="col">Email</th>
                                <th scope="col">전화번호</th>
                                <th scope="col">인원</th>
                                <th scope="col">qr인증여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 조회수로 도시명 색상 변경-->
                            <tr v-for="(item,index) of user_list"   :key="index">
                                <td>{{item.imp_uid}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.email}}</td>
                                <td>{{item.tel}}</td>
                                <td>{{item.personCount}}</td>
                                <td>{{item.qrChk}}</td>
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
</template>

<script>
import Pagination from '../layout/Pagination';
import BlackBg from "../loading/BlackBg"
import Qrcodescanner from '../travel/Qrcodescanner'

export default {
	data: function () {
    return {
      travelAgencyId : this.$route.query.sn,
      pageListItem : 10 ,
      title: "",
      page : 0 ,
      travel_title : "" ,
      pageTotal : 0 ,
      pageChk : false ,
      user_list : [] ,
      loading:false,
      adminAuth:'',
      startPage:'',
      endPage:'',
      totalList:'',
      travelAgencyListSort:'',
      toastText:'인증 되었습니다.',
      QrCodeToast: false,
    }
  },
  components: {
    Pagination,
    BlackBg,
    qrcodescanner:Qrcodescanner
  },
  created() {
      this.init();
  },

  methods: {
    init() {
        this.travelList();
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
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
        });
    },
    qrScan(value) {
      //id받아서 유저 정보 받기
      
      //1.user 정보 확인
      //2.resId 조회 count 확인 
      //3.되었다면 qrChk true로 변환
        this.isQrCodeToast(this.getJsonFromUrl(value).id , this.getJsonFromUrl(value).travelAgencyResId,this.getJsonFromUrl(value).count);
    }, 
    isQrCodeToast(id,travelAgencyResId,count) {
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
        let param = {
                    "id"  :  travelAgencyResId,
                    "userId" : id ,
                    "count" : count,
                    "travelAgencyListId" : this.travelAgencyId
                }
        this.$axios.put(process.env.VUE_APP_TRAVEL_AGENCY_LIST_CRUD+"qrcode/qr-upd",param,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
              this.userList();
            }
          }).catch((error) => {
              this.$swal('',error.response.data.result,'error');
          }).finally(() => {
          });


            this.QrCodeToast = true

            if(this.QrCodeToast == true) {
                setTimeout(() => 
                    this.QrCodeToast = false
                , 1000);
            }
      },
    getJsonFromUrl(url) {
       var querysplit = url.split("?");
        var query = querysplit[1];
        var result = {};
        query.split("&").forEach(function(part) {
          var item = part.split("=");
          result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    },
    travelList() {
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }

      this.loading = true;
      this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_LIST_CRUD+"qrcode/"+this.travelAgencyId,{headers}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          this.title = res.data.result.title;
          this.userList();
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
             this.$router.push("/travelQrReadList");
        }).finally(() => {
        });
    },
    userList() {
      this.pageChk = false;
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
      this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_LIST_CRUD+"qrcode/"+this.travelAgencyId+"/userlist",{headers}).then((res) =>{
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
              obj.imp_uid   = element.imp_uid;
              obj.name   = element.tripUserDto.name;
              obj.email   = element.tripUserDto.email;
              obj.tel     = element.tripUserDto.phoneNumber;
              obj.personCount = element.personCount;
              if(!element.qrChk) {
                obj.qrChk = "미 인증";
              } else {
                obj.qrChk = "인증";
              }
              this.user_list.push(obj);
          });
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
             this.$router.push("/travelQrReadList");
        }).finally(() => {
          this.pageChk = true;
          this.loading = false;
        });
    },

    pageCurr(value){
      this.page = value-1;
      this.travelList();
    },

    todoCclick(value) {
       this.$router.push({
        path: "/TravelDetail",
        name: "travelDetail",
        query: { sn: value }
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
