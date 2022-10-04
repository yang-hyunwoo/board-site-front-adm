<template>
<div class="container-fluid">
  <div class="px-lg-5">

    <!-- For demo purpose -->
    <div class="row py-5">
      <div class="col-lg-12 mx-auto">
        <div class="text-white p-5 shadow-sm rounded banner" style="text-align:center">
          <h1 class="display-4">여행사</h1>
          <p class="lead">나에게 적합한 여행사를 찾아보세요.</p>
           <input style="margin-left:1rem;" class="form-control mr-sm-2 custombar" type="search"  aria-label="Search" v-model="agency_title" v-on:keyup.enter="agencySearch">
           <button class="btn btn-outline-success my-2 my-sm-0" style="margin-left:1rem;" @click="articleSearch" >Search</button>

        </div>
      </div>
    </div>
    <!-- End -->

    <div class="row">
      <!-- Gallery item -->
      <div class="col-xl-3 col-lg-4 col-md-6 mb-4" v-for="(item,index) of agency_list" :key="index" @Click="agency_click(item.id)" style="cursor:pointer;">
        <div v-if="!item.img_real">
        <div class="rounded shadow-sm image-wrap no-image">
        </div>
      </div>
      <div v-if="item.img_real">
        <div class="bg-white rounded shadow-sm image-wrap" >
          <img :src="item.img" class="img-fluid card-img-top">
        </div>
      </div>
         <div style="margin-top:10px">
            <h5> <a href="#" class="text-dark">{{item.agency_name}}</a></h5>
            <p class="small text-muted mb-0">{{item.agency_comment}}</p>
            <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">
              <p class="small mb-0"><span class="font-weight-bold">{{item.address}}</span></p>
            </div>
            <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">
              <p class="small mb-0"><span class="font-weight-bold">{{item.tel}}</span></p>
            </div>
          </div>
        </div>
      <!-- End -->
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
      pageListItem : 8 ,
      page : 0 ,
      pageTotal : 0 ,
      pageChk : false ,
      loading : false,
      agency_list : [],
      agency_title:"",
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
    },

    agencyList() {
      let parameter = {
        "page"                 : this.page , 
        "travelAgencyName"     : this.agency_title
      }
      this.loading = true;
             this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_LIST,{params:parameter}).then((res) =>{
         if(res.data.resultCode=="SUCCESS"){
          this.pageTotal = res.data.result.totalElements;
            this.agency_list=[];
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
    }



  }

}
</script>

<style scoped>

body {
  background: #f4f4f4;
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
.image-wrap{
  height:200px;
  overflow: hidden;
}
.image-wrap.no-image{
 background: gray;
}
.image-wrap>image{
  height:100%;
}
.img-fluid{
  max-width: 100%;
    height: 100%;
}
</style>