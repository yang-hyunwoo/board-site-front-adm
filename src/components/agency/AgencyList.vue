<template>
      <section class="py-5 text-center container">
        <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner" style="text-align:center">
          <h1 class="display-4">여행사</h1>
           <input style="margin-left:1rem;" class="form-control mr-sm-2 custombar" type="search"  aria-label="Search" v-model="agency_title" v-on:keyup.enter="agencySearch">
           <button class="btn btn-outline-success my-2 my-sm-0" style="margin-left:1rem;" @click="articleSearch" >Search</button>

        </div>
      </div>
    </div>
       <button style="float:right" type="button" class="btn btn-primary" @Click="tourWriteClick()" v-if="adminAuth=='SUPER'">신규등록</button>
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
                                <th scope="col">여행사</th>
                                <th scope="col">주소</th>
                                <th scope="col">전화번호</th>
                                <th scope="col">사용유무</th>
                                <th scope="col" style="width: 200px;">변경</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 조회수로 도시명 색상 변경-->
                            <tr v-for="(item,index) of agency_list"   :key="index">
                         
                                <td @click="todoCclick(item.id)" style="cursor: pointer;">
                                    <img :src="item.img" alt="" class="avatar-sm rounded-circle me-2" v-if="item.img_real"/>
                                    <a  class="text-body" >{{item.agency_name}}</a></td>
                                <td><span class="badge badge-soft-info mb-0">{{item.address}}</span></td>
                                <td>{{item.tel}}</td>
                                <td>
                                    <span v-if="item.deleted=='미사용'" class="badge badge-soft-danger mb-0">
                                    {{item.deleted}}
                                    </span>
                                    <span v-if="item.deleted=='사용'" class="badge badge-soft-info mb-0">
                                    {{item.deleted}}
                                    </span>
                                </td>
                                <td>
                                    <ul class="list-inline mb-0">
                                        <li class="list-inline-item">
                                            <a @click="updateClick(item.id)"  data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" class="px-2 text-primary" style="cursor:pointer"><i class="bx bx-pencil font-size-18"></i></a>
                                        </li>
                                        <li class="list-inline-item" v-if="adminAuth=='SUPER'">
                                            <a  @click="deleteClick(item.id,item.deleted)" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" class="px-2 text-danger" style="cursor:pointer"><i class="bx bx-trash-alt font-size-18"></i></a>
                                        </li>
                                        <li class="list-inline-item dropdown" v-if="adminAuth=='SUPER'">
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
      pageListItem : 12 ,
      page : 0 ,
      pageTotal : 0 ,
      pageChk : false ,
      loading : false,
      agency_list : [],
      agency_title:"",
      totalList:'',
      startPage:'',
      endPage:'',
      adminAuth:'',
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
      this.agencyList();
      this.authChk();
    },

    authChk(){
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

    agencyList() {
      let parameter = {
        "page"                 : this.page , 
        "travelAgencyName"     : this.agency_title
      }
      const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
      this.loading = true;

      this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_LIST,{headers,params:parameter}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          this.pageTotal = res.data.result.totalElements;
            this.agency_list=[];
            this.totalList =res.data.result.totalElements;
            this.startPage = (res.data.result.number*res.data.result.size)+1;
            if(res.data.result.numberOfElements==res.data.result.size){
              this.endPage = (res.data.result.number+1)*res.data.result.size;
            } else {
              this.endPage = (res.data.result.number*res.data.result.size)+res.data.result.numberOfElements;
            }
            res.data.result.content.forEach(element => {
                  let obj = [];
                  obj.agency_name    = element.name;
                  obj.id             = element.id;
                  obj.agency_list    = element.name;
                  obj.agency_comment  = element.comment;  
                if(element.fileId ==null || element.fileId==""){
                  obj.img_real = false;
                } else{
                  obj.img_real = true;
                }
                if(!element.deleted){
                  obj.deleted ="사용";
                }else {
                  obj.deleted ="미사용";
                }
                  obj.img     = process.env.VUE_APP_FILE_IMAGE_READ+element.fileId+"/"+1;
                  obj.address = element.address;
                  obj.tel     = element.tel;
                this.agency_list.push(obj);
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
      this.agencyList();
    },
    agencySearch(){
       this.page = 0;
       this.pageChk=false;
       this.agencyList();
    },
    agency_click(value) {
      this.$router.push({
        path: "/AgencyDetail",
        name: "agencyDetail",
        query: { sn: value }
      });
    },

    deleteClick(idx, value) {
      if(value=='사용'){
          const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }

            this.loading = true;
            this.$axios.put(process.env.VUE_APP_TRAVEL_AGENCY+idx+"/delete" ,"",{headers}).then((res) =>{
              if(res.data.resultCode=="SUCCESS"){
                this.agencyList();
              }
              
            }).catch((error) => {
                this.$swal('',error.response.data.result,'error');
            }).finally(() => {
              this.loading = false;
            });
      } else {
        this.$swal('','이미 미사용된 여행사 입니다.','warning');
      }

    },
    reDeleteClick(idx,value) {
      if(value=='미사용'){
          const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }

            this.loading = true;
            this.$axios.put(process.env.VUE_APP_TRAVEL_AGENCY+idx+"/re-delete" ,"",{headers}).then((res) =>{
              if(res.data.resultCode=="SUCCESS"){
                this.agencyList();
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

    todoCclick(value) {
          this.$router.push({
           path: "/agencyDetail",
           name: "agencyDetail",
           query: { sn: value }
         });
    },

    updateClick(value){
        this.$router.push({
           path: "/agencyModify",
           name: "agencyModify",
           query: { sn: value }
         });
    },
    tourWriteClick() {
      if(!this.$tokenCheck()){
            this.$router.push("/login");
        } else {  
            this.$router.push("/agencyWrite");
        }

    }


  }

}
</script>

<style scoped>

body {
  background: #f4f4f4;
}

body{margin-top:20px;
background-color:#eee;
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
</style>