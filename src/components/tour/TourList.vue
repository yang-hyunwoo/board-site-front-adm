<template>
    <section class="py-5 text-center container">
           <div class="row py-5">
         <div class="col-lg-12 mx-auto">
           <div class="text-white p-5 shadow-sm rounded banner">
             <h1 class="display-4">여행지 리스트</h1>
             <p class="lead">나에게 맞는 여행지를 찾아보세요</p>
             <select class="form-select" aria-label="Default select example" v-model="search_type">
              <option selected value="TITLE">제목</option>
              <option value="CITY">도시</option>
            </select>
              <input class="form-control mr-sm-2 custombar" type="search" placeholder="제목을 입력해주세요." aria-label="Search" v-model="tour_title" v-on:keyup.enter="tourSearch">
             <button class="btn btn-outline-success my-2 my-sm-0" style="margin-left:1rem;" @click="tourSearch" >Search</button>
       
           </div>
         </div>
       </div>
     </section>
    
    <div class="album py-5 bg-light">
       <div class="container">
   
         <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
   
           <div class="col curcus" v-for="(item,index) of tour_list"   :key="index" @click="todoCclick(item.id)">
             <div class="card shadow-sm">
               
               <svg v-if="!item.img_chk" class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></svg>
               <img v-if="item.img_chk" :src="item.img" class="bd-placeholder-img card-img-top" width="100%" height="225">
               <div class="card-body">
                 <p class="card-text">{{item.title}}</p>
                 <div class="d-flex justify-content-between align-items-center">
                   <div class="btn-group">
                       <p>도시 명 : {{item.city}}</p>
                   </div>
                       <small class="text-muted">조회 : {{item.read_count}}</small>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
    <BlackBg v-if="loading"></BlackBg>
   <Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal"></Pagination>
   </template>
   
   <script>
   import Pagination from '../layout/Pagination';
   import BlackBg from "../loading/BlackBg"
   export default {
       data: function () {
       return {
         pageListItem : 9 ,
         page : 0 ,
         tour_title : "" ,
         pageTotal : 0 ,
         pageChk : false ,
         tour_list : [] ,
         loading:false,
         search_type:"TITLE"
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
           this.tourList();
       },
       tourList() {
   
         let parameter = {
           "page" : this.page,
           "searchKeyWord" : this.tour_title,
           "searchType" : this.search_type,
         }
         this.loading = true;
         this.$axios.get(process.env.VUE_APP_TOUR_LIST,{params:parameter}).then((res) =>{
            if(res.data.resultCode=="SUCCESS"){
             this.pageTotal = res.data.result.totalElements;
               this.tour_list=[];
               res.data.result.content.forEach(element => {
                   let obj = [];
                   obj.title         = element.title;
                   obj.id            = element.id;
                   obj.city          = element.city;
                   obj.read_count    = element.readCount;
                   if(element.thumbnailId ==null || element.thumbnailId==""){
                     obj.img_chk = false;
                   } else{
                     obj.img_chk = true;
                   }
                     obj.img     = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+element.thumbnailId+"/"+1;
   
                   this.tour_list.push(obj);
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
         this.tourList();
       },
   
       tourSearch(){
          this.page = 0;
          this.pageChk=false;
          this.tourList();
       },
   
   
       todoCclick(value) {
          this.$router.push({
           path: "/tourDetail",
           name: "tourDetail",
           query: { sn: value }
         });
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
   </style>
   