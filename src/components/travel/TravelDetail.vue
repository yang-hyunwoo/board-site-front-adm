<template>
<div class="margincustom margintpcust">
    <h2>{{title}}</h2>
</div>
<div class="margincustom">
  {{travel_name}} 
</div>
<div class="margincustom">
  <span style="font-size:13px;">기간 : {{start_at}}~{{end_at}}</span> <span style="font-size:13px; color: gray;">조회수:{{read_count}}</span>
</div>
   
   <ToastViewer v-if="detail_viewer" :content="content"></ToastViewer>
  <span class="margincustom" style="font-size:15px;">가격:<span class="deco" >{{$numberWithCommas(real_pay)}}</span><span style="color:red; margin-left: 1rem;">{{sale_percent}}</span> <span style="margin-left:1rem;">{{$numberWithCommas(sale_paid)}}</span></span>
<div style="margin-top:30px;text-align:center">
  <button style="width:30%;min-width:300px" class="btn btn-primary" type="button" @click="reserve" >결제인원 확인</button>
</div>
<BlackBg v-if="loading"></BlackBg>
</template>


<script>

import ToastViewer from '@/components/editor/ToastViewer.vue'
import BlackBg from "../loading/BlackBg"
export default {
  
	data: function () {
    return {
        articleId    : 0,
        contentType  : '',
        travelDetail : this.$route.query.sn,
        detail_viewer: false,
        content:"",
        loading:false,
        title:"",
        travel_name:"",
        read_count:0,
        sale_percent:0,
        sale_paid:0,
        start_at:"",
        end_at:"",
        real_pay:0,
        person_max_count: 0,
        person_count:0
    }
  },
  components :{
        ToastViewer,
        BlackBg
  },
  created(){
    this.articleId=Number(this.travelDetail);
    this.contentType ="travel"
    this.init();
  },    
  methods: {
    init(){
        this.travelDetailAxios();
    },
    travelDetailAxios() {
      const headers = {
                'Authorization': 'Bearer ' + sessionStorage.getItem("token")
            }
        this.loading = true;
        this.$axios.get(process.env.VUE_APP_TRAVEL_AGENCY_LIST_CRUD+this.articleId,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            // content              = res.data.result.content;
            this.title          = res.data.result.title;
            this.travel_name    = res.data.result.travelAgencyName;
            this.read_count     = res.data.result.read_count;
            this.start_at       = this.$splitDateHyphen(res.data.result.travel_start_at);
            this.end_at         = this.$splitDateHyphen(res.data.result.travel_end_at);
            this.real_pay       = res.data.result.real_paid+" 원";
            this.sale_percent   = res.data.result.sale_percent+" %";
            this.sale_paid      = res.data.result.sale_paid+" 원";
            this.content        = res.data.result.content;
            this.person_max_count = res.data.result.person_max_count;
            this.person_count = res.data.result.person_count;
          }
        }).catch(() => {
           history.back(-1);
        }).finally(() => {
          this.detail_viewer =true;
          this.loading = false;
        });
    },

    reserve(){
      this.$router.push({
        path: "/PurchaseHistory",
        name: "purchaseHistory",
        query: { sn: this.travelDetail }
      });
    }

  }

}
</script>

<style>
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

</style>