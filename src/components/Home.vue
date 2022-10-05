<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="hello">
    <div style="margin-top: 3rem;">
    <FullCalendar :options="calendarOptions" />
    <div style="display: flex;">
      <div style="width:50%">
        <LineChart :laebelss="laebelss" :datass="datass"></LineChart>
      </div>
      <div>리스트 넣기 </div>
    </div>
  </div>

  </div>
</template>

<script>
import login from "../assets/test.png"
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import LineChart from './chart/LineChart.js'

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
      calendarOptions: {
        locale:"ko",
        contentHeight: 500,
        dateClick: this.handleDateClick,
        eventClick : this.fn_calEventClick,
        events: [
          { title: '아리아리', date: '2022-10-05' ,id:"1"},
          { title: '아리아리2', date: '2022-10-05',id:"255" },
          { title: 'event 2', date: '2022-10-06' },
          { title: 'event 2', date: '2022-09-28' }
        ],
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth'
      },
      laebelss :['10/05','10/06','10/07','10/08','10/09','10/10','10/11'],
      datass : [10,20,30,40,50,60,70] ,
    }
  },
  components: {
    FullCalendar,
    LineChart,
    
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
    handleDateClick:function(arg) {
      console.log(arg);
      alert('date click! ' + arg.dateStr)
    },
    fn_calEventClick:function(arg){
      console.log(JSON.stringify(arg));
      console.log(arg.event.title);
      console.log(arg.event.id);
      // alert();
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