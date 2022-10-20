<template>
 <section class="py-5 text-center container">
        <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner">
          <h1 class="display-4">QR</h1>
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
                                <th scope="col">제목</th>
                                <th scope="col">도시</th>
                                <th scope="col">여행사</th>
                                <th scope="col">가격/할인율/할인가격</th>
                                <th scope="col">출발일</th>
                                <th scope="col" style="width: 200px;">QR입장</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 조회수로 도시명 색상 변경-->
                            <tr v-for="(item,index) of travel_list"   :key="index">
                                <td @click="todoCclick(item.id)" style="cursor: pointer;">
                                    <img :src="item.img" alt="" class="avatar-sm rounded-circle me-2" v-if="item.img_real"/>
                                    <a  class="text-body" >{{item.title}}</a></td>
                                <td>{{item.city}}</td>
                                <td>{{item.travelAgencyName}}</td>
                                <td><span class="badge badge-soft-info mb-0">{{item.real_pay}}</span><span class="badge badge-soft-primary mb-0">{{item.sale_percent}}</span><span class="badge badge-soft-danger mb-0">{{item.sale_pay}}</span></td>
                                <td>{{item.trip_start_de}}</td>
                                <td>
                                  <button class="btn btn-primary" style="margin-left:3px; height:35px;" @click="qrScan(item.id)">QR스캔</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
     <BlackBg v-if="loading"></BlackBg>
    <Pagination v-if="pageChk" :pageListItem="pageListItem" @de="de" :pageTotal="pageTotal"></Pagination>
  </div>
</div>
</template>

<script>
import Pagination from '../layout/Pagination';
import BlackBg from "../loading/BlackBg"

export default {
	data: function () {
    return {
      pageListItem : 10 ,
      page : 0 ,
      travel_title : "" ,
      pageTotal : 0 ,
      pageChk : false ,
      travel_list : [] ,
      loading:false,
      date_type:"STARTAT",
      startDate:'',
      adminAuth:'',
      startPage:'',
      endPage:'',
      totalList:'',
      travelAgencyListSort:'',

    }
  },
  components: {
    Pagination,
    BlackBg
  },
  created() {

      this.init();
  },

  methods: {
    init() {
      this.dateInit();
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
    dateInit(){
        let myDate = new Date();
        let yy = String(myDate.getFullYear());
        let mm = String(myDate.getMonth()+1 < 10 ? '0' + myDate.getMonth()+1 : myDate.getMonth()+1);
        let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
        this.startDate =  yy + '-' + mm + '-' + dd;
        // this.startDate="2022-11-03";
    },  

    travelList() {
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
      let parameter = {
        "page" : this.page,
        "startedAt" : this.startDate,
        "endAt" : this.startDate,
      }
      this.loading = true;
      this.$axios.get(process.env.VUE_APP_TRAVEL_QRCODE_LIST,{headers,params:parameter}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          console.log(res);
          this.pageTotal = res.data.result.totalElements;

          this.totalList =res.data.result.totalElements;
          this.startPage = (res.data.result.number*res.data.result.size)+1;
          if(res.data.result.numberOfElements==res.data.result.size){
              this.endPage = (res.data.result.number+1)*res.data.result.size;
          } else {
              this.endPage = (res.data.result.number*res.data.result.size)+res.data.result.numberOfElements;
          }
            this.travel_list=[];
            res.data.result.content.forEach(element => {
                let obj = [];
                obj.title         = element.title.substr(0,6);
                obj.travelAgencyName          = element.travelAgencyName;
                obj.id            = element.id;
                obj.city          = element.city;
                obj.trip_start_de = this.$splitDateHyphen(element.travelRealTripAt);
                obj.real_pay      = element.real_paid+"원";
                obj.sale_percent  = element.sale_percent+"%";
                obj.sale_pay      = element.sale_paid+"원";
                if(element.thumnbnailFileId ==null || element.thumnbnailFileId==""){
                  obj.img_real = false;
                } else{
                  obj.img_real = true;
                }
                  obj.img     = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+element.thumnbnailFileId+"/"+1;

                this.travel_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
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
    qrScan(value) {
      this.$router.push({
        path: "/travelQrScan",
        name: "travelQrScan",
        query: { sn: value }
      });
    }


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
