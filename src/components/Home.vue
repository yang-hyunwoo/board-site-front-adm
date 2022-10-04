<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1> -->
    <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators" v-if="chk">
      <button  v-for="(item,index) of travel_agency_list_length" :key="index" :class="{active:index==0}" type="button" data-bs-target="#myCarousel" :data-bs-slide-to=index aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div :class='index == 0 ? "carousel-item active" : "carousel-item"' style="height: 29rem;"  v-for="(item,index) of travel_agency_list" :key="index" >
          <svg v-if="!item.img_real" class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>
          <img v-if="item.img_real" v-bind:src= "item.img" style="width: 100%; height: 100%;" >
         <div class="container">
          <div  class="carousel-caption text-start" > <!--text-start , null text-end -->
            <h1>{{item.title}}</h1>
            <p>여행사: {{item.travel_agency_name}}</p>
            <p><button class="btn btn-lg btn-primary" href="#" @click="pageTravelDetail(item.id)">{{$numberWithCommas(item.paid)}}원</button></p>
          </div>
        </div>
      </div>
     
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

<div class="container marketing mgt" style="text-align:center">
    <p>추천 여행사</p>
    <div class="row">
      <div class="col-lg-4" v-for="(item,index) of agency_random_list" :key="index">
      <!-- <img :src="item.imgId" class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg"> -->
      <div v-if="!item.img_real">
       <svg class="bd-placeholder-img rounded-circle" width="140" height="140" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>
      </div>
      <div v-if="item.img_real">
        <img :src="item.img" class="rounded-circle" width="140" height="140">
      </div>
        <h2 class="fw-normal">{{item.name}}</h2>
        <p style="text-overflow:ellipsis">{{item.comment}}</p>
        <p><a class="btn btn-secondary" @click="agencyDetailClick(item.agency_id)">{{item.name}} 여행사 둘러보기</a></p>
      </div>
    </div><!-- /.row -->

    <br>
    <h4>이런 관광지는 어떤가요?</h4>
    <div v-for="(item,index) of tour_list" :key="index">
    <hr class="featurette-divider">

    <div class="row featurette">
      <div class="col-md-7 " v-if="index%2==0">

        <h2 class="featurette-heading fw-normal lh-1" @click="tourList(item.id)" style="cursor: pointer;">{{item.city}}</h2>
        <p class="lead">{{item.content}}</p>
      </div>
      <div class="col-md-5 order-md-2" >
        <div v-if="!item.img_real">
          <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
      </div>
      <div v-if="item.img_real">
        <img :src="item.img" width="500" height="500">
      </div>
      </div>
      <div class="col-md-7 order-md-2" v-if="index%2!=0">

      <h2 class="featurette-heading fw-normal lh-1" @click="tourList(item.id)" style="cursor: pointer;">{{item.city}}</h2>
        <p class="lead">{{item.content}}</p>
        </div>
    </div>
  </div>

</div>
  </div>
</template>

<script>
import login from "../assets/test.png"
// import hideKey from 'dotenv';

export default {
  data: function () {
    return {
      login  : login ,
      index : 0,
      chk :false,
      agency_random_list : [],
      travel_agency_list_length : 0,
      travel_agency_list: [],
      tour_list:[],
    }
  },

  created(){
    this.index = 0;
    this.chk = true;
    this.init();
  },

  methods: {

    init() {
      this.travelAgencyRandom();
      this.travelAgencyListSort();
      this.tourRandom();
    },

    travelAgencyListSort() {
      this.chk = false;
      this.$axios.get(process.env.VUE_APP_TRIP_AGENCY_LIST_SORT).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            this.travel_agency_list_length = res.data.result.length;
            this.travel_agency_list=[];
            res.data.result.forEach(element => {
                let obj = [];
                obj.title               = element.title;
                obj.travel_agency_name  = element.travelAgencyName;
                obj.paid                = element.sale_paid;
                obj.id                  = element.id;
              if(element.thumnbnailFileId==null || element.thumnbnailFileId==""){
                obj.img_real = false;
              } else{
                obj.img_real = true;
              }
              obj.img    = process.env.VUE_APP_FILE_IMAGE_READ+element.thumnbnailFileId+"/"+1;
              this.travel_agency_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.chk = true;
        });
    },

    travelAgencyRandom() {
        this.$axios.get(process.env.VUE_APP_TRIP_AGENCY_RANDOM).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            this.agency_random_list=[];
            res.data.result.forEach(element => {
             
              let obj = [];
              obj.name      = element.name;
              obj.agency_id = element.id;
              obj.comment    = element.comment;
              if(element.fileId==null || element.fileId==""){
                obj.img_real = false;
              } else{
                obj.img_real = true;
              }
              obj.img    = process.env.VUE_APP_FILE_IMAGE_READ+element.fileId+"/"+1;
              this.agency_random_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
        });
    },
    tourRandom() {
      this.$axios.get(process.env.VUE_APP_TOUR_RANDOM).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            console.log(res);
            this.tour_list=[];
            res.data.result.forEach(element => {
              let obj = [];
              obj.city      = element.city;
              obj.id = element.id;
              obj.content    = element.content;
              if(element.thumbnailId==null || element.thumbnailId==""){
                obj.img_real = false;
              } else{
                obj.img_real = true;
              }
              obj.img    = process.env.VUE_APP_FILE_IMAGE_READ+element.thumbnailId+"/"+1;
              this.tour_list.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
        });
    },
    agencyDetailClick(value) {
        this.$router.push({
            path: "/agencyDetail",
            name: "agencyDetail",
            query: { sn: value }
        });
    },
    pageTravelDetail(value){
      this.$router.push({
            path: "/travelDetail",
            name: "travelDetail",
            query: { sn: value }
      });
    },  
    tourList(value){
      this.$router.push({
            path: "/tourDetail",
            name: "tourDetail",
            query: { sn: value }
      });
    },
  }

}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.mgt{
  margin-top: 1.5rem;
}
</style>