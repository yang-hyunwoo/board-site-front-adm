<template>
<div class="margincustom margintpcust">
    <h2>{{agency_name}}</h2>
</div>
<div class="margincustom" style="margin-top:2rem;">
  {{agency_comment}} <br>
   {{agency_address}} <br>
   {{agency_tel}} 
</div>

    <ToastViewer v-if="detail_viewer" :content="content"></ToastViewer>
            <div class="d-flex flex-column comment-section">
                
                <div class="bg-light p-2">
                    <h3>{{agency_name}} 의 여행 목록</h3>
                   <div class="album py-5 bg-light">
                            <div class="container">

                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 ">

                                <div class="col curcus cursor" v-for="(item,index) of travel_list"   :key="index" @click="todoCclick(item.id)">
                                <div class="card shadow-sm">
                                    <svg v-if="!item.img_chk" class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                                    <img v-if="item.img_chk" class="bd-placeholder-img card-img-top" width="100%" height="225" :src="item.img">
                                    <div class="card-body">
                                    <p class="card-text">{{item.title}}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="btn-group">
                                           <p>{{item.name}} ({{item.city}})</p>
                                        </div>
                                            <small class="text-muted">조회 : {{item.read_count}}</small>
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
                </div>
    </div>
<BlackBg v-if="loading"></BlackBg>
<Pagination v-if="pageChk" :pageListItem="pageListItem" @pageCurrent="pageCurr" :pageTotal="pageTotal"></Pagination>
</template>


<script>

import ToastViewer from '@/components/editor/ToastViewer.vue'
import BlackBg from "../loading/BlackBg"
import Pagination from '../layout/Pagination';
export default {
	data: function () {
    return {
        articleId:this.$route.query.sn,
        loading:false,
        pageListItem : 3 ,
        page : 0 ,
        pageTotal : 0 ,
        pageChk : false ,
        title : "",
        agency_name : "",
        agency_comment : "",
        detail_viewer:false,
        content:"",
        travel_list : [],
        agency_address:"",
        agency_tel:"",
    }
  },
  components :{
        ToastViewer,
        BlackBg,
        Pagination,
  },
  created(){
    this.init();
  },    
  methods: {
      init() {
        this.agencyInit();
      },

      agencyInit() {
        this.loading = true;
         this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_DETAIL+this.articleId).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
                this.agency_name = res.data.result.name;
                this.agency_comment = res.data.result.comment;
                this.agency_address = res.data.result.address;
                this.agency_tel     = res.data.result.tel;
                this.content        = res.data.result.detail;
          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
        //   this.loading = false;
          this.detail_viewer = true;
          this.agencyTravelListInit();
        });
        },

        agencyTravelListInit() {
            let parameter = {
            "page" : this.page
            }
         this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_TRAVEL_LIST+this.articleId,{params:parameter}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
              this.pageTotal = res.data.result.totalElements;
              this.travel_list=[];
                res.data.result.content.forEach(element => {
                let obj = [];
                obj.title         = element.title;
                obj.name          = element.travelAgencyName;
                obj.id            = element.id;
                obj.city          = element.city;
                obj.start_de      = this.$splitDateHyphen(element.travel_start_at);
                obj.end_de        = this.$splitDateHyphen(element.travel_end_at);
                obj.read_count    = element.read_count;
                obj.real_pay      = element.real_paid+"원";
                obj.sale_percent  = element.sale_percent+"%";
                obj.sale_pay      = element.sale_paid+"원";
                if(element.thumnbnailFileId ==null || element.thumnbnailFileId==""){
                  obj.img_chk = false;
                } else{
                  obj.img_chk = true;
                }
                  obj.img     = process.env.VUE_APP_FILE_IMAGE_THUMB_READ+element.thumnbnailFileId+"/"+1;

                this.travel_list.push(obj);
            });

            if(this.pageTotal==0){
                  this.pageChk = false;
            } else {
                this.pageChk = true;
            }

          }
        }).catch((error) => {
             this.$swal('',error.response.data.result,'error');
        }).finally(() => {
          this.loading = false;
        });
        },

        pageCurr(value){
            this.page = value-1;
            this.agencyTravelListInit();
        },
        
        todoCclick(value) {
           this.$router.push({
            path: "/TravelDetail",
            name: "travelDetail",
            query: { sn: value }
        });
        }



  }

}
</script>

<style scoped>
body{
  background: #eee
  }
.date{
  font-size: 11px
  }
.comment-text{
  font-size: 12px
}
.fs-12{
  font-size: 12px
}
.shadow-none{
  box-shadow: none
}.name{
  color: #007bff
}
.cursor:hover{
  color: blue
}
.cursor{
  cursor: pointer
}
.textarea{
  resize: none
}
  .margincustom {
    margin-left : 2rem;
  }
  .margintpcust {
    margin-top : 2rem;
  }
.deco{
  text-decoration: line-through;
}
.btn-cl-cus-upd {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    /* width : 15%; */
    font-size: 13px;
} 
.btn-cl-cus-del {
    background-color: rgba(0,0,0,0);
    color: red;
    border: 0px ;
    /* width : 15%; */
    font-size: 13px;
} 
.custom-div {
  display: flex;
  justify-content: end;
  margin-top:2rem;
}
.btn-cl-cus {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    width : 15%;
    font-size: 13px;
} 
.btn-cl-cus {
    background-color: rgba(0,0,0,0);
    color: skyblue;
    border: 0px ;
    width : 15%;
    margin-top: 1rem;
} 
.cursor{
  cursor: pointer
}
</style>