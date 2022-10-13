<template>
 <section class="py-5 text-center container">
        <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner">
          <h1 class="display-4">여행 리스트</h1>
          <select class="form-select" aria-label="Default select example" v-model="date_type" style="margin-right:1rem;">
              <option selected value="CREATEDAT">작성일</option>
              <option value="STARTAT">출발일</option>
            </select>
          <input type="date" v-model="startDate"> ~ <input type="date" v-model="endDate">
          <select class="form-select" aria-label="Default select example" v-model="search_type" style="margin-left:1rem;">
              <option selected value="TITLE">제목</option>
              <option value="AGENCYNAME">여행사</option>
            </select>
           <input class="form-control mr-sm-2 custombar" type="search" placeholder="제목을 입력해주세요." aria-label="Search" v-model="travel_title" v-on:keyup.enter="travelSearch" style="margin-left:1rem;">
          <button class="btn btn-outline-success my-2 my-sm-0" style="margin-left:1rem;" @click="travelSearch" >Search</button>
    
        </div>
      </div>
    </div>
    <button style="float:right" type="button" class="btn btn-primary" @Click="travelWriteClick()">신규등록</button>
    <button style="float:right; margin-right:10px;" type="button" class="btn btn-primary" @Click="tourWriteClick()">정렬 변경</button>
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
                                <th scope="col">실제가격/할인율/할인가격</th>
                                <th scope="col">등록일~종료일</th>
                                <th scope="col">출발일</th>
                                <th v-if="adminAuth=='SUPER'" scope="col">정렬 순서</th>
                                <th scope="col">종료여부</th>
                                <th scope="col" style="width: 200px;">변경</th>
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
                                <td>{{item.start_de}}~{{item.end_de}}</td>
                                <td>{{item.trip_start_de}}</td>
                                <td v-if="adminAuth=='SUPER'">{{item.sort}}</td>
                                <td>
                                    <span v-if="item.deleted=='종료'" class="badge badge-soft-danger mb-0">
                                    {{item.deleted}}
                                    </span>
                                    <span v-if="item.deleted=='진행 중'" class="badge badge-soft-info mb-0">
                                    {{item.deleted}}
                                    </span>
                                </td>
                                <td>
                                    <ul class="list-inline mb-0">
                                        <li class="list-inline-item">
                                            <a @click="updateClick(item.id)"  data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" class="px-2 text-primary" style="cursor:pointer"><i class="bx bx-pencil font-size-18"></i></a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a  @click="deleteClick(item.id,item.deleted)" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" class="px-2 text-danger" style="cursor:pointer"><i class="bx bx-trash-alt font-size-18"></i></a>
                                        </li>
                                        <li class="list-inline-item dropdown">
                                            <a class="text-muted dropdown-toggle font-size-18 px-2" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true"><i class="bx bx-dots-vertical-rounded"></i></a>
                                            <div class="dropdown-menu dropdown-menu-end" >
                                                <a class="dropdown-item" @click="updateClick(item.id)" style="cursor: pointer;">수정</a><a class="dropdown-item" @click="deleteClick(item.id,item.deleted)" style="cursor: pointer;">삭제</a><a class="dropdown-item" @click="reDeleteClick(item.id,item.deleted)" >재등록</a>
                                            </div>
                                        </li>
                                    </ul>
                                </td>
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
      search_type : "TITLE",
      date_type:"CREATEDAT",
      startDate:'',
      startDateSplit:'',
      endDate:'',
      endDateSplit:'',
      adminAuth:'',
      startPage:'',
      endPage:'',
      totalList:'',

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
        this.startDate=  yy + '-' + mm + '-' + "01";
        this.startDateSplit = yy+mm+"01";
        this.endDate= yy + '-' + mm + '-' + dd;
        this.endDateSplit = yy+mm+dd;
    },  

    travelList() {
      const headers = {
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }
      let parameter = {
        "page" : this.page,
        "inputSearch" : this.search_type ,
        "dateSearch" : this.date_type,
        "startedAt" : this.startDate,
        "endAt" : this.endDate,
        "input" : this.travel_title
      }
      this.loading = true;
      this.$axios.get(process.env.VUE_APP_TRAVEL_LIST,{headers,params:parameter}).then((res) =>{
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
                obj.title         = element.title;
                obj.travelAgencyName          = element.travelAgencyName;
                obj.id            = element.id;
                obj.city          = element.city;
                obj.start_de      = this.$splitDateHyphen(element.travel_start_at);
                obj.end_de        = this.$splitDateHyphen(element.travel_end_at);
                obj.trip_start_de = this.$splitDateHyphen(element.travelRealTripAt);
                obj.real_pay      = element.real_paid+"원";
                obj.sale_percent  = element.sale_percent+"%";
                obj.sale_pay      = element.sale_paid+"원";
                obj.sort = element.sort;
                if(element.deleted){
                  obj.deleted = '종료'
                } else{
                  obj.deleted = '진행 중'
                }
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

    deleteClick(idx, value) {
      console.log(idx);
      if(value=='진행 중'){
          const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }

            this.loading = true;
            this.$axios.put(process.env.VUE_APP_TRAVEL_AGENCY_LIST_CRUD+idx+"/delete" ,"",{headers}).then((res) =>{
              if(res.data.resultCode=="SUCCESS"){
                this.travelList();
              }
              
            }).catch((error) => {
                this.$swal('',error.response.data.result,'error');
            }).finally(() => {
              this.loading = false;
            });
      } else {
        this.$swal('','이미 종료된 여행 입니다.','warning');
      }
    },

    reDeleteClick(idx,value) {
      if(value=='종료'){
          const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }

            this.loading = true;
            this.$axios.put(process.env.VUE_APP_TRAVEL_AGENCY_LIST_CRUD+idx+"/re-delete" ,"",{headers}).then((res) =>{
              if(res.data.resultCode=="SUCCESS"){
                this.travelList();
              }
              
            }).catch((error) => {
                this.$swal('',error.response.data.result,'error');
            }).finally(() => {
              this.loading = false;
            });
      } else {
        this.$swal('','이미 사용중인 여행사 입니다.','warning');
      }
    },


    pageCurr(value){
      this.page = value-1;
      this.travelList();
    },

    travelSearch(){
       this.page = 0;
       this.pageChk=false;
       this.travelList();
    },
    travelWriteClick() {
      this.$router.push({
        path: "/TravelWrite",
        name: "travelWrite"
      });
    },


    todoCclick(value) {
       this.$router.push({
        path: "/TravelDetail",
        name: "travelDetail",
        query: { sn: value }
      });
    },
},
watch : {
  startDate(){
    let splitDate = this.startDate.split("-");
    this.startDateSplit = splitDate[0]+splitDate[1]+splitDate[2];
  },
  endDate(){
    let splitDate = this.endDate.split("-");
    this.endDateSplit = splitDate[0]+splitDate[1]+splitDate[2];
  }
}

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
