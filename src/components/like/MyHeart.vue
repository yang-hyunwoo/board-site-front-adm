<template>
    <section class="py-5 text-center container">
           <div class="row py-5">
         <div class="col-lg-12 mx-auto">
           <div class="text-white p-5 shadow-sm rounded banner">
             <h1 class="display-4">좋아요 목록</h1>
           </div>
         </div>
       </div>
     </section>
   
    <div class="album py-5 bg-light">
       <div class="container">
   
         <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
   
           <div class="col curcus" v-for="(item,index) of like_list"   :key="index" @click="todoCclick(item.id)">
             <div class="card shadow-sm">
               
               <svg v-if="!item.img_chk" class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></svg>
               <img v-if="item.img_chk" :src="item.img" class="bd-placeholder-img card-img-top" width="100%" height="225">
               <div class="card-body">
                 <p class="card-text">{{item.title}}</p>
                 <div class="d-flex justify-content-between align-items-center">
                   <div class="btn-group">
                       <p>{{item.name}} ({{item.city}})</p>
                   </div>
                       <small class="text-muted">조회 : {{item.read_count}}</small>
                       <img  v-bind:src= "heartFill" style="width: 28px;"  v-on:click.stop="likeBtn(item.id)" >
                 </div>
                      <small class="text-muted">{{item.start_de}} ~ {{item.end_de}}</small>        
                      <div>
                        <small class="text-muted">가격:<span class="deco">{{item.real_pay}}</span> <span style="color: red;">{{item.sale_percent}}</span>  {{item.sale_pay}} </small>        
                      </div>        
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
    <BlackBg v-if="loading"></BlackBg>
   <Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal" :currPage="currPage"></Pagination>
   </template>
   
   <script>
   import Pagination from '../layout/Pagination'
   import BlackBg from "../loading/BlackBg"
   import heart from "../../assets/heart.svg"
   import heartFill from "../../assets/heart-fill.svg"
   
   export default {
       data: function () {
       return {
         pageListItem : 9 ,
         page : 0 ,
         travel_title : "" ,
         pageTotal : 0 ,
         currPage: 1,
         pageChk : false ,
         like_list : [] ,
         loading:false,
         heart : heart,
         heartFill : heartFill,
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
           this.likeList();
       },
       likeList() {
         const headers = {
               'Authorization': 'Bearer ' + sessionStorage.getItem("token")
           }
         let parameter = {
           "page" : this.page,
         }
         this.loading = true;
         this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_LIST_LIKE_LIST,{headers,params:parameter}).then((res) =>{
            if(res.data.resultCode=="SUCCESS"){
             this.pageTotal = res.data.result.totalElements;
               this.like_list=[];
               res.data.result.content.forEach(element => {
                   let obj = [];
                   obj.title         = element.talTitle;
                   obj.name          = element.taName;
                   obj.id            = element.talId;
                   obj.city          = element.talCity;
                   obj.start_de      = this.$splitDateHyphen(element.talTravelStartAt);
                   obj.end_de        = this.$splitDateHyphen(element.talTravelEndAt);
                   obj.read_count    = element.talReadCount;
                   obj.real_pay      = element.talRealPaid+"원";
                   obj.sale_percent  = element.talSalePercent+"%";
                   obj.sale_pay      = element.talSalePaid+"원";
                   if(element.talThumbnail ==null || element.talThumbnail==""){
                     obj.img_chk = false;
                   } else{
                     obj.img_chk = true;
                   }
                     obj.img     = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+element.talThumbnail+"/"+1;

                   this.like_list.push(obj);
               });
             }
           }).catch(() => {
                this.$swal('','잠시후 다시 이용해주세요.','error');
           }).finally(() => {
                if(this.pageTotal==0){
                    this.pageChk = false;
                } else {
                    this.pageChk = true;
                }

             this.loading = false;
           });
       },
   
       pageCurr(value){
         this.page = value-1;
         this.likeList();
       },
   
       travelSearch(){
          this.page = 0;
          this.pageChk=false;
          this.likeList();
       },
   
   
       todoCclick(value) {
          this.$router.push({
           path: "/TravelDetail",
           name: "travelDetail",
           query: { sn: value }
         });
       },
   
       likeBtn(id) {
                 const headers = {
                       'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                   }
                   this.$axios.post(process.env.VUE_APP_TRAVEL_AGENCY_LIST_LIKE+id,"",{headers}).then((res) =>{
                   if(res.data.resultCode=="SUCCESS"){
                      if((this.pageTotal-1)%9==0){
                          this.pageChk = false;
                          this.currPage=((this.pageTotal-1)/9);
                          this.page = ((this.pageTotal-1)/9)-1;
                      }
                      this.likeList();
                     }
                   }).catch(() => {
                       this.$swal('','잠시후 다시 이용해주세요.','error');
                   }).finally(() => {
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
   </style>