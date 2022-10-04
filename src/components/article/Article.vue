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


<b-table-simple hover small caption-top responsive>

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
      <!-- <b-th class="text-right">{{item.content}}</b-th> -->
      <b-td>{{item.nickname}}</b-td>
      <b-td>{{item.created_at}}</b-td>
      <b-td>{{item.read_count}}</b-td>
    </b-tr>
  </b-tbody>
</b-table-simple>
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
            console.log(res.data);
          this.pageTotal = res.data.result.totalElements;
            this.article_list=[];
            res.data.result.content.forEach(element => {
                let obj = [];
                obj.title         = element.title;
                obj.nickname      = element.nickName;
                obj.id            = element.id;
                obj.created_at    = this.$splitDateHyphenLo(element.createdAt);
                obj.read_count    = element.readCount;

                this.article_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.pageChk = true;
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

    articleDetailClick(value) {
      this.$router.push({
        path: "/articleDetail",
        name: "articleDetail",
        query: { sn: value }
      });
    },
    writer(){
      if(!this.$tokenCheck()){
        this.$router.push("/login");
      } else {  
        this.$router.push("/articleWrite");
      }
    }
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
</style>