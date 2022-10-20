<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="hello">
    <div style="margin-top: 3rem;">
    <FullCalendar :options="calendarOptions"/>
    <div style="display: flex;">
      <div style="width:50%">
        <LineChart :laebelss="laebelss" :datass="datass" v-if="chartChk"></LineChart>
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
      chartChk:false,
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
          // { title: '아리아리2', date: '2022-10-05',id:"255" },
        ],
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth'
      },
      laebelss :[],
      datass : [10] ,
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
      this.travelAgencyListSort();
      this.travelAgencyPayCount();
    },
    handleDateClick:function(arg) {
      this.$router.push({
            path: "/travelList",
            name: "travelList",
            query: { sn: arg.dateStr }
        });
    },
    fn_calEventClick:function(arg){
      this.$router.push({
            path: "/travelDetail",
            name: "travelDetail",
            query: { sn: arg.event.id }
        });
    },
    travelAgencyListSort() {
      const headers = { 
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
      this.$axios.get(process.env.VUE_APP_TRAVEL_SCH,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            console.log(res);
            this.calendarOptions.events=[];
            res.data.result.forEach(element => {
                let obj = {};
                obj.title               = element.title;
                obj.date  = element.travelRealTripAt.substr(0,4)+"-"+element.travelRealTripAt.substr(4,2)+"-"+element.travelRealTripAt.substr(6)
                obj.id                  = element.id;
            this.calendarOptions.events.push(obj);
            });
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.chk = true;
        });
    },

    travelAgencyPayCount() {
      const headers = { 
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }

      this.$axios.get(process.env.VUE_APP_TRAVEL_PAY_COUNT,{headers}).then((res) =>{
          if(res.data.resultCode=="SUCCESS"){
            console.log(res);
            this.laebelss=[];
            this.datass=[];
            res.data.result.forEach(element => {
                let obj = [];
                obj.push(element.date.substr(5,2)+element.date.substr(7,3));
                this.datass.push(element.count);
                 this.laebelss.push(obj);
            });
            this.chartChk = true;
          }
        }).catch(() => {
             this.$swal('','잠시후 다시 이용해주세요.','error');
        }).finally(() => {
          this.chk = true;
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