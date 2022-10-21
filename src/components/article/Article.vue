<!-- eslint-disable vue/multi-word-component-names -->
<template>
 <section class="py-5 text-center container">
            <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner">
          <h1 class="display-4">게시판</h1>
          <!-- <p class="lead">나에게 맞는 여행을 찾아보세요</p> -->
            <select class="form-select" aria-label="Default select example" v-model="search_type">
              <option selected value="TITLE">제목</option>
              <option value="NICKNAME">닉네임</option>
            </select>
       <input style="margin-left:1rem;" class="form-control mr-sm-2 custombar" type="search"  aria-label="Search" v-model="article_title" v-on:keyup.enter="articleSearch">
            <button class="btn btn-outline-success my-2 my-sm-0" style="margin-left:1rem;" @click="articleSearch" >Search</button>
   
        </div>
      </div>
    </div>

    <div class="container">
    <div class="row">
        <div class="col-lg-12">
            <div class="">
                <div class="table-responsive">
                    <table class="table project-list-table table-nowrap align-middle table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">제목</th>
                                <th scope="col">작성자</th>
                                <th scope="col">작성일</th>
                                <th scope="col">게시여부</th>
                                <th scope="col" style="width: 200px;">수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 조회수로 도시명 색상 변경-->
                            <tr v-for="(item,index) of article_list"   :key="index">
                         
                                <td @click="articleDetailClick(item.id)" style="cursor: pointer;">
                                    <a  class="text-body" >{{item.title}}</a></td>
                                <td>{{item.nickname}}</td>
                                <td>{{item.created_at}}</td>
                                <td>
                                    <span v-if="item.deleted=='게시 중단'" class="badge badge-soft-danger mb-0">
                                    {{item.deleted}}
                                    </span>
                                    <span v-if="item.deleted=='게시 중'" class="badge badge-soft-info mb-0">
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
                                            <div class="dropdown-menu dropdown-menu-end">
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
</div>

<!-- <b-table-simple hover small caption-top responsive>

  <colgroup>
    <col />
    <col />
  </colgroup>
  <colgroup>
    <col />
  </colgroup>
  <colgroup>
    <col />
  </colgroup>
  <b-thead head-variant="dark">
    <b-tr>
      <b-th>제목</b-th>
      <b-th>작성자</b-th>
      <b-th>작성일</b-th>
      <b-th>조회수</b-th>
    </b-tr>
  </b-thead>
  <b-tbody style="cursor: pointer;">
   <b-tr @click="articleDetailClick(item.id)" v-for="(item,index) of article_list" :key="index">
      <b-th style="text-align:start; text-overflow:ellipsis">{{item.title}}</b-th>
      <b-td>{{item.nickname}}</b-td>
      <b-td>{{item.created_at}}</b-td>
      <b-td>{{item.read_count}}</b-td>
    </b-tr>
  </b-tbody>
</b-table-simple> -->
   <button style="float:right" type="button" class="btn btn-primary" @click="writer">글작성</button>
</section>
<Pagination v-if="pageChk" :pageListItem="pageListItem"  @pageCurrent="pageCurr" :pageTotal="pageTotal"></Pagination>
</template>
<script>
import Pagination from '../layout/Pagination';

export default {
	data: function () {
    return {
      pageListItem : 10,
      page : 0 ,
      pageTotal : 0 ,
      pageChk : false ,
      article_title: "",
      article_list : [],
      loading:false,
      search_type : "TITLE",
    }
  },
  components: {
    Pagination
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.articleList();
    },
    articleList() {
        let parameter = {
          "page" : this.page,
          "searchKeyWord" : this.article_title,
          "searchType" :  this.search_type
        }

      this.$axios.get(process.env.VUE_APP_ARTICLE_LIST,{params:parameter}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){

          this.pageTotal = res.data.result.totalElements;
            this.article_list=[];
            res.data.result.content.forEach(element => {
                let obj = [];
                obj.title         = element.title;
                obj.nickname      = element.nickName;
                obj.id            = element.id;
                obj.created_at    = this.$splitDateHyphenLo(element.createdAt);
                obj.read_count    = element.readCount;
                if(element.deleted) {
                  obj.deleted='게시 중단';
                } else {
                  obj.deleted='게시 중';
                }
                this.article_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.pageChk = true;
        });
    },

    deleteClick(value,del) {
      if(del=='게시 중'){
          const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
          this.$axios.put(process.env.VUE_APP_ARTICLE_DETAIL+value+"/delete",null,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
              this.articleList();
              }
          }).catch(() => {
              this.$swal('','잠시후 다시 이용해주세요.','error');
          }).finally(() => {
          });
      } else {
          this.$swal('','이미 게시 중단된 게시글입니다.','error');
          return false;
      }
    },
    articleDetailClick(value) { 
      this.$router.push({
        path: "/articleDetail",
        name: "articleDetail",
        query: { sn: value }
      });
    },
    articleSearch(){
       this.page = 0;
       this.pageChk=false;
       this.articleList();
    },
    pageCurr(value){
      this.page = value-1;
      this.articleList();
    },
    //수정 버튼 클릭 시
    updateClick(value){
    this.$router.push({
        path: "/articleModify",
        name: "articleModify",
        query: { sn: value }
      });
    },

    writer(){
      if(!this.$tokenCheck()){
        this.$router.push("/login");
      } else {  
        this.$router.push("/articleWrite");
      }
    },
      //재등록 버튼 클릭 시 
      reDeleteClick(value,del) {
        if(del=='게시 중단'){
            const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem("token")}
            this.$axios.put(process.env.VUE_APP_ARTICLE_DETAIL+value+"/re-delete" ,null,{headers}).then((res) =>{
            if(res.data.resultCode=="SUCCESS"){
                this.articleList();
                }
            }).catch(() => {
                this.$swal('','잠시후 다시 이용해주세요.','error');
            }).finally(() => {
            });
        } else {
            this.$swal('','이미 게시 된 게시글 입니다.','error');
            return false;
        }
    },

  }
}

</script>

<style>
.custombar{
  width: 40%;
  display: inline-block;
}
.form-select {
  width : 9%;
  display: inline;
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